import { useTimerStore } from '../../stores/timerStore';
import './TimerControls.css';

interface TimerControlsProps {
  onToggle: () => void;
}

export default function TimerControls({ onToggle }: TimerControlsProps) {
  const { isRunning, setRunning, resetTimer } = useTimerStore();

  const handleStart = () => {
    onToggle();
  };

  const handleReset = () => {
    setRunning(false);
    resetTimer();
  };

  if (isRunning) {
    return (
      <div className="controls">
        <button className="btn btn-secondary" id="pauseBtn" onClick={handleStart}>
          <span>⏸</span>
          <span>暂停</span>
        </button>
        <button className="btn btn-secondary" id="resetBtnRunning" onClick={handleReset}>
          <span>◷</span>
          <span>重置</span>
        </button>
      </div>
    );
  }

  return (
    <div className="controls">
      <button className="btn btn-primary" id="startBtn" onClick={handleStart}>
        <span>▶</span>
        <span>开始</span>
      </button>
      <button className="btn btn-secondary" id="resetBtn" onClick={handleReset}>
        <span>◷</span>
        <span>重置</span>
      </button>
    </div>
  );
}
