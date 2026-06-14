import nodemailer from 'nodemailer';
import { config } from '../../config/env-config';
import { EmailError } from '../errors/emailError';

const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465, // true for 465, false for other ports
    auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        await transporter.sendMail({
            from: `TeamPulse <${config.smtpUser}>`,
            to,
            subject,
            html,
        });
    } catch (error) {
        throw new EmailError(`Failed to send email to ${to}`);
    }
};
