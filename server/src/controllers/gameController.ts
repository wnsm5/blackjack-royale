import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { GameService } from '../services/gameService';

export class GameController {
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { bet, numDecks } = req.body;
      const dto = await GameService.createGame(userId, Number(bet), numDecks ? Number(numDecks) : 6);
      return res.status(201).json(dto);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async hit(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { gameId } = req.body;
      const dto = await GameService.hit(userId, gameId);
      return res.json(dto);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async stand(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { gameId } = req.body;
      const dto = await GameService.stand(userId, gameId);
      return res.json(dto);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async double(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { gameId } = req.body;
      const dto = await GameService.doubleDown(userId, gameId);
      return res.json(dto);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async split(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { gameId } = req.body;
      const dto = await GameService.split(userId, gameId);
      return res.json(dto);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async surrender(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { gameId } = req.body;
      const dto = await GameService.surrender(userId, gameId);
      return res.json(dto);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async insurance(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { gameId, accept } = req.body;
      const dto = await GameService.placeInsurance(userId, gameId, Boolean(accept));
      return res.json(dto);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async getHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const history = await GameService.getGameHistory(userId);
      return res.json(history);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const gameId = req.params.id;
      const game = await GameService.getGameDetails(userId, gameId);
      return res.json(game);
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
}
