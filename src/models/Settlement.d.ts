import mongoose, { Document } from 'mongoose';
export interface ISettlement extends Document {
    groupId: mongoose.Types.ObjectId;
    paidBy: mongoose.Types.ObjectId;
    paidTo: mongoose.Types.ObjectId;
    amount: number;
    createdAt: Date;
}
declare const _default: mongoose.Model<ISettlement, {}, {}, {}, mongoose.Document<unknown, {}, ISettlement, {}, mongoose.DefaultSchemaOptions> & ISettlement & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISettlement>;
export default _default;
//# sourceMappingURL=Settlement.d.ts.map