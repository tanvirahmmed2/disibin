import * as brevo from "@getbrevo/brevo";
import { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } from "./secret";


/**
 * Unified email sender.
 * Accepts either:
 *   { to, subject, htmlContent }          — legacy shorthand
 *   { toEmail, toName, subject, htmlContent } — explicit form
 */
export const sendEmail = async (options) => {
    try {
        // Support both call signatures
        const toEmail = options.toEmail || options.to;
        const rawName = options.toName || options.name || '';
        const toName = typeof rawName === 'string' ? rawName.trim() : '';
        const { subject, htmlContent } = options;

        if (!toEmail) {
            console.error("Brevo Email Error: Missing recipient email");
            return { success: false, error: "Missing recipient email" };
        }

        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            BREVO_API_KEY
        );

        const smtpEmail = new brevo.SendSmtpEmail();
        smtpEmail.subject = subject;
        smtpEmail.htmlContent = htmlContent;
        smtpEmail.sender = {
            name: BREVO_SENDER_NAME || 'Disibin',
            email: BREVO_SENDER_EMAIL,
        };

        const recipient = { email: toEmail };
        if (toName) {
            recipient.name = toName;
        }
        smtpEmail.to = [recipient];

        const data = await apiInstance.sendTransacEmail(smtpEmail);
        return { success: true, data };
    } catch (error) {
        const errorDetail = error.response?.body || error.response?.data || error.message || error;
        console.error("Brevo Email Error:", errorDetail);
        return { success: false, error: errorDetail };
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


export const sendStaffInvitationEmail = async (email, name, activationUrl) => {
    const subject = "Invitation to join Disibin Team";
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Disibin Team Invitation</h2>
            <p>Hi ${name},</p>
            <p>You have been invited to join the Disibin team as staff. Please click the link below to complete your profile setup:</p>
            <a href="${activationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">Complete Setup</a>
            <p>This link will expire in 7 days.</p>
        </div>
    `;
    return await sendEmail({ toEmail: email, toName: name, subject, htmlContent });
};
