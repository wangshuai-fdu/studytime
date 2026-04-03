import './TabSelector.css';

type TimerMode = 'study' | 'shortBreak' | 'longBreak';

interface TabSelectorProps {
  currentMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

export default function TabSelector({ currentMode, onModeChange }: TabSelectorProps) {
  return (
    <div className="tabs">
      <button
        className={`tab ${currentMode === 'study' ? 'active' : ''}`}
        onClick={() => onModeChange('study')}
      >
        学习计时
      </button>
      <button
        className={`tab ${currentMode === 'shortBreak' ? 'active' : ''}`}
        onClick={() => onModeChange('shortBreak')}
      >
        短休息
      </button>
      <button
        className={`tab ${currentMode === 'longBreak' ? 'active' : ''}`}
        onClick={() => onModeChange('longBreak')}
      >
        长休息
      </button>
    </div>
  );
}
