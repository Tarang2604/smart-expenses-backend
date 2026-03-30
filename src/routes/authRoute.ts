import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authHandler, AuthRequest } from '../middleware/authHandler';

const router = Router();

router.post('/signup', async (req, res): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    console.log('[signup] attempt for:', email);

    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user = new User({ name, email, passwordHash });
    await user.save();

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not set');

    const payload = { userId: user.id };
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    console.log('[signup] success for:', email);
    res.status(201).json({ token, user: { id: user.id, name, email } });
  } catch (err) {
    console.error('[signup] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log('[login] attempt for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid Credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid Credentials' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not set');

    const payload = { userId: user.id };
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    console.log('[login] success for:', email);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('[login] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authHandler, async (req: AuthRequest, res): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error('[me] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
