"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Settlement_1 = __importDefault(require("../models/Settlement"));
const authHandler_1 = require("../middleware/authHandler");
const splitEngine_1 = require("../utils/splitEngine");
const router = (0, express_1.Router)();
router.post('/', authHandler_1.authHandler, async (req, res) => {
    try {
        const { groupId, paidTo, amount } = req.body;
        const paidBy = req.user?.userId;
        if (!paidBy) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const newSettlement = new Settlement_1.default({
            groupId,
            paidBy,
            paidTo,
            amount,
        });
        await newSettlement.save();
        res.status(201).json(newSettlement);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/group/:groupId/balances', authHandler_1.authHandler, async (req, res) => {
    try {
        const { groupId } = req.params;
        if (!groupId) {
            res.status(400).json({ message: 'Group ID is required' });
            return;
        }
        const balances = await (0, splitEngine_1.calculateBalances)(groupId);
        // get settlements to adjust balances
        const settlements = await Settlement_1.default.find({ groupId });
        settlements.forEach(s => {
            const from = s.paidBy.toString();
            const to = s.paidTo.toString();
            if (balances[from] === undefined)
                balances[from] = 0;
            if (balances[to] === undefined)
                balances[to] = 0;
            balances[from] -= s.amount;
            balances[to] += s.amount;
        });
        res.json(balances);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/group/:groupId/debts', authHandler_1.authHandler, async (req, res) => {
    try {
        const { groupId } = req.params;
        if (!groupId) {
            res.status(400).json({ message: 'Group ID is required' });
            return;
        }
        const balances = await (0, splitEngine_1.calculateBalances)(groupId);
        // adjust for settlements
        const settlements = await Settlement_1.default.find({ groupId });
        settlements.forEach(s => {
            const from = s.paidBy.toString();
            const to = s.paidTo.toString();
            if (balances[from] === undefined)
                balances[from] = 0;
            if (balances[to] === undefined)
                balances[to] = 0;
            balances[from] -= s.amount;
            balances[to] += s.amount;
        });
        const transactions = (0, splitEngine_1.simplifyDebts)(balances);
        res.json(transactions);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=settlementRoute.js.map