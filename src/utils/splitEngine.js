"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplifyDebts = exports.calculateBalances = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
const calculateBalances = async (groupId) => {
    const expenses = await Expense_1.default.find({ groupId });
    const balances = {};
    expenses.forEach(exp => {
        const paidBy = exp.paidBy.toString();
        if (!balances[paidBy])
            balances[paidBy] = 0;
        balances[paidBy] += exp.amount;
        exp.splits.forEach(split => {
            const splitUser = split.user.toString();
            if (!balances[splitUser])
                balances[splitUser] = 0;
            balances[splitUser] -= split.amount;
        });
    });
    return balances;
};
exports.calculateBalances = calculateBalances;
const simplifyDebts = (balances) => {
    const debtors = [];
    const creditors = [];
    for (const user in balances) {
        const amount = balances[user] || 0;
        if (amount > 0.01)
            creditors.push({ user, amount });
        else if (amount < -0.01)
            debtors.push({ user, amount: -amount });
    }
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);
    const transactions = [];
    let d = 0, c = 0;
    while (d < debtors.length && c < creditors.length) {
        const debtor = debtors[d];
        const creditor = creditors[c];
        if (!debtor || !creditor)
            break;
        const amount = Math.min(debtor.amount, creditor.amount);
        if (amount > 0.01) {
            transactions.push({ from: debtor.user, to: creditor.user, amount: Math.round(amount * 100) / 100 });
        }
        debtor.amount -= amount;
        creditor.amount -= amount;
        if (debtor.amount < 0.01)
            d++;
        if (creditor.amount < 0.01)
            c++;
    }
    return transactions;
};
exports.simplifyDebts = simplifyDebts;
//# sourceMappingURL=splitEngine.js.map