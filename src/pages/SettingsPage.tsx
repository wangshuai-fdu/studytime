import { useTimerStore } from '../stores/timerStore';
import { useState, useEffect } from 'react';
import { playBeep } from '../utils/beep';
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

  const testBeep = () => {
    playBeep();
  };

  const handleClear = () => {
    if (confirm('确定要清除所有历史记录吗？此操作无法撤销。')) {
      clearRecords();
      alert('已清除所有历史记录');
    }
  };

  return (
    <div className="page-container">
      <div className="settings-title">⚙️ 设置</div>

      <div className="settings-card">
        {/* Study time */}
        <div className="setting-item">
          <div className="setting-row-label">🍅 学习计时时长</div>
          <div className="setting-value-display">{localSettings.studyTime} 分钟</div>
          <div className="setting-controls">
            <button className="setting-btn" onClick={() => handleSettingChange('studyTime', Math.max(1, localSettings.studyTime - 1))}>−</button>
            <button className="setting-btn" onClick={() => handleSettingChange('studyTime', Math.min(60, localSettings.studyTime + 1))}>+</button>
          </div>
        </div>

        {/* Short break */}
        <div className="setting-item">
          <div className="setting-row-label">☕ 短休息时长</div>
          <div className="setting-value-display">{localSettings.shortTime} 分钟</div>
          <div className="setting-controls">
            <button className="setting-btn" onClick={() => handleSettingChange('shortTime', Math.max(1, localSettings.shortTime - 1))}>−</button>
            <button className="setting-btn" onClick={() => handleSettingChange('shortTime', Math.min(30, localSettings.shortTime + 1))}>+</button>
          </div>
        </div>

        {/* Long break */}
        <div className="setting-item">
          <div className="setting-row-label">🌴 长休息时长</div>
          <div className="setting-value-display">{localSettings.longTime} 分钟</div>
          <div className="setting-controls">
            <button className="setting-btn" onClick={() => handleSettingChange('longTime', Math.max(1, localSettings.longTime - 1))}>−</button>
            <button className="setting-btn" onClick={() => handleSettingChange('longTime', Math.min(60, localSettings.longTime + 1))}>+</button>
          </div>
        </div>
      </div>

      {/* Toggle settings */}
      <div className="settings-card" style={{ marginTop: '16px' }}>
        <div className="setting-toggle-row">
          <div className="setting-row-label" style={{ marginTop: '0', marginBottom: '8px' }}>🔔 通知提醒</div>
          <div className="toggle-row-content">
            <span className="toggle-status">{enableNotify ? '已开启' : '已关闭'}</span>
            <div
              className={`toggle-switch ${enableNotify ? 'on' : 'off'}`}
              onClick={toggleNotify}
            >
              <div className="toggle-thumb"></div>
            </div>
          </div>
        </div>

        <div className="setting-toggle-row">
          <div className="setting-row-label" style={{ marginTop: '0', marginBottom: '8px' }}>🔊 播放声音</div>
          <div className="toggle-row-content">
            <span className="toggle-status">{enableSound ? '已开启' : '已关闭'}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="test-btn" onClick={testBeep}>试听</button>
              <div
                className={`toggle-switch ${enableSound ? 'on' : 'off'}`}
                onClick={toggleSound}
              >
                <div className="toggle-thumb"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear button */}
      <button className="clear-btn" onClick={handleClear}>清除</button>
    </div>
  );
}
