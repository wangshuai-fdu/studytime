import { useTimerStore } from '../stores/timerStore';
import { useState, useEffect } from 'react';
import './Pages.css';

export default function SettingsPage() {
  const {
    settings,
    updateSetting,
    toggleNotify,
    toggleSound,
    clearRecords,
    enableNotify,
    enableSound,
  } = useTimerStore();

  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key: keyof typeof localSettings, value: number) => {
    updateSetting(key, value);
    setLocalSettings({ ...localSettings, [key]: value });
  };

  const handleClear = () => {
    if (confirm('确定要清除所有历史记录吗？此操作无法撤销。')) {
      clearRecords();
      alert('已清除所有历史记录');
    }
  };

  return (
    <div className="page-container">
      <div className="settings-content">
        <div className="setting-row">
          <div className="setting-label">学习计时时长</div>
          <div className="setting-value">
            <div className="setting-number">
              <button onClick={() => handleSettingChange('studyTime', Math.max(1, localSettings.studyTime - 1))}>
                −
              </button>
              <span>{localSettings.studyTime}</span>
              <button onClick={() => handleSettingChange('studyTime', Math.min(60, localSettings.studyTime + 1))}>
                +
              </button>
            </div>
            分钟
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-label">短休息时长</div>
          <div className="setting-value">
            <div className="setting-number">
              <button onClick={() => handleSettingChange('shortTime', Math.max(1, localSettings.shortTime - 1))}>
                −
              </button>
              <span>{localSettings.shortTime}</span>
              <button onClick={() => handleSettingChange('shortTime', Math.min(30, localSettings.shortTime + 1))}>
                +
              </button>
            </div>
            分钟
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-label">长休息时长</div>
          <div className="setting-value">
            <div className="setting-number">
              <button onClick={() => handleSettingChange('longTime', Math.max(1, localSettings.longTime - 1))}>
                −
              </button>
              <span>{localSettings.longTime}</span>
              <button onClick={() => handleSettingChange('longTime', Math.min(60, localSettings.longTime + 1))}>
                +
              </button>
            </div>
            分钟
          </div>
        </div>

        <div className="setting-row checkbox-row">
          <div className="setting-label">通知提醒</div>
          <div className={`toggle ${enableNotify ? 'active' : 'inactive'}`} onClick={toggleNotify}></div>
        </div>

        <div className="setting-row checkbox-row">
          <div className="setting-label">播放声音</div>
          <div className={`toggle ${enableSound ? 'active' : 'inactive'}`} onClick={toggleSound}></div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-danger" onClick={handleClear}>清除历史数据</button>
        </div>
      </div>
    </div>
  );
}
