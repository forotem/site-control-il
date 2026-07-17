export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">SiteControl - ReoLink Specialist</h3>
            <p className="text-gray-400">
              מצלמות ReoLink Go & PT עם שירות התקנה מקצועי, ניהול ותמיכה
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">ניווט</h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="/" className="hover:text-white">בית</a></li>
              <li><a href="/blog" className="hover:text-white">בלוג</a></li>
              <li><a href="/pricing" className="hover:text-white">מחירים</a></li>
              <li><a href="/about" className="hover:text-white">אודות</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">צור קשר</h4>
            <p className="text-gray-400">📧 info@site-control-il.com</p>
            <p className="text-gray-400">☎️ 050-XXXXXXX</p>
            <p className="text-gray-400">📍 ישראל</p>
          </div>
        </div>

        <hr className="border-gray-700 mb-8" />
        
        <div className="text-center text-gray-400">
          <p>&copy; 2026 SiteControl. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}
