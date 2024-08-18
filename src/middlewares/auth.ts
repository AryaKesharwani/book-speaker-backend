import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: number;
    speakerId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId?: number; speakerId?: number };

        if (decoded.userId) {
            req.userId = decoded.userId;
        } else if (decoded.speakerId) {
            req.speakerId = decoded.speakerId;
        } else {
            throw new Error('Invalid token payload');
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};