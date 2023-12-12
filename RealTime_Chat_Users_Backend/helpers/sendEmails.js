import nodemailer from "nodemailer"

const confirmAccountEmail = async (data) => {
    const { email, name, token } = data;

    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"Chat App - Real Time Chat App"',
        to: email,
        subject: "Real Time Chat App - Confirm your account",
        text: "Check your account",
        html: `<p>Hola: ${name}, check your account</p>
        <p>Tu cuenta ya está casi lista, solo debes comprobarla en el siguiente enlace:</p>

        <a href="${process.env.FRONTEND_URL}/confirm/${token}">Comprobar cuenta</a>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}

const forgotPasswordGenerateToken = async (data) => {
    const { email, name, changePasswordToken } = data;

    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"Chat App - Real Time Chat App" <cuentas@realchat.com>',
        to: email,
        subject: "Real Time Chat App - Change your password",
        text: "Forgot password",
        html: `<p>Hola: ${name}, change your password</p>
        <p>Parece que te has olvidado de tu contraseña. Cambiala en el siguiente enlace:</p>

        <a href="${process.env.FRONTEND_URL}/forgot-password/${changePasswordToken}">Comprobar cuenta</a>

        <p>If you didnt send this petition, you should change your password</p>
        `
    })
}

export {
    confirmAccountEmail,
    forgotPasswordGenerateToken
}
