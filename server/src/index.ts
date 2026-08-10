import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRoutes from './routes/indexRoutes';
import { logger } from './utils/logger';
import { AchievementService } from './services/achievementService';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  // Allow connections from any origin (localhost, local IP, phone on same WiFi)
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`⚡ [Server] Running on port ${PORT}`);
  AchievementService.seedAchievements()
    .then(() => logger.info('🏆 [Database] Achievements seeded successfully'))
    .catch((err) => logger.error('Error seeding achievements:', err));
});
