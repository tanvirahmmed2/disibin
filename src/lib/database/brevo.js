import * as brevo from "@getbrevo/brevo";
import { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } from "./secret";

/**
 * Utility to send transactional emails via Brevo
 * @param {Object} options - { toEmail, toName, subject, htmlContent }
 */
export const sendEmail = async ({ toEmail, toName, subject, htmlContent }) => {
    try {
        const apiInstance = new brevo.TransactionalEmailsApi();
        
        apiInstance.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY
        );

        const smtpEmail = new brevo.SendSmtpEmail();

        smtpEmail.subject = subject;
        smtpEmail.htmlContent = htmlContent;
        smtpEmail.sender = { 
            name: BREVO_SENDER_NAME,
            email: BREVO_SENDER_EMAIL
        };
        smtpEmail.to = [{ email: toEmail, name: toName }];

        const data = await apiInstance.sendTransacEmail(smtpEmail);
        return { success: true, data };
    } catch (error) {
        console.error("Brevo Email Error:", error);
        return { success: false, error };
    }
};

export const sendVerificationEmail = async (email, name, verificationUrl) => {
    const subject = "Verify your Disibin Account";
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Disibin!</h2>
            <p>Hi ${name},</p>
            <p>Please click the button below to verify your email address:</p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #059669; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>If you didn't request this, you can ignore this email.</p>
        </div>
    `;
    return await sendEmail({ toEmail: email, toName: name, subject, htmlContent });
};