import { featurePoints } from "../data/features";

export function FeatureGrid() {
  return (
    <section>
      <h2>למה לבחור במערכת?</h2>
      <div className="cards">
        {featurePoints.map((f) => (
          <div key={f.title} className="card">
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
