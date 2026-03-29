"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Group_1 = __importDefault(require("../models/Group"));
const User_1 = __importDefault(require("../models/User"));
const authHandler_1 = require("../middleware/authHandler");
const router = (0, express_1.Router)();
router.post('/', authHandler_1.authHandler, async (req, res) => {
    try {
        const { name, description, memberEmails } = req.body;
        const createdBy = req.user?.userId;
        let memberIds = [];
        if (memberEmails && memberEmails.length > 0) {
            const members = await User_1.default.find({ email: { $in: memberEmails } });
            memberIds = members.map(m => m.id);
        }
        if (createdBy && !memberIds.includes(createdBy)) {
            memberIds.push(createdBy);
        }
        const newGroup = new Group_1.default({
            name,
            description,
            members: memberIds,
            createdBy,
        });
        await newGroup.save();
        res.status(201).json(newGroup);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/', authHandler_1.authHandler, async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const groups = await Group_1.default.find({ members: userId }).populate('members', 'name email');
        res.json(groups);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/:id', authHandler_1.authHandler, async (req, res) => {
    try {
        const group = await Group_1.default.findById(req.params.id).populate('members', 'name email');
        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }
        res.json(group);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=groupRoute.js.map