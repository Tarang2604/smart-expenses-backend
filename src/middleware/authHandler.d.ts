import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}
export declare const authHandler: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authHandler.d.ts.map