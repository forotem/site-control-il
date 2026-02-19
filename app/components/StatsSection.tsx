'use client';

import { type ReactNode, useEffect, useRef, useState } from "react";

function AnimatedNumber({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="stat-number">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats: { value: number; suffix: string; prefix: string; label: string; icon: ReactNode }[] = [
    { value: 500, suffix: '+', prefix: '', label: 'מצלמות הותקנו', icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg> },
    { value: 4, suffix: 'K', prefix: '', label: 'איכות צילום', icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m15 12-5-3v6z"/></svg> },
    { value: 24, suffix: '/7', prefix: '', label: 'ניטור בזמן אמת', icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg> },
    { value: 99, suffix: '.9%', prefix: '', label: 'זמינות מערכת', icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg> },
  ];

  return (
    <div ref={sectionRef} className="stats-grid">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`stat-card ${isVisible ? 'stat-card-visible' : ''}`}
          style={{ transitionDelay: `${index * 150}ms` }}
        >
          <div className={`stat-icon-wrap ${isVisible ? 'stat-icon-visible' : ''}`} style={{ transitionDelay: `${index * 150 + 300}ms` }}>
            {stat.icon}
          </div>
          <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
          <div className={`stat-label ${isVisible ? 'stat-label-visible' : ''}`} style={{ transitionDelay: `${index * 150 + 500}ms` }}>
            {stat.label}
          </div>
          <div className="stat-glow" />
        </div>
      ))}
    </div>
  );
}
