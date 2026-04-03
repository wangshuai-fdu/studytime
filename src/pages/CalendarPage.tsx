import { useState } from 'react';
import { useTimerStore } from '../stores/timerStore';
import DayDetailModal from '../components/Calendar/DayDetailModal';
import './Pages.css';

export default function CalendarPage() {
  const { records } = useTimerStore();
  const [modalDateKey, setModalDateKey] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'];

  const dayLabels = ['日', '一', '二', '三', '四', '五', '六'];

  const changeMonth = (delta: number) => {
    const newMonth = currentMonth + delta;
    if (newMonth < 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else if (newMonth > 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(newMonth);
    }
  };

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

  const now = new Date();

  // Week stats: Monday to Sunday
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
  const mondayStr = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  const sundayStr = `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`;

  let weekStudies = 0, weekTime = 0, monthStudies = 0, monthTime = 0;

  records.forEach(r => {
    if (r.type === 'study') {
      if (r.date >= mondayStr && r.date <= sundayStr) {
        weekStudies++;
        weekTime += r.duration;
      }
      if (r.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)) {
        monthStudies++;
        monthTime += r.duration;
      }
    }
  });

  // Streak
  let streak = 0;
  const checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayKey = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
  const hasStudyToday = records.some(r => r.type === 'study' && r.date === todayKey);

  if (!hasStudyToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  for (let daysBack = 0; daysBack < 365; daysBack++) {
    const dateKey = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    if (records.some(r => r.type === 'study' && r.date === dateKey)) {
      streak++;
    } else {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Build calendar days
  const calDays: Array<{ date: number | null; studyCount: number }> = [];
  for (let i = 0; i < firstDay; i++) {
    calDays.push({ date: null, studyCount: 0 });
  }
  for (let day = 1; day <= lastDay; day++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const studyCount = records.filter(r => r.type === 'study' && r.date === dateKey).length;
    calDays.push({ date: day, studyCount });
  }

  // Determine today's date string for highlight
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <div className="page-container">
      {/* Month navigation */}
      <div className="calendar-nav-row">
        <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>‹</button>
        <span className="calendar-month-title">{currentYear}年{monthNames[currentMonth]}</span>
        <button className="calendar-nav-btn" onClick={() => changeMonth(1)}>›</button>
      </div>

      {/* Day labels */}
      <div className="day-labels">
        {dayLabels.map(d => (
          <div className="day-label" key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-card">
        <div className="cal-grid">
          {calDays.map((d, i) => {
            if (!d.date) return <div className="cal-day empty" key={i}></div>;

            const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d.date).padStart(2, '0')}`;
            const isToday = dateKey === todayStr;

            let dotClass = 'empty-dot';
            if (d.studyCount >= 5) dotClass = 'deep-dot';
            else if (d.studyCount >= 3) dotClass = 'medium-dot';
            else if (d.studyCount >= 1) dotClass = 'light-dot';

            return (
              <div className={`cal-day ${isToday ? 'today-badge' : ''}`} key={i} onClick={() => setModalDateKey(dateKey)}>
                <span className="day-number">{d.date}</span>
                <div className={`cal-dot ${dotClass}`}></div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#e74c3c' }}></div>
            <span>深 5+</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#4cd964' }}></div>
            <span>中 3-4</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#c8f7c8' }}></div>
            <span>浅 1-2</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#f0f0e9' }}></div>
            <span>空白</span>
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="streak-card">
        <span className="streak-text">连续打卡</span>
        <span className="streak-count">{streak} 天</span>
        <span className="streak-fire">🔥</span>
      </div>

      {/* Stats */}
      <div className="stats-label">📊 统计摘要</div>
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-card-title">本周</div>
          <div className="stat-card-row">
            <span className="stat-icon">🍅</span>
            {weekStudies} 次
          </div>
          <div className="stat-card-sub">{Math.floor(weekTime / 60)}h{String(weekTime % 60).padStart(2, '0')}m</div>
          <div className="stat-card-sub">日均 {(weekStudies > 0 ? weekTime / weekStudies : 0).toFixed(1)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">本月</div>
          <div className="stat-card-row">
            <span className="stat-icon">🍅</span>
            {monthStudies} 次
          </div>
          <div className="stat-card-sub">{Math.floor(monthTime / 60)}h{String(monthTime % 60).padStart(2, '0')}m</div>
          <div className="stat-card-sub">日均 {(monthStudies > 0 ? monthTime / monthStudies : 0).toFixed(1)}</div>
        </div>
      </div>

      {/* Day detail modal */}
      {modalDateKey && (
        <DayDetailModal
          dateKey={modalDateKey}
          records={records.filter(r => r.date === modalDateKey)}
          onClose={() => setModalDateKey(null)}
        />
      )}
    </div>
  );
}
