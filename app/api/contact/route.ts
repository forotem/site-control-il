import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { attributionLabel } from '../../lib/attribution-label';

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
    // Sender on the verified domain; falls back to Resend's shared sandbox
    // sender if the domain is (temporarily) unverified so leads never get lost.
    const SENDERS = ['Site-Control <noreply@site-control-il.com>', 'onboarding@resend.dev'];
    const sendWithFallback = async (payload: Omit<Parameters<typeof resend.emails.send>[0], 'from'>) => {
      let last: Awaited<ReturnType<typeof resend.emails.send>> | null = null;
      for (const from of SENDERS) {
        last = await resend.emails.send({ ...(payload as object), from } as Parameters<typeof resend.emails.send>[0]);
        if (!last.error) return last;
      }
      return last!;
    };
    const body = await request.json();
    const { name, email, phone, message } = body;
    const source = attributionLabel(body.attribution).replace(/&/g, '&amp;');

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'חובה למלא את כל השדות' },
        { status: 400 }
      );
    }

    // שלח מייל לאתר
    const siteEmailResponse = await sendWithFallback({
      to: 'info@site-control-il.com',
      replyTo: email,
      subject: `פנייה חדשה מ-${name} - Site-Control`,
      html: `
        <h2>פנייה חדשה מ-Site-Control</h2>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>מייל:</strong> ${email}</p>
        <p><strong>טלפון:</strong> ${phone || 'לא ציין'}</p>
        <p><strong>מקור:</strong> ${source}</p>
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
    await sendWithFallback({
      to: email,
      subject: 'קיבלנו את הפנייה שלך - Site-Control',
      html: `
        <h2>שלום ${name},</h2>
        <p>תודה על פנייתך אלינו!</p>
        <p>קיבלנו את ההודעה שלך והצוות שלנו יחזור אליך בהקדם האפשרי.</p>
        <p>בינתיים, אם יש לך שאלות נוספות, אתה מוזמן להתקשר או לשלוח לנו מייל חדש.</p>
        <hr>
        <p><strong>Site-Control - מצלמות אבטחה, אינטרקום והתקנה</strong></p>
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
