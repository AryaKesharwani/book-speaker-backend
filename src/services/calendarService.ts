import { google } from 'googleapis';

const calendar = google.calendar({ version: 'v3', auth: process.env.GOOGLE_API_KEY });

export async function createCalendarEvent(userEmail: string, speakerEmail: string, session: any): Promise<void> {
    const event = {
        summary: 'Speaker Session',
        description: 'A session with a speaker',
        start: {
            dateTime: session.startTime,
            timeZone: 'America/Los_Angeles',
        },
        end: {
            dateTime: session.endTime,
            timeZone: 'America/Los_Angeles',
        },
        attendees: [
            { email: userEmail },
            { email: speakerEmail },
        ],
    };

    try {
        await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });
        console.log('Calendar event created');
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw new Error('Failed to create calendar event');
    }
}