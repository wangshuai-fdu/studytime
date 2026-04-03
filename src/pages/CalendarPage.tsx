import { useState } from 'react';
import { useTimerStore } from '../stores/timerStore';
import DayDetailModal from '../components/Calendar/DayDetailModal';
import './Pages.css';

export default function CalendarPage() {
  const { records } = useTimerStore();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const months = [
    '1 月', '2 月', '3 月', '4 月', '5 月', '6 月',
    '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'
  ];

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

  // 计算统计 - 使用字符串比较避免 timezone 问题
  const now = new Date();

  // 计算自然周（本周一到本周日）
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
  const mondayStr = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  const sundayStr = `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`;

  let weekStudies = 0;
  let weekTime = 0;
  let monthStudies = 0;
  let monthTime = 0;

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

  // 计算连续打卡
  let streak = 0;
  const checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // 先检查今天是否有学习记录
  const todayKey = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
  const hasStudyToday = records.some(r => r.type === 'study' && r.date === todayKey);

  if (!hasStudyToday) {
    // 如果今天没学习，从昨天开始计算
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (streak < 365) {
    const dateKey = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    const hasStudy = records.some(r => r.type === 'study' && r.date === dateKey);
    if (hasStudy) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const days: Array<{ date: number | null; studyCount: number; shortDuration: number; longDuration: number }> = [];
  for (let i = 0; i < firstDay; i++) {
    days.push({ date: null, studyCount: 0, shortDuration: 0, longDuration: 0 });
  }
  for (let day = 1; day <= lastDay; day++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const allRecords = records.filter(r => r.date === dateKey);
    const studyRecords = allRecords.filter(r => r.type === 'study');
    const shortRecords = allRecords.filter(r => r.type === 'shortBreak');
    const longRecords = allRecords.filter(r => r.type === 'longBreak');

    days.push({ date: day, studyCount: studyRecords.length, shortDuration: shortRecords.reduce((sum, r) => sum + r.duration, 0), longDuration: longRecords.reduce((sum, r) => sum + r.duration, 0) });
  }

  return (
    <div className="page-container">
      <div className="calendar-header">
        <span className="calendar-nav" onClick={() => changeMonth(-1)}>‹</span>
        <span className="calendar-title">{currentYear}年 {months[currentMonth]}</span>
        <span className="calendar-nav" onClick={() => changeMonth(1)}>›</span>
      </div>

      <div className="calendar-grid">
        <div className="calendar-day-header">日</div>
        <div className="calendar-day-header">一</div>
        <div className="calendar-day-header">二</div>
        <div className="calendar-day-header">三</div>
        <div className="calendar-day-header">四</div>
        <div className="calendar-day-header">五</div>
        <div className="calendar-day-header">六</div>
      </div>

      <div className="calendar-grid calendar-days">
        {days.map((d, i) => {
          if (!d.date) return <div className="calendar-day empty" key={i}></div>;

          let className = 'calendar-day';
          if (d.studyCount >= 5) className += ' deep';
          else if (d.studyCount >= 3) className += ' medium';
          else if (d.studyCount >= 1) className += ' light';

          return (
            <div className={className} key={i} onClick={() => setSelectedDate(d.date)}>
              {d.date}
            </div>
          );
        })}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color deep"></div>
          <span>深 5+</span>
        </div>
        <div className="legend-item">
          <div className="legend-color medium"></div>
          <span>中 3-4</span>
        </div>
        <div className="legend-item">
          <div className="legend-color light"></div>
          <span>浅 1-2</span>
        </div>
        <div className="legend-item">
          <div className="legend-color empty"></div>
          <span>空白</span>
        </div>
      </div>

      <div className="streak-card">
        <span>连续打卡</span>
        <span className="streak-num">{streak} 天</span>
        <span>🔥</span>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-title">本周</div>
          <div className="stat-value">{weekStudies} 次</div>
          <div className="stat-sub">{Math.floor(weekTime / 60)}h{weekTime % 60}m</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">本月</div>
          <div className="stat-value">{monthStudies} 次</div>
          <div className="stat-sub">{Math.floor(monthTime / 60)}h{monthTime % 60}m</div>
        </div>
      </div>

      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          records={records.filter(r => {
            const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
            return r.date === dateKey;
          })}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
