import bcrypt from 'bcrypt';
import { prisma } from '../database/prisma';
import { generateToken } from '../utils/jwt';

export class AuthService {
  static async register(username: string, email: string, password: string) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new Error('Cet email est déjà utilisé');
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      throw new Error('Ce pseudo est déjà pris');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        isGuest: false,
        profile: {
          create: {
            credits: 100,
            level: 1,
            xp: 0,
          },
        },
        statistics: {
          create: {},
        },
      },
      include: { profile: true },
    });

    // Record initial transaction
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'BONUS',
        amount: 100,
        balanceBefore: 0,
        balanceAfter: 100,
      },
    });

    const token = generateToken({ userId: user.id, username: user.username, isGuest: false });
    return { user, token };
  }

  static async login(emailOrUsername: string, password: String) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
      include: { profile: true },
    });

    if (!user) {
      throw new Error('Identifiants incorrects');
    }

    const validPassword = await bcrypt.compare(password as string, user.passwordHash);
    if (!validPassword) {
      throw new Error('Identifiants incorrects');
    }

    const token = generateToken({ userId: user.id, username: user.username, isGuest: user.isGuest });
    return { user, token };
  }

  static async createGuest() {
    const guestId = Math.floor(100000 + Math.random() * 900000);
    const username = `Joueur_${guestId}`;
    const email = `guest_${guestId}_${Date.now()}@blackjack.local`;
    const passwordHash = await bcrypt.hash(`guest_${Date.now()}`, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        isGuest: true,
        profile: {
          create: {
            credits: 100,
            level: 1,
            xp: 0,
          },
        },
        statistics: {
          create: {},
        },
      },
      include: { profile: true },
    });

    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'BONUS',
        amount: 10000,
        balanceBefore: 0,
        balanceAfter: 10000,
      },
    });

    const token = generateToken({ userId: user.id, username: user.username, isGuest: true });
    return { user, token };
  }
}
