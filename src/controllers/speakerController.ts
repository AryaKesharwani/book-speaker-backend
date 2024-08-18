import { Request, Response } from 'express';
import db from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class SpeakerController {
    async signup(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, password, expertise, pricePerSession } = req.body;

            const existingSpeaker = await db('speakers').where({ email }).first();
            if (existingSpeaker) {
                return res.status(400).json({ message: 'Speaker already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const [speakerId] = await db('speakers').insert({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                expertise: JSON.stringify(expertise),
                pricePerSession
            }).returning('id');

            res.status(201).json({ message: 'Speaker created successfully', speakerId });
        } catch (error) {
            res.status(500).json({ message: 'Error creating speaker', error });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const speaker = await db('speakers').where({ email }).first();
            if (!speaker) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, speaker.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ speakerId: speaker.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const speakerId = (req as any).speakerId;
            const speaker = await db('speakers').where({ id: speakerId }).first();
            if (!speaker) {
                return res.status(404).json({ message: 'Speaker not found' });
            }
            speaker.expertise = JSON.parse(speaker.expertise);
            res.json(speaker);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching profile', error });
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const speakerId = (req as any).speakerId;
            const { firstName, lastName, expertise, pricePerSession } = req.body;

            const updatedRows = await db('speakers')
                .where({ id: speakerId })
                .update({
                    firstName,
                    lastName,
                    expertise: JSON.stringify(expertise),
                    pricePerSession
                });

            if (updatedRows === 0) {
                return res.status(404).json({ message: 'Speaker not found' });
            }

            res.json({ message: 'Profile updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating profile', error });
        }
    }

    async getSpeakerSessions(req: Request, res: Response) {
        try {
            const speakerId = (req as any).speakerId;
            const sessions = await db('sessions')
                .join('users', 'sessions.userId', 'users.id')
                .where({ 'sessions.speakerId': speakerId })
                .select('sessions.*', 'users.firstName as userFirstName', 'users.lastName as userLastName');
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching speaker sessions', error });
        }
    }

    async updateAvailability(req: Request, res: Response) {
        try {
            const speakerId = (req as any).speakerId;
            const { availability } = req.body;

            const updatedRows = await db('speakers')
                .where({ id: speakerId })
                .update({ availability: JSON.stringify(availability) });

            if (updatedRows === 0) {
                return res.status(404).json({ message: 'Speaker not found' });
            }

            res.json({ message: 'Availability updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating availability', error });
        }
    }
}