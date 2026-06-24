import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { loginSchema } from '../validators/schemas.js';
import { login, me } from '../controllers/auth.controller.js';

const r = Router();
r.post('/login', validate(loginSchema), login);
r.get('/me', requireAuth, me);
export default r;
