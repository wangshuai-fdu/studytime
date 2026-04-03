import './DayDetailModal.css';
import type { TimerRecord } from '../../types';

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
    return `${year}-${month}-${day}`;
  };

  const close = () => {
    onClose();
  };

  return (
    <div className="modal-overlay active" onClick={close}>
      <div className="modal day-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span>📅</span>
            <span>{formatDate(dateKey)}详情</span>
          </div>
          <span className="close-btn" onClick={close}>×</span>
        </div>

        <div className="modal-body">
          <div className="detail-stats">
            <div className="stat-item study">
              <span className="stat-icon">🍅</span>
              <div>
                <div className="stat-value">{studyRecords.length} 次</div>
                <div className="stat-label">学习计时</div>
              </div>
            </div>

            <div className="stat-item break short">
              <span className="stat-icon">☕</span>
              <div>
                <div className="stat-value format-time">{formatTime(totalShortTime)}</div>
                <div className="stat-label">短休息</div>
              </div>
            </div>

            <div className="stat-item break long">
              <span className="stat-icon">🌴</span>
              <div>
                <div className="stat-value format-time">{formatTime(totalLongTime)}</div>
                <div className="stat-label">长休息</div>
              </div>
            </div>
          </div>

          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">详细记录</span>
            <span className="divider-line"></span>
          </div>

          <div className="record-list">
            {studyRecords.length === 0 ? (
              <div className="empty-state">今天还没有学习记录</div>
            ) : (
              studyRecords.map((record, i) => (
                <div className="record-item" key={i}>
                  <span className="record-icon">🍅</span>
                  <span className="record-time">{record.time}</span>
                  <span className="record-duration">{record.duration}分钟</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={close}>关闭</button>
        </div>
      </div>
    </div>
  );
}
