import type { TimerRecord } from '../../types';
import './DayDetailModal.css';

interface DayDetailModalProps {
  dateKey: string;
  records: TimerRecord[];
  onClose: () => void;
}

export default function DayDetailModal({ dateKey, records, onClose }: DayDetailModalProps) {
  const studyRecords = records.filter(r => r.type === 'study');
  const shortRecords = records.filter(r => r.type === 'shortBreak');
  const longRecords = records.filter(r => r.type === 'longBreak');

  const totalShortTime = shortRecords.reduce((sum, r) => sum + r.duration, 0);
  const totalLongTime = longRecords.reduce((sum, r) => sum + r.duration, 0);

  const formatTime = (minutes: number) => {
    return `${Math.floor(minutes / 60)}h${minutes % 60}m`;
  };

  const formatDate = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-');
    return `${year}年${parseInt(month)}月${parseInt(day)}日`;
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal day-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title-row">
          <span className="modal-icon">📅</span>
          <h3>{formatDate(dateKey)}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="day-stats-row">
          <div className="day-stat study-stat">
            <div className="day-stat-icon">🍅</div>
            <div className="day-stat-value">{studyRecords.length}</div>
            <div className="day-stat-label">次</div>
          </div>
          <div className="day-stat break-stat">
            <div className="day-stat-icon">☕</div>
            <div className="day-stat-value">{formatTime(totalShortTime)}</div>
            <div className="day-stat-label">短休息</div>
          </div>
          <div className="day-stat long-stat">
            <div className="day-stat-icon">🌴</div>
            <div className="day-stat-value">{formatTime(totalLongTime)}</div>
            <div className="day-stat-label">长休息</div>
          </div>
        </div>

        <div className="day-records-title">详细记录</div>

        <div>
          {studyRecords.length === 0 ? (
            <div className="empty-day-state">今天还没有学习记录</div>
          ) : (
            studyRecords.map((record, i) => (
              <div className="day-record-item" key={i}>
                <span className="day-record-icon">🍅</span>
                <span className="day-record-time">{record.time}</span>
                <span className="day-record-duration">{record.duration}min</span>
              </div>
            ))
          )}
        </div>

        <button className="modal-close-btn" onClick={onClose}>关闭</button>
      </div>
    </div>
  );
}
