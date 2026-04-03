import { useTimerStore } from '../../stores/timerStore';
import './TabSelector.css';

interface TabSelectorProps {
  onSelect: (mode: 'study' | 'shortBreak' | 'longBreak') => void;
}

export default function TabSelector({ onSelect }: TabSelectorProps) {
  const { currentMode } = useTimerStore();

  const tabs = [
    { key: 'study', label: '学习计时', emoji: '🍅' },
    { key: 'shortBreak', label: '短休息', emoji: '☕' },
    { key: 'longBreak', label: '长休息', emoji: '🌴' },
  ];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab ${currentMode === tab.key ? 'active' : ''}`}
          onClick={() => onSelect(tab.key as 'study' | 'shortBreak' | 'longBreak')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
