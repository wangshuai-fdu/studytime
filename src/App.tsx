import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTimerStore } from './stores/timerStore';
import TimerPage from './pages/TimerPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

// 顶部导航组件
function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { enableNotify } = useTimerStore();
  const pathname = location.pathname.split('/').pop() || '/';

  // 请求通知权限
  useEffect(() => {
    if (enableNotify && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [enableNotify]);

  const icons: Record<string, string> = {
    '/': '🍅',
    'calendar': '📊',
    'settings': '⚙️',
  };

  const titles: Record<string, string> = {
    '/': '我爱学习',
    'calendar': '日历统计',
    'settings': '设置',
  };

  const navItems = [
    { path: '/', label: '计时', icon: '🍅' },
    { path: '/calendar', label: '日历', icon: '📊' },
    { path: '/settings', label: '设置', icon: '⚙️' },
  ];

  return (
    <nav className="app-nav">
      <div className="nav-left">
        <span className="logo-icon">{icons[pathname] || icons['/']}</span>
        <span className="logo-text">{titles[pathname] || titles['/']}</span>
      </div>
      <div className="nav-center">
        {navItems.map((item) => {
          return (
            <a
              key={item.path}
              className={`nav-item ${pathname === item.path.split('/').pop() || (item.path === '/' && pathname === '/') ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          );
        })}
      </div>
      <div className="nav-right"></div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="app">
      <TopNav />
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

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
