import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SENDER_USER,
        pass: process.env.EMAIL_SENDER_PASS,
    },

    tls: {
        rejectUnauthorized: false,
    },
});
