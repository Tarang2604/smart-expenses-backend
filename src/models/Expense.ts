import mongoose, { Schema, Document } from 'mongoose';

export interface ISplit {
  user: mongoose.Types.ObjectId;
  amount: number;
}

export interface IExpense extends Document {
  groupId: mongoose.Types.ObjectId;
  paidBy: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  splits: ISplit[];
  createdAt: Date;
}

const SplitSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
});

const ExpenseSchema: Schema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  paidBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  splits: [SplitSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
