import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IExpense, {}, {}, {}, mongoose.Document<unknown, {}, IExpense, {}, mongoose.DefaultSchemaOptions> & IExpense & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IExpense>;
export default _default;
//# sourceMappingURL=Expense.d.ts.map