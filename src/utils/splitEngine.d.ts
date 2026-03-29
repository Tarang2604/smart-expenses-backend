interface Balances {
    [userId: string]: number;
}
export declare const calculateBalances: (groupId: string) => Promise<Balances>;
export interface Transaction {
    from: string;
    to: string;
    amount: number;
}
export declare const simplifyDebts: (balances: Balances) => Transaction[];
export {};
//# sourceMappingURL=splitEngine.d.ts.map