import { prisma } from '../database/prisma';
import { BlackjackEngine } from '../blackjack/engine';
import { Deck } from '../blackjack/deck';
import { AchievementService } from './achievementService';
import { ChallengeService } from './challengeService';

// Active game engines in memory indexed by gameId
const activeEngines = new Map<string, BlackjackEngine>();

// One shared shoe (sabot) per user — persists between games so card counts are real
const userShoes = new Map<string, Deck>();

const NUM_DECKS = 6;

export class GameService {
  static async createGame(userId: string, bet: number, numDecks: number = NUM_DECKS) {
    if (bet <= 0) throw new Error('Mise doit être supérieure à 0');

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profil introuvable');

    if (profile.credits < bet) {
      throw new Error(`Solde insuffisant (${profile.credits} CR disponibles)`);
    }

    // Deduct initial bet
    const balanceBefore = profile.credits;
    const balanceAfter = balanceBefore - bet;

    await prisma.profile.update({
      where: { userId },
      data: { credits: balanceAfter },
    });

    const game = await prisma.game.create({
      data: {
        userId,
        bet,
        numDecks,
        status: 'PLAYING',
      },
    });

    await prisma.transaction.create({
      data: {
        userId,
        gameId: game.id,
        type: 'BET',
        amount: -bet,
        balanceBefore,
        balanceAfter,
      },
    });

    // Get or create the shared shoe for this user
    let shoe = userShoes.get(userId);
    if (!shoe) {
      shoe = new Deck(NUM_DECKS);
      userShoes.set(userId, shoe);
    }

    // Pass the shared shoe to the engine — engine will auto-reshuffle if needed
    const engine = new BlackjackEngine(game.id, numDecks, undefined, shoe);
    engine.startNewGame(bet);
    activeEngines.set(game.id, engine);

    const dto = engine.toDTO();
    await GameService.syncGameState(game.id, dto, engine);

    if (dto.status === 'FINISHED') {
      await GameService.handleGameFinished(userId, game.id, engine);
    }

    return dto;
  }

  static async hit(userId: string, gameId: string) {
    const engine = await GameService.getEngine(userId, gameId);
    engine.hit();
    return GameService.processEngineState(userId, gameId, engine, 'HIT');
  }

  static async stand(userId: string, gameId: string) {
    const engine = await GameService.getEngine(userId, gameId);
    engine.stand();
    return GameService.processEngineState(userId, gameId, engine, 'STAND');
  }

  static async doubleDown(userId: string, gameId: string) {
    const engine = await GameService.getEngine(userId, gameId);
    const currentHand = engine.getCurrentHand();
    const extraBet = currentHand.bet;

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile || profile.credits < extraBet) {
      throw new Error('Solde insuffisant pour doubler');
    }

    const balanceBefore = profile.credits;
    const balanceAfter = balanceBefore - extraBet;

    await prisma.profile.update({
      where: { userId },
      data: { credits: balanceAfter },
    });

    await prisma.transaction.create({
      data: {
        userId,
        gameId,
        type: 'BET',
        amount: -extraBet,
        balanceBefore,
        balanceAfter,
      },
    });

    engine.doubleDown();
    return GameService.processEngineState(userId, gameId, engine, 'DOUBLE');
  }

  static async split(userId: string, gameId: string) {
    const engine = await GameService.getEngine(userId, gameId);
    const currentHand = engine.getCurrentHand();
    const extraBet = currentHand.bet;

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile || profile.credits < extraBet) {
      throw new Error('Solde insuffisant pour séparer (Split)');
    }

    const balanceBefore = profile.credits;
    const balanceAfter = balanceBefore - extraBet;

    await prisma.profile.update({
      where: { userId },
      data: { credits: balanceAfter },
    });

    await prisma.transaction.create({
      data: {
        userId,
        gameId,
        type: 'BET',
        amount: -extraBet,
        balanceBefore,
        balanceAfter,
      },
    });

    engine.split();
    return GameService.processEngineState(userId, gameId, engine, 'SPLIT');
  }

  static async surrender(userId: string, gameId: string) {
    const engine = await GameService.getEngine(userId, gameId);
    engine.surrender();
    return GameService.processEngineState(userId, gameId, engine, 'SURRENDER');
  }

  static async placeInsurance(userId: string, gameId: string, accept: boolean) {
    const engine = await GameService.getEngine(userId, gameId);

    if (accept) {
      const insuranceCost = Math.floor(engine.initialBet * 0.5);
      const profile = await prisma.profile.findUnique({ where: { userId } });
      if (!profile || profile.credits < insuranceCost) {
        throw new Error('Solde insuffisant pour l\'assurance');
      }

      const balanceBefore = profile.credits;
      const balanceAfter = balanceBefore - insuranceCost;

      await prisma.profile.update({
        where: { userId },
        data: { credits: balanceAfter },
      });

      await prisma.transaction.create({
        data: {
          userId,
          gameId,
          type: 'INSURANCE',
          amount: -insuranceCost,
          balanceBefore,
          balanceAfter,
        },
      });
    }

    engine.placeInsurance(accept);
    return GameService.processEngineState(userId, gameId, engine, 'INSURANCE');
  }

  private static async getEngine(userId: string, gameId: string): Promise<BlackjackEngine> {
    const engine = activeEngines.get(gameId);
    if (!engine) {
      throw new Error('Partie introuvable ou déjà terminée');
    }
    return engine;
  }

  private static async processEngineState(
    userId: string,
    gameId: string,
    engine: BlackjackEngine,
    actionType: string
  ) {
    const dto = engine.toDTO();

    await prisma.action.create({
      data: {
        gameId,
        handIndex: dto.activeHandIndex,
        type: actionType,
      },
    });

    // Increment decision counter in user statistics
    const statFieldMap: Record<string, string> = {
      HIT: 'hitsCount',
      STAND: 'standsCount',
      DOUBLE: 'doublesCount',
      SPLIT: 'splitsCount',
      SURRENDER: 'surrendersCount',
    };

    const fieldToIncrement = statFieldMap[actionType];
    if (fieldToIncrement) {
      await prisma.statistics.update({
        where: { userId },
        data: {
          [fieldToIncrement]: { increment: 1 },
        },
      });
    }

    await GameService.syncGameState(gameId, dto, engine);

    if (dto.status === 'FINISHED') {
      await GameService.handleGameFinished(userId, gameId, engine);
      activeEngines.delete(gameId);
    }

    return dto;
  }

  private static async syncGameState(gameId: string, dto: any, engine: BlackjackEngine) {
    await prisma.game.update({
      where: { id: gameId },
      data: {
        status: dto.status,
        dealerCards: JSON.stringify(dto.dealerHand.cards),
        dealerScore: dto.dealerHand.score,
        dealerBust: dto.dealerHand.isBust,
        activeHandIndex: dto.activeHandIndex,
        payout: dto.payout,
        netProfit: dto.netProfit,
        result: dto.result,
        analysis: JSON.stringify(dto.analysis),
      },
    });

    // Sync hands
    for (const h of dto.hands) {
      const existingHand = await prisma.hand.findFirst({
        where: { gameId, handIndex: h.handIndex },
      });

      if (existingHand) {
        await prisma.hand.update({
          where: { id: existingHand.id },
          data: {
            cards: JSON.stringify(h.cards),
            bet: h.bet,
            status: h.status,
            result: h.result,
            score: h.score,
            isSoft: h.isSoft,
            payout: h.payout || 0,
          },
        });
      } else {
        await prisma.hand.create({
          data: {
            gameId,
            handIndex: h.handIndex,
            cards: JSON.stringify(h.cards),
            bet: h.bet,
            status: h.status,
            result: h.result,
            score: h.score,
            isSoft: h.isSoft,
            payout: h.payout || 0,
          },
        });
      }
    }
  }

  private static async handleGameFinished(userId: string, gameId: string, engine: BlackjackEngine) {
    const dto = engine.toDTO();
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return;

    const balanceBefore = profile.credits;
    const balanceAfter = balanceBefore + dto.payout;

    let winStreak = profile.winStreak;
    let loseStreak = profile.loseStreak;
    let maxWinStreak = profile.maxWinStreak;
    let maxLoseStreak = profile.maxLoseStreak;

    if (dto.result === 'WIN' || dto.result === 'BLACKJACK') {
      winStreak += 1;
      loseStreak = 0;
      if (winStreak > maxWinStreak) maxWinStreak = winStreak;
    } else if (dto.result === 'LOSS') {
      loseStreak += 1;
      winStreak = 0;
      if (loseStreak > maxLoseStreak) maxLoseStreak = loseStreak;
    }

    // Award XP (20 for playing, +50 for win, +100 for BJ, +30 for double)
    let xpGained = 20;
    if (dto.result === 'WIN') xpGained += 50;
    if (dto.result === 'BLACKJACK') xpGained += 100;

    // Calculate level up with new total XP
    let newXp = profile.xp + xpGained;
    let newLevel = profile.level;
    while (newXp >= Math.floor(100 * Math.pow(newLevel + 1, 1.5))) {
      newLevel++;
    }

    await prisma.profile.update({
      where: { userId },
      data: {
        credits: balanceAfter,
        winStreak,
        loseStreak,
        maxWinStreak,
        maxLoseStreak,
        xp: newXp,
        level: newLevel,
      },
    });

    if (dto.payout > 0) {
      await prisma.transaction.create({
        data: {
          userId,
          gameId,
          type: dto.result === 'BLACKJACK' ? 'BLACKJACK' : 'WIN',
          amount: dto.payout,
          balanceBefore,
          balanceAfter,
        },
      });
    }

    // Update aggregate statistics
    await GameService.updateAggregateStats(userId, dto);

    // Track challenges
    await ChallengeService.updateChallengeProgress(userId, 'PLAY_GAMES', 1);
    if (dto.result === 'WIN' || dto.result === 'BLACKJACK') {
      await ChallengeService.updateChallengeProgress(userId, 'WIN_GAMES', 1);
    }
    if (dto.result === 'BLACKJACK') {
      await ChallengeService.updateChallengeProgress(userId, 'GET_BLACKJACK', 1);
    }

    // Check achievement unlocks
    await AchievementService.checkAchievements(userId);
  }

  private static async updateAggregateStats(userId: string, dto: any) {
    const stats = await prisma.statistics.findUnique({ where: { userId } });
    if (!stats) return;

    let isWin = dto.result === 'WIN' || dto.result === 'BLACKJACK';
    let isLoss = dto.result === 'LOSS';
    let isPush = dto.result === 'PUSH';
    let isBJ = dto.result === 'BLACKJACK';

    const netProfit = dto.netProfit;

    await prisma.statistics.update({
      where: { userId },
      data: {
        gamesPlayed: stats.gamesPlayed + 1,
        wins: stats.wins + (isWin ? 1 : 0),
        losses: stats.losses + (isLoss ? 1 : 0),
        pushes: stats.pushes + (isPush ? 1 : 0),
        blackjacks: stats.blackjacks + (isBJ ? 1 : 0),
        totalWagered: stats.totalWagered + dto.bet,
        totalWon: stats.totalWon + (dto.payout > 0 ? dto.payout : 0),
        totalLost: stats.totalLost + (netProfit < 0 ? Math.abs(netProfit) : 0),
        netProfit: stats.netProfit + netProfit,
        biggestBet: Math.max(stats.biggestBet, dto.bet),
        biggestWin: Math.max(stats.biggestWin, dto.payout),
        biggestLoss: Math.max(stats.biggestLoss, netProfit < 0 ? Math.abs(netProfit) : 0),
      },
    });
  }

  static async getGameHistory(userId: string, limit: number = 20) {
    return prisma.game.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        hands: true,
        actions: true,
      },
    });
  }

  static async getGameDetails(userId: string, gameId: string) {
    const game = await prisma.game.findFirst({
      where: { id: gameId, userId },
      include: {
        hands: true,
        actions: true,
      },
    });

    if (!game) throw new Error('Partie non trouvée');
    return game;
  }
}
