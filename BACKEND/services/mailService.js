import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/*
=========================================
SEND PASSWORD RESET OTP
=========================================
*/

export const sendPasswordResetOtp = async (
  email,
  name,
  otp
) => {
  const mailOptions = {
    from: `"LABTRACK EME" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "Password Reset OTP",

    html: `
      <div style="
        max-width:600px;
        margin:auto;
        font-family:Arial,sans-serif;
        padding:30px;
        border:1px solid #e5e7eb;
        border-radius:10px;
      ">

        <h2 style="color:#2563EB;">
          Password Reset
        </h2>

        <p>Hello <strong>${name}</strong>,</p>

        <p>
          We received a request to reset your password for your
          <strong>LABTRACK</strong> account.
        </p>

        <p>Your One-Time Password is:</p>

        <div style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
          color:#2563EB;
          text-align:center;
          margin:30px 0;
        ">
          ${otp}
        </div>

        <p>
          This OTP will expire in
          <strong>5 minutes</strong>.
        </p>

        <p>
          If you did not request this password reset,
          simply ignore this email.
        </p>

        <br>

        <p>
          Regards,
          <br>
          <strong>LABTRACK Team</strong>
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};