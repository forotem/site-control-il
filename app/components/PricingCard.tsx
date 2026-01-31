interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  monthly?: string;
  features: string[];
  highlighted?: boolean;
}

export default function PricingCard({
  title,
  description,
  price,
  monthly,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-lg p-8 ${
        highlighted
          ? 'bg-blue-600 text-white shadow-2xl scale-105'
          : 'bg-white border border-gray-200 shadow-lg'
      }`}
    >
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className={`text-sm mb-6 ${highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
        {description}
      </p>

      <div className="mb-6">
        <div className={`text-4xl font-bold ${highlighted ? 'text-white' : 'text-blue-600'}`}>
          {price}
        </div>
        {monthly && (
          <p className={`text-sm ${highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
            + {monthly} לחודש
          </p>
        )}
      </div>

      <button
        className={`w-full py-3 rounded-lg font-bold mb-6 transition ${
          highlighted
            ? 'bg-white text-blue-600 hover:bg-gray-100'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        בחרו חבילה זו
      </button>

      <ul className="space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className={`text-lg ${highlighted ? 'text-blue-100' : 'text-green-500'}`}>✓</span>
            <span className={highlighted ? 'text-blue-50' : 'text-gray-700'}>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
