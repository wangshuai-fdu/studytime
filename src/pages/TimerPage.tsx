import { useTimerStore } from '../stores/timerStore';
import { useTimer } from '../hooks/useTimer';
import TimerDisplay from '../components/Timer/TimerDisplay';
import TimerControls from '../components/Timer/TimerControls';
import './Pages.css';

export default function TimerPage() {
  const { currentMode, setCurrentMode } = useTimerStore();
  const { isRunning, displayTime, progress, setRunning } = useTimer();

  const handleTabSelect = (mode: 'study' | 'shortBreak' | 'longBreak') => {
    setCurrentMode(mode);
    if (isRunning) {
      setRunning(false);
    }
  };

  const handleToggle = () => {
    setRunning(!isRunning);
  };

  return (
    <div className="page-container">
      <div className="tabs">
        <button
          className={`tab ${currentMode === 'study' ? 'active' : ''}`}
          onClick={() => handleTabSelect('study')}
        >
          学习计时
        </button>
        <button
          className={`tab ${currentMode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => handleTabSelect('shortBreak')}
        >
          短休息
        </button>
        <button
          className={`tab ${currentMode === 'longBreak' ? 'active' : ''}`}
          onClick={() => handleTabSelect('longBreak')}
        >
          长休息
        </button>
      </div>

      <TimerDisplay displayTime={displayTime} progress={progress} />
      <TimerControls onToggle={handleToggle} />
    </div>
  );
}
