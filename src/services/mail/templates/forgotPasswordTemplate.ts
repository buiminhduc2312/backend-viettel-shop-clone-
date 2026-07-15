export const forgotPasswordTemplate = (otp: string) => {
    return {
        subject: 'Mã xác nhận khôi phục mật khẩu - Viettel Store',
        html: `
            <html>
            <head>
                <style>
                    .email-wrapper { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; }
                    .email-card { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #ddd; }
                    .email-title { color: #ee0033; text-align: center; font-size: 22px; }
                    .otp-box { text-align: center; color: #333; font-size: 36px; letter-spacing: 5px; background-color: #f0f0f0; padding: 15px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                    .email-footer { color: #888; font-size: 14px; font-style: italic; }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="email-card">
                        <h2 class="email-title">Yêu cầu Đặt lại Mật khẩu</h2>
                        <p>Chào bạn,</p>
                        <p>Hệ thống nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn.</p>
                        <p>Mã xác nhận an toàn của bạn là:</p>
                        <div class="otp-box">${otp}</div>
                        <p class="email-footer">* Mã này sẽ hết hạn sau 15 phút. Tuyệt đối không chia sẻ mã này cho bất kỳ ai.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };
};
