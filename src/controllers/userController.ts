import { Request, Response } from 'express';
import db from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../utils/otpGenerator';
import { sendVerificationEmail } from '../services/emailService';
import { createCalendarEvent } from '../services/calendarService';

export class UserController {
    async signup(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, password } = req.body;

            const existingUser = await db('users').where({ email }).first();
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const otp = generateOTP();

            // Set OTP expiration to 10 minutes from now
            const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

            const [userId] = await db('users').insert({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                otpCode: otp,
                otpExpiration: otpExpiration,
                isVerified: false
            }).returning('id');

            await sendVerificationEmail(email, otp);

            res.status(201).json({ message: 'User created. Please verify your email.' });
        } catch (error) {
            console.error('Error in signup:', error);
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    }
    
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await db('users').where({ email }).first();
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            if (!user.isVerified) {
                return res.status(400).json({ message: 'Please verify your email before logging in' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    }

    async verifyEmail(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;

            const user = await db('users').where({ email }).first();
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            if (user.isVerified) {
                return res.status(400).json({ message: 'Email already verified' });
            }

            console.log('Stored OTP:', user.otpCode, 'Received OTP:', otp);

            // Convert both OTPs to strings for comparison
            if (String(user.otpCode) !== String(otp)) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }

            // Check if OTP has expired
            if (!user.otpExpiration || new Date() > new Date(user.otpExpiration)) {
                return res.status(400).json({ message: 'OTP has expired' });
            }

            await db('users')
                .where({ id: user.id })
                .update({
                    isVerified: true,
                    otpCode: null,
                    otpExpiration: null
                });

            res.json({ message: 'Email verified successfully' });
        } catch (error) {
            console.error('Error in verifyEmail:', error);
            res.status(500).json({ message: 'Error verifying email', error: error.message });
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const userId = (req as any).userId;
            const user = await db('users').where({ id: userId }).first();
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching profile', error });
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const userId = (req as any).userId;
            const { firstName, lastName } = req.body;

            const updatedRows = await db('users')
                .where({ id: userId })
                .update({ firstName, lastName });

            if (updatedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'Profile updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating profile', error });
        }
    }

    async getAllSpeakers(req: Request, res: Response) {
        try {
            const speakers = await db('speakers').select('*');
            res.json(speakers);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching speakers', error });
        }
    }

    async bookSession(req: Request, res: Response) {
        try {
            const userId = (req as any).userId;
            const { speakerId, date, startTime } = req.body;

            const user = await db('users').where({ id: userId }).first();
            const speaker = await db('speakers').where({ id: speakerId }).first();

            if (!user || !speaker) {
                return res.status(404).json({ message: 'User or Speaker not found' });
            }

            const sessionDate = new Date(date);
            const sessionStartTime = new Date(startTime);
            const sessionEndTime = new Date(sessionStartTime.getTime() + 60 * 60 * 1000); // 1 hour later

            const [sessionId] = await db('sessions').insert({
                userId,
                speakerId,
                date: sessionDate,
                startTime: sessionStartTime,
                endTime: sessionEndTime
            }).returning('id');

            const session = await db('sessions').where({ id: sessionId }).first();

            // Create calendar event
            await createCalendarEvent(user.email, speaker.email, session);

            res.status(201).json({ message: 'Session booked successfully', session });
        } catch (error) {
            res.status(500).json({ message: 'Error booking session', error });
        }
    }

    async getUserSessions(req: Request, res: Response) {
        try {
            const userId = (req as any).userId;
            const sessions = await db('sessions')
                .join('speakers', 'sessions.speakerId', 'speakers.id')
                .where({ 'sessions.userId': userId })
                .select('sessions.*', 'speakers.firstName as speakerFirstName', 'speakers.lastName as speakerLastName');
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user sessions', error });
        }
    }
}