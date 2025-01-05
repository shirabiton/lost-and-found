import axios from "axios";

export const sendEmailToUser = async (
  userEmail: string,
  subject: string,
  content: string,
) => {
  try {
    if (!userEmail) {
      throw new Error("There is no recipient email");
    }
    const response = await axios.post("/api/send/email", {
      to: userEmail,
      subject,
      htmlContent: `
      <div dir="rtl" style="padding-bottom: 4vh;">
        <p>${content}</p>
        <p style="color: #464A4D; font-size: 12px; font-style: italic;">זוהי הודעה אוטומטית, אין להשיב למייל זה</p>
        <p>בברכה,</p>
        <p>צוות אתר מציאון.</p>
      </div>`,
    });

    if (response && response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to send email: Received status code");
    }
  } catch{
    throw new Error("Failed to send email. Please try again later.");
  }
};

export const sendEmailToAdmin = async (
  userEmail: string,
  subject: string,
  content: string
) => {
  try {
    // Indentation in each sentence (according to the periods)
    const formattedContent = content.replace(/\./g, ".<br>");

    const response = await axios.post("/api/send/email", {
      subject,
      htmlContent: `
      <div dir="rtl">
        <p>${formattedContent}</p>
        <p style="padding-bottom: 4vh;">השב לכתובת זו: ${userEmail.toLowerCase()}</p>
      </div>`,
    });

    if (response && response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to send email");
    }
  } catch  {
    throw new Error("Failed to send email. Please try again later.");
  }
}
