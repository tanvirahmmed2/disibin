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