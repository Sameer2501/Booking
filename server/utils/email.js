import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config();

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

const sendViaResend = async (userEmail, subject, htmlContent) => {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
            from: fromEmail,
            to: userEmail,
            subject: subject,
            html: htmlContent
        })
    });
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Resend API failed: ${errText}`);
    }
    return await response.json();
};

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    const subject = `Booking Confirmed: ${eventTitle}`;
    const htmlContent = `
        <h2>Hi ${userName}!</h2>
        <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
        <p>Thank you for choosing Eventora.</p>
    `;
    try {
        if (process.env.RESEND_API_KEY) {
            await sendViaResend(userEmail, subject, htmlContent);
            console.log('Email sent successfully via Resend to', userEmail);
        } else {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: userEmail,
                subject: subject,
                html: htmlContent
            };
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully via SMTP to', userEmail);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        fs.appendFileSync('email-errors.log', `[${new Date().toISOString()}] Error sending booking email to ${userEmail}: ${error.message}\n${error.stack}\n\n`);
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    const title = type === 'account_verification' ? 'Verify your Eventora Account' : 'Eventora Booking Verification';
    const msg = type === 'account_verification'
        ? 'Please use the following OTP to verify your new Eventora account.'
        : 'Please use the following OTP to verify and confirm your event booking.';

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #111;">${title}</h2>
            <p style="color: #555; font-size: 16px;">${msg}</p>
            <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                ${otp}
            </div>
            <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
        </div>
    `;

    try {
        if (process.env.RESEND_API_KEY) {
            await sendViaResend(userEmail, title, htmlContent);
            console.log(`OTP sent via Resend to ${userEmail} for ${type}`);
        } else {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: userEmail,
                subject: title,
                html: htmlContent
            };
            await transporter.sendMail(mailOptions);
            console.log(`OTP sent via SMTP to ${userEmail} for ${type}`);
        }
    } catch (error) {
        console.error('Error sending OTP email:', error);
        fs.appendFileSync('email-errors.log', `[${new Date().toISOString()}] Error sending OTP email to ${userEmail}: ${error.message}\n${error.stack}\n\n`);
    }
};

export { sendBookingEmail, sendOTPEmail };