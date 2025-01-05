import { createAlert } from '@/app/services/api/alertService';
import { sendPhoneCall } from '@/app/services/api/phoneCallService';
import { sendEmailToUser } from '@/app/services/api/sendEmailService';
import { User } from '@/app/types/props/user';


export const afterFilter = (user: User, status: string, link: string) => {
    let doc;
    const parser = new DOMParser();

    const contentItem = {
        "subject": "נמצא פריט התואם לאבידה שלך – בדוק אותו!",
        "htmlContent":
            `<div dir="rtl">
        <p>היי ${user.fullName},</p>
        <p>רצינו לעדכן אותך כי אחד המשתמשים באתרנו העלה פריט שמצא, ולאחר שבדקנו את הפרטים, נראה שהם תואמים לאבידה שלך.</p>
        <p>אנא בדוק <a href="${link}">כאן</a> אם אכן מדובר באבידה שלך</p>
        </div>`
    }
    const contentChat = {
        "subject": "מישהו מחכה לך בצ'אט!",
        "htmlContent":
            `<div>
            <p>היי ${user.fullName},</p>
                <p>.אחד המשתמשים באתרנו איבד פריט הזהה לפריט שמצאת, וענה נכונה על הסימנים שהזנת</p>
                <p>.כעת הוא ממתין לך בצ'אט לאימות סופי ולתיאום העברת הפריט</p>
                <p>אנא היכנס ל<a href=${link}>צ'אט</a> כדי להשלים את התהליך.</p>
            </div>`
    }


    switch (status) {
        case "chat":
            sendEmailToUser(user.email, contentChat.subject, contentChat.htmlContent);
            doc = parser.parseFromString(contentChat.htmlContent, "text/html");
            sendPhoneCall(user.phone, doc.body.textContent || doc.body.innerText)
            createAlert(String(user._id), contentChat.subject, link)
            break;
        case "foundItem":
            sendEmailToUser(user.email, contentItem.subject, contentItem.htmlContent);
            doc = parser.parseFromString(contentItem.htmlContent, "text/html");
            sendPhoneCall(user.phone, doc.body.textContent || doc.body.innerText)
            createAlert(String(user._id), contentItem.subject, link)
    }
}

export const sendEmailForResetPassword = (email: string, link: string) => {
    const content = {
        "subject": "איפוס סיסמה",
        "text": "שלום, לאיפוס סיסמה אנא השתמש בקישור שלהלן.",
        "htmlContent": `
      <div dir="rtl">
          <h1>איפוס סיסמה אתר השבת אבידה</h1>
          <p>לאיפוס סיסמה היכנס לקישור הבא:</p>
          <p>
              <a href='${link}'  
              style='color:blue; text-decoration:underline;'>
                  איפוס סיסמה
              </a>
          </p>
          </div>
      `,
    }
    sendEmailToUser(email, content.subject, content.htmlContent);
}


