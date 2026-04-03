import { useState } from 'react';
import TimerPage from './pages/TimerPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

// Inline SVG logo
const LogoIcon = () => (
  <svg viewBox="0 0 48 48" width="28" height="28" className="nav-brand-icon">
    <ellipse cx="22" cy="26" rx="16" ry="14" fill="#e74c3c" transform="rotate(-10 22 26)" />
    <path d="M30 12 C28 6, 22 4, 16 8 L20 14 C24 10, 28 10, 30 12Z" fill="#27ae60" />
    <path d="M20 14 C18 12, 14 12, 12 14 L16 16 C18 14, 20 14, 20 14Z" fill="#27ae60" />
  </svg>
);

function AppContent() {
  const [activePage, setActivePage] = useState<'timer' | 'calendar' | 'settings'>('timer');

  return (
    <div className="app">
      {/* Header */}
      <header className="top-nav">
        <div className="nav-brand">
          <LogoIcon />
          <span>Pomodoro</span>
        </div>
        <div className="nav-actions">
          {activePage !== 'timer' && (
            <button className="nav-icon" onClick={() => setActivePage('timer')} aria-label="计时">
              <ClockSvg />
            </button>
          )}
          {activePage !== 'calendar' && (
            <button className="nav-icon" onClick={() => setActivePage('calendar')} aria-label="日历">
              <ChartSvg />
            </button>
          )}
          {activePage !== 'settings' && (
            <button className="nav-icon" onClick={() => setActivePage('settings')} aria-label="设置">
              <SettingsSvg />
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        {activePage === 'timer' && <TimerPage />}
        {activePage === 'calendar' && <CalendarPage />}
        {activePage === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}

export default AppContent;

// Simple SVG icons
function ClockSvg() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SettingsSvg() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function ChartSvg() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="6" width="4" height="15" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}
