'use client';

import Link from "next/link";
import { packages } from "../data/packages";

export function Packages() {
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#00c2ff";
    (e.currentTarget as HTMLButtonElement).style.color = "#0f1622";
    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
    (e.currentTarget as HTMLButtonElement).style.color = "";
    (e.currentTarget as HTMLButtonElement).style.transform = "";
  };

  return (
    <section>
      <h2>חבילות</h2>
      <div className="cards">
        {packages.map((pkg) => (
          <div key={pkg.id} className="card" style={{ borderColor: pkg.highlight ? "var(--accent)" : "var(--border)" }}>
            <div className="tag">{pkg.monthly && pkg.monthly !== "" ? `${pkg.monthly} חודשי` : "חד פעמי"}</div>
            <h3>{pkg.title}</h3>
            <p><strong>{pkg.price}</strong>{pkg.monthly ? ` · ${pkg.monthly}` : ""}</p>
            <ul className="list">
              {pkg.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <Link href="/contact" style={{ width: "100%", display: "block" }}>
              <button 
                className="button" 
                style={{ 
                  width: "100%", 
                  justifyContent: "center", 
                  marginTop: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {pkg.cta}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
