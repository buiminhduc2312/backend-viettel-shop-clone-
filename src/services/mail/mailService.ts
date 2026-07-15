import { transporter } from './mailConfig';

export const sendMail = async (to: string, subject: string, html: string): Promise<boolean> => {
    try {
        await transporter.sendMail({
            from: `"Viettel Store Hỗ Trợ" <${process.env.EMAIL_SENDER_USER}>`,
            to,
            subject,
            html,
        });
        return true;
    } catch (error) {
        console.error(' Lỗi tại MailService khi gọi Nodemailer:', error);
        throw new Error('Không thể gửi email');
    }
};
