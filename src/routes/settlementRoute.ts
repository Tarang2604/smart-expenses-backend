import { Router } from 'express';
import Settlement from '../models/Settlement';
import Group from '../models/Group';
import { authHandler, AuthRequest } from '../middleware/authHandler';
import { calculateBalances, simplifyDebts } from '../utils/splitEngine';

const router = Router();

router.post('/', authHandler, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { groupId, paidTo, amount } = req.body;
    const paidBy = req.user?.userId;

    if (!paidBy) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const newSettlement = new Settlement({
      groupId,
      paidBy,
      paidTo,
      amount,
    });

    await newSettlement.save();
    res.status(201).json(newSettlement);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/group/:groupId/balances', authHandler, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { groupId } = req.params;
    if (!groupId) {
       res.status(400).json({ message: 'Group ID is required' });
       return;
    }
    const balances = await calculateBalances(groupId as string);
    
    // get settlements to adjust balances
    const settlements = await Settlement.find({ groupId });
    settlements.forEach(s => {
      const from = s.paidBy.toString();
      const to = s.paidTo.toString();
      if (balances[from] === undefined) balances[from] = 0;
      if (balances[to] === undefined) balances[to] = 0;
      balances[from] -= s.amount;
      balances[to] += s.amount;
    });

    res.json(balances);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/group/:groupId/debts', authHandler, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { groupId } = req.params;
    if (!groupId) {
       res.status(400).json({ message: 'Group ID is required' });
       return;
    }
    const balances = await calculateBalances(groupId as string);
    
    // adjust for settlements
    const settlements = await Settlement.find({ groupId });
    settlements.forEach(s => {
      const from = s.paidBy.toString();
      const to = s.paidTo.toString();
      if (balances[from] === undefined) balances[from] = 0;
      if (balances[to] === undefined) balances[to] = 0;
      balances[from] -= s.amount;
      balances[to] += s.amount;
    });

    const transactions = simplifyDebts(balances);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
