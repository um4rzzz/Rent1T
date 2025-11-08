import express, { Router } from 'express';
import { register, login, listUsers } from '../controllers/authController';

const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', listUsers);

export default router;
