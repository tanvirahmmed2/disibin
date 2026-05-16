import { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } from "../database/secret";

export async function sendEmail({ to, subject, htmlContent }) {
    try {
        if (!BREVO_API_KEY) {
            console.error("BREVO_API_KEY is not defined");
            return { success: false, message: "Email service not configured" };
        }

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": BREVO_API_KEY,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    name: BREVO_SENDER_NAME || "Disibin",
                    email: BREVO_SENDER_EMAIL || "no-reply@disibin.com"
                },
                to: [{ email: to }],
                subject: subject,
                htmlContent: htmlContent
            })
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            console.error("Brevo Error:", data);
            return { success: false, message: data.message || "Failed to send email" };
        }
    } catch (error) {
        console.error("Send Email Error:", error);
        return { success: false, message: error.message };
    }
}
