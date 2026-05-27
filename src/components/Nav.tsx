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

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="16" y1="14" x2="16" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}

function ForecastIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
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

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-accent text-white'
        : 'text-primary dark:text-[#E8E8F0] hover:bg-accent/10 dark:hover:bg-accent/20'
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center w-full h-full text-[10px] transition-colors duration-150 ${
      isActive
        ? 'text-accent dark:text-accent'
        : 'text-muted dark:text-[#9CA3AF] hover:text-primary dark:hover:text-[#E8E8F0]'
    }`;

  return (
    <>
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-panel dark:bg-[#1A1D27] border-b border-border-default dark:border-[#2D3048] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex sm:grid sm:grid-cols-3 justify-between items-center h-14">
          <div className="flex items-center">
            {/* Mobile Home Title */}
            <NavLink to="/" end className="sm:hidden font-heading font-bold text-lg text-primary dark:text-[#E8E8F0]">
              PHS Tools
            </NavLink>
            {/* Desktop Home Link */}
            <NavLink to="/" end className={(props) => `hidden sm:inline-block ${desktopLinkClass(props)}`}>
              Home
            </NavLink>
          </div>

          <div className="hidden sm:flex items-center justify-center gap-1">
            <NavLink to="/gpa-calculator" className={desktopLinkClass}>
              GPA Calculator
            </NavLink>
            <NavLink to="/final-exam-forecast" className={desktopLinkClass}>
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

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-panel dark:bg-[#1A1D27] border-t border-border-default dark:border-[#2D3048] pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-[60px]">
          <NavLink to="/" end className={mobileLinkClass}>
            <HomeIcon />
            <span className="mt-1 font-medium">Home</span>
          </NavLink>
          <NavLink to="/gpa-calculator" className={mobileLinkClass}>
            <CalculatorIcon />
            <span className="mt-1 font-medium">GPA</span>
          </NavLink>
          <NavLink to="/final-exam-forecast" className={mobileLinkClass}>
            <ForecastIcon />
            <span className="mt-1 font-medium">Forecast</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
}
