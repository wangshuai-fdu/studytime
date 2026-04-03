import { Routes, Route } from 'react-router-dom';
import TimerPage from './pages/TimerPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function AppContent() {
  return (
    <div className="app">
      <nav className="top-nav">
        <div className="tabs">
          <a href="/" className={`nav-item ${window.location.pathname === '/' ? 'active' : ''}`}>
            🍅 计时
          </a>
          <a href="/calendar" className={`nav-item ${window.location.pathname === '/calendar' ? 'active' : ''}`}>
            📊 日历
          </a>
          <a href="/settings" className={`nav-item ${window.location.pathname === '/settings' ? 'active' : ''}`}>
            ⚙️ 设置
          </a>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<TimerPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default AppContent;
