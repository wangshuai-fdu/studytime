import { useTimerStore } from '../stores/timerStore';
import { useTimer } from '../hooks/useTimer';
import './Pages.css';

export default function TimerPage() {
  const { currentMode, setCurrentMode } = useTimerStore();
  const { isRunning, displayTime, progress, setRunning, resetTimer } = useTimer();

  const handleTabSelect = (mode: 'study' | 'shortBreak' | 'longBreak') => {
    setCurrentMode(mode);
    if (isRunning) {
      setRunning(false);
    }
  };

  const titles = {
    study: '学习计时',
    shortBreak: '短休息',
    longBreak: '长休息',
  };

  // Progress is already calculated in useTimer hook

  return (
    <div className="page-container timer-page">
      <div className="mode-tabs">
        <button
          className={`mode-tab ${currentMode === 'study' ? 'active' : ''}`}
          onClick={() => handleTabSelect('study')}
        >
          学习计时
        </button>
        <button
          className={`mode-tab ${currentMode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => handleTabSelect('shortBreak')}
        >
          短休息
        </button>
        <button
          className={`mode-tab ${currentMode === 'longBreak' ? 'active' : ''}`}
          onClick={() => handleTabSelect('longBreak')}
        >
          长休息
        </button>
      </div>

      <div className="timer-display">
        <div className="mode-label">
          <span className="mode-icon">🍅</span>
          <span>{titles[currentMode]}</span>
        </div>

        <div className="timer-progress-ring">
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="#fff"
              stroke="#f0e6e9"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#f77f8f"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
              transform="rotate(-90 100 100)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="timer-text-overlay">
            <div className="timer-time">{displayTime}</div>
            <div className="timer-progress-text">{progress}%</div>
          </div>
        </div>
      </div>

      <div className="timer-actions">
        <button className="action-btn start-btn" onClick={() => setRunning(!isRunning)}>
          <span>{isRunning ? '⏸' : '▶'}</span>
          <span>{isRunning ? '暂停' : '开始'}</span>
        </button>
        <button className="action-btn reset-btn" onClick={() => { setRunning(false); resetTimer(); }}>
          <span>⟳</span>
          <span>重置</span>
        </button>
      </div>
    </div>
  );
}
