import Image from "next/image";
import { proofImages, productImages, appShots, competitorImages } from "../data/images";
import { useCases } from "../data/features";

export function ProofSections() {
  return (
    <>
      <section className="hero">
        <div>
          <h2>גיבוי ענן אוטומטי בזמן אמת - אבטחת הקלטות מלאה גם במקרה של גניבה או נזק למצלמה</h2>
          <p style={{fontSize: '1.05rem', lineHeight: '1.7'}}>
            <strong>מערכת גיבוי ענן חכמה</strong> - כל סרטון שהמצלמה מקליטה עולה באופן אוטומטי לענן תוך שניות. גם אם המצלמה נגנבת, ניזוקה או נפגעת - כל ההקלטות שמורות בענן באופן מאובטח. <strong>גישה מכל מקום</strong> - צפו בצילומים חיים או מהעבר מהמחשב, הטלפון או הטאבלט, מכל מקום בעולם עם חיבור לאינטרנט. <strong>אחסון גמיש</strong> - בחרו בין תוכניות אחסון של 7, 30 או 90 יום, בהתאם לצרכים שלכם.
          </p>
        </div>
        <Image src={proofImages.cloud} alt={proofImages.cloudAlt} width={1440} height={867} sizes="(max-width: 768px) 100vw, 540px" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
      </section>

      <section className="hero">
        <div>
          <h2>עמידות מקצועית לתנאי שטח קשים - IP66 עמידה למים, אבק, חום וקור קיצוניים</h2>
          <p style={{fontSize: '1.05rem', lineHeight: '1.7'}}>
            <strong>תקן IP66 מלא</strong> - המצלמות מוגנות לחלוטין מפני חדירת מים, גשם כבד, אבק, לכלוך ותנאי סביבה קשים. <strong>טווח טמפרטורות רחב</strong> - עובדת בטמפרטורות קיצון מ--10°C עד +55°C, מתאימה לקיץ חם ולחורף קר. <strong>קרוד מתכת חזק</strong> - בנייה עמידה מפני ונדליזם, מזג אוויר קשה ופגיעות מכניות. מתאימה במיוחד לאתרי בנייה, שטחים חקלאיים פתוחים, מחסנים חיצוניים ומקומות עבודה בשטח.
          </p>
        </div>
        <Image src={proofImages.weather} alt={proofImages.weatherAlt} width={1440} height={864} sizes="(max-width: 768px) 100vw, 540px" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
      </section>

      <section className="hero">
        <div>
          <h2>איכות צילום 4K Ultra HD עם ראיית לילה צבעונית - רזולוציה של 3840×2160 פיקסלים</h2>
          <p style={{fontSize: '1.05rem', lineHeight: '1.7'}}>
            <strong>צילום 4K חד במיוחד</strong> - רזולוציה של 3840×2160 פיקסלים מספקת פירוט ברור של כל פרט באתר - זיהוי פנים, לוחיות רישוי רכב, ופרטים קטנים מרחוק. <strong>ראיית לילה צבעונית מתקדמת</strong> - בניגוד למצלמות רגילות בשחור-לבן, מצלמות אלו מציגות וידאו צבעוני גם בלילה המוחלט באמצעות טכנולוגיית Starlight וספוטלייט LED. <strong>שימוש מקצועי</strong> - מתאים לתיעוד משפטי, ביטוח, הצגת התקדמות פרויקט ללקוחות, מעקב אחר ציוד יקר ושמירה על נכסים. איכות הווידאו מאפשרת זום דיגיטלי מבלי לאבד בהירות.
          </p>
        </div>
        <Image src={proofImages.quality} alt={proofImages.qualityAlt} width={1440} height={712} sizes="(max-width: 768px) 100vw, 640px" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
      </section>

      <section>
        <h2>מפרט טכני מלא - מצלמות Reolink GO Plus ו-PTZ מקצועיות 4G</h2>
        <p style={{ marginBottom: '24px', color: 'var(--muted)', textAlign: 'center', maxWidth: '900px', margin: '0 auto 24px', fontSize: '1.05rem', lineHeight: '1.7' }}>
          להלן פירוט מקצועי של הרכיבים והטכנולוגיות שמרכיבות את מצלמות האבטחה הסולאריות המתקדמות ביותר בשוק. כל רכיב תוכנן במיוחד לעבודה עצמאית ממושכת בשטח, ללא צורך בתשתית חשמל, אינטרנט כבלים או WiFi. המצלמות משלבות טכנולוגיית סולאר, סוללות ליתיום גדולות, קישוריות 4G LTE, בינה מלאכותית לזיהוי תנועה מתקדם וחומרה עמידה במיוחד.
        </p>
        <div className="cards">
          <div className="card">
            <h3>Reolink GO Plus (4G)</h3>
            <Image src={productImages.go} alt={productImages.goAlt} width={1440} height={999} sizes="(max-width: 768px) 100vw, 360px" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.6' }}>
              <p><strong>מצלמה סולארית 4G</strong> - ללא תשתיות חשמל או אינטרנט:</p>
              <ul style={{ margin: '8px 0', paddingRight: '20px' }}>
                <li>4K Ultra HD (3840×2160) צילום ביום בלילה</li>
                <li>סוללה + פנל סולארי - עבודה רציפה</li>
                <li>4G LTE - התחברות ללא WiFi</li>
                <li>אחסון ענן + מקומי</li>
                <li>זיהוי תנועה ב-AI</li>
              </ul>
            </div>
          </div>
          <div className="card">
            <h3>Reolink PTZ סולארית</h3>
            <Image src={productImages.ptz} alt={productImages.ptzAlt} width={954} height={1080} sizes="(max-width: 768px) 100vw, 360px" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.6' }}>
              <p><strong>מצלמת PTZ עם סיבוב 360°</strong> - שליטה מרחוק בזוויות:</p>
              <ul style={{ margin: '8px 0', paddingRight: '20px' }}>
                <li>Pan/Tilt/Zoom - כיסוי שטח גדול</li>
                <li>סוללה + סולאר דואלי</li>
                <li>4G עבור התחברות משודרגת</li>
                <li>ראיית לילה אינפרא אדום</li>
                <li>מתקנים שדה בנייה בעתיד</li>
              </ul>
            </div>
          </div>
          <div className="card">
            <h3>חיישנים וחומרה</h3>
            <Image src={productImages.sensors} alt={productImages.sensorsAlt} width={1080} height={955} sizes="(max-width: 768px) 100vw, 360px" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.6' }}>
              <p><strong>אלקטרוניקה וחיישנים</strong> - מה שתוך המצלמה:</p>
              <ul style={{ margin: '8px 0', paddingRight: '20px' }}>
                <li>עדשה 4mm עם זום אוטומטי</li>
                <li>חיישן PIR לגילוי תנועה</li>
                <li>מיקרופון לשמע דו-כיווני</li>
                <li>LED אינפרא אדום לילה</li>
                <li>CPU/מעבד עבור AI</li>
              </ul>
            </div>
          </div>
          <div className="card">
            <h3>מה בערכה</h3>
            <Image src={productImages.kit} alt={productImages.kitAlt} width={870} height={1080} sizes="(max-width: 768px) 100vw, 360px" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.6' }}>
              <p><strong>כל מה שצריך להתקנה</strong> - פלט מיידי:</p>
              <ul style={{ margin: '8px 0', paddingRight: '20px' }}>
                <li>המצלמה עם קרוד מתכתי</li>
                <li>פנל סולארי + כבל USB-C</li>
                <li>כרטיס SIM 4G + כלים</li>
                <li>סוג תליה מכל זווית</li>
                <li>ערכת התקנה מלאה</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>שימושים עיקריים</h2>
        <div className="cards">
          {useCases.map((u) => (
            <div key={u.title} className="card">
              <h3>{u.title}</h3>
              <p>{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(0, 194, 255, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
        borderRadius: 'var(--radius)',
        padding: '48px 20px',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${appShots[0].src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.08,
          filter: 'blur(3px)',
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ textAlign: 'center' }}>אפליקציה ובקרה מרחוק</h2>
          <p style={{ marginBottom: '32px', color: 'var(--muted)', textAlign: 'center', maxWidth: '900px', margin: '0 auto 32px' }}>
            אפליקציית Reolink מאפשרת צפייה חיה, הקלטה, התראות וקבלת דוחות מהמצלמה שלך מכל מקום בעולם. תצוגה בזמן אמת, אחסון ענן ושליטה מרחוק בנקודה אחת.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ background: 'rgba(15, 22, 34, 0.95)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--accent)" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                <h3 style={{ margin: 0, color: 'var(--accent)' }}>צפייה חיה בזמן אמת</h3>
              </div>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                קבל תמונה חיה של האתר בכל רגע. פתח את האפליקציה וראה בדיוק מה קורה בשטח הבנייה או בחצר, בכל זמן, מכל מכשיר.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 22, 34, 0.95)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--accent)" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                <h3 style={{ margin: 0, color: 'var(--accent)' }}>התראות מיידיות</h3>
              </div>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                קבל הודעה בפלאפון במיידי כשמגלמת המצלמה תנועה חשודה. התראות בזמן אמת לשמירה על הנכס.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 22, 34, 0.95)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--accent)" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                </svg>
                <h3 style={{ margin: 0, color: 'var(--accent)' }}>אחסון ענן + מקומי</h3>
              </div>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                כל הצילומים נשמרים גם בענן וגם בכרטיס זיכרון במצלמה. גישה למצויינויות כל עת, ללא דאגה לאובדן נתונים.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 22, 34, 0.95)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--accent)" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
                <h3 style={{ margin: 0, color: 'var(--accent)' }}>הצגת מחדש וחיפוש</h3>
              </div>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                חיפוש בהקלטות לפי תאריך ושעה. צפייה בתמונות מימים שעברו כדי לבדוק מה קרה בנכס.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 22, 34, 0.95)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--accent)" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <h3 style={{ margin: 0, color: 'var(--accent)' }}>שיתוף עם צוות</h3>
              </div>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                שתף גישה עם עובדים או אנשי משפחה. כל אחד יכול לצפות במצלמה בהרשאות שאתה קובע.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 22, 34, 0.95)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--accent)" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                </svg>
                <h3 style={{ margin: 0, color: 'var(--accent)' }}>אודיו דו-כיווני</h3>
              </div>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                דברו ישירות דרך המצלמה. שיחה דו-כיוונית עם עובדים או בעלי נכס בשטח בזמן אמת.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 22, 34, 0.95)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--accent)" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                <h3 style={{ margin: 0, color: 'var(--accent)' }}>דוחות וסטטיסטיקות</h3>
              </div>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                קבל דוח על פעילות יומי. כמה אנשים נראו בשטח? מתי היתה התנועה האחרונה? כל מידע בדק אחד.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 22, 34, 0.95)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--accent)" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h3 style={{ margin: 0, color: 'var(--accent)' }}>שליטה במצלמה</h3>
              </div>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                שנה הגדרות מרחוק - רזולוציה, רגישות גילוי, זום. כל השליטה בכף יד דרך האפליקציה.
              </p>
            </div>
          </div>

          <h3 style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text)' }}>צילומי מסך מהאפליקציה</h3>
          <div className="cards">
            {appShots.map((shot, idx) => (
              <div key={shot.src} className="card">
                <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 768px) 100vw, 360px" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
