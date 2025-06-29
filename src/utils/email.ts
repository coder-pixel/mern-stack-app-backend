/**
 * Email utility functions for sending verification emails to users
 * Uses nodemailer for email delivery
 */

import nodemailer from "nodemailer";
import { BASE_URL } from "../config";

/**
 * Sends a verification email to the user with a verification link
 * @param to - Recipient email address
 * @param token - Verification token to include in the email link
 */
export const sendVerificationEmail = async (to: string, token: string) => {
  // Construct the verification URL with the provided token
  const generatedVerifyUrl = `${BASE_URL}/auth/verify-email?token=${token}`;

  // Configure email transporter using Gmail SMTP
  // Note: Consider using SendGrid or other production email services for better deliverability
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use SendGrid for production
    auth: {
      user: process.env.EMAIL_USER, // Gmail account email
      pass: process.env.EMAIL_PASS, // Gmail app password or OAuth token
    },
  });

  // Send the verification email
  await transporter.sendMail({
    from: `"My Express App" <${process.env.EMAIL_USER}>`, // Sender name and email
    to, // Recipient email address
    subject: "Verify Your Email", // Email subject line
    html: `
            <p>Please verify your email by clicking this link:</p>
            <a href="${generatedVerifyUrl}">${generatedVerifyUrl}</a>, 
            <br>
            <br>
            <p>Regards,</p>
            <b>Sauvik Kumar Goel</b>
           `, // HTML email body with verification link
  });
};
