import { useTimerStore } from '../../stores/timerStore';
import './TimerDisplay.css';

interface TimerDisplayProps {
  displayTime: string;
  progress: number;
}

export default function TimerDisplay({ displayTime, progress }: TimerDisplayProps) {
  const { currentMode } = useTimerStore();

  const icons = {
    study: '🍅',
    shortBreak: '☕',
    longBreak: '🌴',
  };

  const titles = {
    study: '学习计时',
    shortBreak: '短休息',
    longBreak: '长休息',
  };

  return (
    <div className="timer-content">
      <div className="timer-icon">{icons[currentMode]}</div>
      <div className="timer-title">{titles[currentMode]}</div>

      <div className="timer-circle">
        <div className="timer-surface">
          <div className="timer-text">
            <div className="timer-time">{displayTime}</div>
            <div className="timer-progress">{progress}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
