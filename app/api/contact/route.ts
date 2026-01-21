import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'שירות המייל אינו זמין כרגע (חסר מפתח API)' },
        { status: 503 }
      );
    }
    const resend = new Resend(apiKey);
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'חובה למלא את כל השדות' },
        { status: 400 }
      );
    }

    // שלח מייל לאתר
    const siteEmailResponse = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'info@site-control-il.com',
      subject: `פנייה חדשה מ-${name} - Site-Control`,
      html: `
        <h2>פנייה חדשה מ-Site-Control</h2>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>מייל:</strong> ${email}</p>
        <p><strong>טלפון:</strong> ${phone || 'לא ציין'}</p>
        <p><strong>הודעה:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>זמן פנייה: ${new Date().toLocaleString('he-IL')}</p>
      `,
    });

    if (siteEmailResponse.error) {
      return NextResponse.json(
        { error: 'שגיאה בשליחת המייל' },
        { status: 500 }
      );
    }

    // שלח מייל תשובה ללקוח
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'קיבלנו את הפנייה שלך - Site-Control',
      html: `
        <h2>שלום ${name},</h2>
        <p>תודה על פנייתך אלינו!</p>
        <p>קיבלנו את ההודעה שלך והצוות שלנו יחזור אליך בהקדם האפשרי.</p>
        <p>בינתיים, אם יש לך שאלות נוספות, אתה מוזמן להתקשר או לשלוח לנו מייל חדש.</p>
        <hr>
        <p><strong>Site-Control - מצלמות אבטחה סולאריות 4G</strong></p>
        <p>info@site-control-il.com</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'המייל נשלח בהצלחה! נחזור אליך בקרוב.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'שגיאה בעיבוד הבקשה' },
      { status: 500 }
    );
  }
}
