import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

type Role = 'user' | 'speaker';

export const roleCheck = (allowedRoles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        let userRole: Role;

        if (req.userId) {
            userRole = 'user';
        } else if (req.speakerId) {
            userRole = 'speaker';
        } else {
            return res.status(403).json({ message: 'Access denied: No role identified' });
        }

        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }
    };
};