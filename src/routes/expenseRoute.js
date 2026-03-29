"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Expense_1 = __importDefault(require("../models/Expense"));
const Group_1 = __importDefault(require("../models/Group"));
const authHandler_1 = require("../middleware/authHandler");
const router = (0, express_1.Router)();
router.post('/', authHandler_1.authHandler, async (req, res) => {
    try {
        const { groupId, amount, description, splits } = req.body;
        const paidBy = req.user?.userId;
        if (!paidBy) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Validate group exists and user is part of it
        const group = await Group_1.default.findById(groupId);
        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }
        const newExpense = new Expense_1.default({
            groupId,
            paidBy,
            amount,
            description,
            splits,
        });
        await newExpense.save();
        res.status(201).json(newExpense);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/group/:groupId', authHandler_1.authHandler, async (req, res) => {
    try {
        const { groupId } = req.params;
        if (!groupId) {
            res.status(400).json({ message: 'Group ID is required' });
            return;
        }
        const expenses = await Expense_1.default.find({ groupId })
            .populate('paidBy', 'name email')
            .populate('splits.user', 'name email')
            .sort({ createdAt: -1 });
        res.json(expenses);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=expenseRoute.js.map