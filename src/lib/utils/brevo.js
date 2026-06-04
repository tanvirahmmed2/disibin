import { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } from "../database/secret";
import axios from "axios";

export async function sendEmail({ to, subject, htmlContent }) {
    try {
        if (!BREVO_API_KEY) {
            console.error("BREVO_API_KEY is not defined");
            return { success: false, message: "Email service not configured" };
        }

        const response = await axios.post("https://api.brevo.com/v3/smtp/email", {
            sender: {
                name: BREVO_SENDER_NAME || "Disibin",
                email: BREVO_SENDER_EMAIL || "no-reply@disibin.com"
            },
            to: [{ email: to }],
            subject: subject,
            htmlContent: htmlContent
        }, {
            headers: {
                "accept": "application/json",
                "api-key": BREVO_API_KEY,
                "content-type": "application/json"
            }
        });

        return { success: true, data: response.data };
    } catch (error) {
        console.error("Send Email Error:", error.response?.data || error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
}
