import { Router } from 'express';
import Expense from '../models/Expense';
import Group from '../models/Group';
import { authHandler, AuthRequest } from '../middleware/authHandler';

const router = Router();

router.post('/', authHandler, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { groupId, amount, description, splits } = req.body;
    const paidBy = req.user?.userId;

    if (!paidBy) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Validate group exists and user is part of it
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const newExpense = new Expense({
      groupId,
      paidBy,
      amount,
      description,
      splits,
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/group/:groupId', authHandler, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { groupId } = req.params;
    if (!groupId) {
      res.status(400).json({ message: 'Group ID is required' });
      return;
    }
    const expenses = await Expense.find({ groupId })
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email')
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
