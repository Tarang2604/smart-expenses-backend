import mongoose, { Schema, Document } from 'mongoose';

export interface ISettlement extends Document {
  groupId: mongoose.Types.ObjectId;
  paidBy: mongoose.Types.ObjectId;
  paidTo: mongoose.Types.ObjectId;
  amount: number;
  createdAt: Date;
}

const SettlementSchema: Schema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  paidBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  paidTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISettlement>('Settlement', SettlementSchema);
