import { Router } from 'express';
import { SpeakerController } from '../controllers/speakerController';
import { authMiddleware } from '../middlewares/auth';
import { roleCheck } from '../middlewares/roleCheck';

const router = Router();
const speakerController = new SpeakerController();

// Public routes
router.post('/signup', speakerController.signup);
router.post('/login', speakerController.login);

// Protected routes
router.use(authMiddleware);
router.use(roleCheck(['speaker']));

// Get speaker profile
router.get('/profile', speakerController.getProfile);

// Update speaker profile
router.put('/profile', speakerController.updateProfile);

// Get speaker's scheduled sessions
router.get('/sessions', speakerController.getSpeakerSessions);

// Update session availability
router.put('/availability', speakerController.updateAvailability);

export default router;