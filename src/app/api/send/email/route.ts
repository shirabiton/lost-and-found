import { NextRequest, NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const { to, subject, htmlContent } = await request.json();

        if (!subject || !htmlContent) {
            return NextResponse.json(
                { error: 'Missing email content' },
                { status: 400 }
            );
        }

        // Sets the service name and authentication details
        const transporter = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.FROM_EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: to || process.env.TO_EMAIL,
            subject,
            html: htmlContent
        };

        // Sending the email
        const info = await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true, info }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to send email', error: error },
            { status: 500 }
        );
    }
}