import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuthService } from '../services/authService';

export class AuthController {
  static async register(req: AuthenticatedRequest, res: Response) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Pseudo, email et mot de passe requis' });
      }

      const result = await AuthService.register(username, email, password);
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async login(req: AuthenticatedRequest, res: Response) {
    try {
      const { emailOrUsername, password } = req.body;
      if (!emailOrUsername || !password) {
        return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
      }

      const result = await AuthService.login(emailOrUsername, password);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async guest(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await AuthService.createGuest();
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response) {
    return res.json({ message: 'Déconnexion réussie' });
  }
}
