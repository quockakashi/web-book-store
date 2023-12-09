const transporter = require('../configs/nodemailer');

const mailOptions = {
    from: 'insideafish@gmail.com',
}

const sendConfirmAccountMail = async (to, confirmLink) => {
    try {
        transporter.sendMail({
            ...mailOptions,
            to: to,
            subject: 'Xác nhận tài khoản của bạn - Book Store System',
            html: `
            <body style="font-family: Arial, sans-serif; text-align: center; margin: 20px;">
                <h2>Xác Nhận Tài Khoản</h2>
                <p>Cảm ơn bạn đã đăng ký! Vui lòng nhấp vào nút bên dưới để xác nhận tài khoản:</p>
                <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px;">Xác Nhận Tài Khoản</a>
                <p>Email này có hiệu lực trong 24h.Nếu bạn không thực hiện hành động này, tài khoản của bạn có thể không được kích hoạt.</p>
            </body>`
        })
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    sendConfirmAccountMail,
}