import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../biz/user/user.model';

// Các services đã tách lớp
import { generateOTP } from '../../utils/otpGenerator';
import { forgotPasswordTemplate } from '../../services/mail/templates/forgotPasswordTemplate';
import { sendMail } from '../../services/mail/mailService';

export class AuthController {
    // ==========================================
    // 1. API GỬI MÃ & TẠO JWT OTP (KHÔNG LƯU DB)
    // ==========================================
    public static async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;

            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!email || !emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: 'Định dạng email không hợp lệ!' });
            }

            const user = await UserModel.findOne({ email });

            // Sinh OTP và nhét vào JWT (Hạn 5 phút)
            const otp = generateOTP();
            const resetToken = jwt.sign({ email, otp }, process.env.JWT_SECRET as string, { expiresIn: '5m' });

            // Gửi mail nếu user tồn tại
            if (user) {
                const { subject, html } = forgotPasswordTemplate(otp);
                await sendMail(email, subject, html);
            }

            // Trả Token về cho Frontend giữ
            res.status(200).json({
                success: true,
                message: 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi mã xác nhận.',
                resetToken,
            });
        } catch (error) {
            console.error(' Lỗi tại forgotPassword Controller:', error);
            res.status(500).json({ success: false, message: 'Lỗi server nội bộ' });
        }
    }

    // ==========================================
    // 2. API ĐỔI MẬT KHẨU (KIỂM TRA JWT)
    // ==========================================
    public static async resetPassword(req: Request, res: Response) {
        try {
            // HỨNG ĐÚNG TÊN BIẾN TỪ FRONTEND GỬI XUỐNG
            const { otp, newPassword, resetToken } = req.body;

            // 1. Validation chuẩn xác
            if (!resetToken) return res.status(400).json({ success: false, message: 'Thiếu mã xác thực Token!' });
            if (!otp || otp.length !== 6) return res.status(400).json({ success: false, message: 'Mã OTP phải bao gồm đúng 6 chữ số.' });
            if (!newPassword || newPassword.length < 8) return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });

            // 2. Mở khóa JWT
            let payload: any;
            try {
                payload = jwt.verify(resetToken, process.env.JWT_SECRET as string);
            } catch (err: any) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(400).json({ success: false, message: 'Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.' });
                }
                return res.status(400).json({ success: false, message: 'Token không hợp lệ hoặc đã bị sửa đổi!' });
            }

            // 3. So sánh OTP từ JWT với OTP user nhập
            if (payload.otp !== otp) {
                return res.status(400).json({ success: false, message: 'Mã OTP không chính xác!' });
            }

            // 4. Tìm User
            const user = await UserModel.findOne({ email: payload.email });
            if (!user) {
                return res.status(400).json({ success: false, message: 'Tài khoản không tồn tại!' });
            }

            // 5. Cập nhật mật khẩu mới
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);

            await user.save();

            res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công!' });
        } catch (error) {
            console.error(' Lỗi tại resetPassword Controller:', error);
            res.status(500).json({ success: false, message: 'Lỗi server nội bộ' });
        }
    }
}
