import { Router } from 'express';
import Group from '../models/Group';
import User from '../models/User';
import { authHandler, AuthRequest } from '../middleware/authHandler';

const router = Router();

router.post('/', authHandler, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { name, description, memberEmails } = req.body;
    const createdBy = req.user?.userId;

    let memberIds: string[] = [];
    if (memberEmails && memberEmails.length > 0) {
      const members = await User.find({ email: { $in: memberEmails } });
      memberIds = members.map(m => m.id);
    }
    
    if (createdBy && !memberIds.includes(createdBy)) {
      memberIds.push(createdBy);
    }

    const newGroup = new Group({
      name,
      description,
      members: memberIds,
      createdBy,
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authHandler, async (req: AuthRequest, res): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const groups = await Group.find({ members: userId }).populate('members', 'name email');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', authHandler, async (req: AuthRequest, res): Promise<void> => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'name email');
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
