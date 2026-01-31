'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          🎥 SiteControl
        </Link>
        
        <ul className="flex gap-8">
          <li><Link href="/" className="hover:text-blue-600 transition">בית</Link></li>
          <li><Link href="/locations" className="hover:text-blue-600 transition">אתרים</Link></li>
          <li><Link href="/blog" className="hover:text-blue-600 transition">בלוג</Link></li>
          <li><Link href="/pricing" className="hover:text-blue-600 transition">מחירים</Link></li>
          <li><Link href="/about" className="hover:text-blue-600 transition">אודות</Link></li>
          <li><Link href="/contact" className="hover:text-blue-600 transition">צור קשר</Link></li>
        </ul>

        <Link href="/contact" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          קבלו הצעה
        </Link>
      </nav>
    </header>
  );
}
