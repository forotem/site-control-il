import { faq } from "../data/features";

export function FAQ() {
  return (
    <section>
      <h2>שאלות נפוצות</h2>
      <div className="cards">
        {faq.map((item) => (
          <div key={item.q} className="card">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
