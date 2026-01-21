import Image from "next/image";
import Link from "next/link";
import { heroImage } from "../data/images";
import { heroBullets } from "../data/features";

export function Hero() {
  return (
    <section className="hero">
      <div>
        <span className="tag">4G \u2022 סולארי \u2022 גיבוי ענן</span>
        <h1>מצלמות אבטחה סולאריות 4G לאתרי בנייה ושטחים מבודדים</h1>
        <p>
          ללא חשמל או אינטרנט, עם גיבוי ענן בזמן אמת ושליטה מרחוק. פתרון "שים ושכח" שמגן על האתר ועל הראיות.
        </p>
        <div className="cta-row">
          <Link href="/contact" className="button">
            דברו עם מומחה
          </Link>
          <Link href="/contact" className="button secondary">
            תאמו סיור 300 ₪
          </Link>
        </div>
        <ul className="list">
          {heroBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="hero-img">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          width={heroImage.width}
          height={heroImage.height}
          sizes="(max-width: 768px) 100vw, 600px"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
          priority
        />
      </div>
    </section>
  );
}
