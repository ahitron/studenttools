import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Nav() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('phs-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('phs-theme', 'light');
    }
  }, [isDark]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-accent text-white'
        : 'text-primary dark:text-[#E8E8F0] hover:bg-accent/10 dark:hover:bg-accent/20'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-panel dark:bg-[#1A1D27] border-b border-border-default dark:border-[#2D3048] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-3 items-center h-14">
        <div className="flex items-center">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
        </div>

        <div className="flex items-center justify-center gap-1">
          <NavLink to="/gpa-calculator" className={linkClass}>
            GPA Calculator
          </NavLink>
          <NavLink to="/final-exam-forecast" className={linkClass}>
            Final Exam Forecast
          </NavLink>
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={() => setIsDark(d => !d)}
            className="p-2 rounded-md text-muted dark:text-[#9CA3AF] hover:text-primary dark:hover:text-[#E8E8F0] hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </nav>
  );
}
