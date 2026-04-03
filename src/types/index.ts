// 计时模式类型
export type TimerMode = 'study' | 'shortBreak' | 'longBreak';

// 设置类型
export interface Settings {
  studyTime: number;      // 学习时长（分钟）
  shortTime: number;      // 短休息时长（分钟）
  longTime: number;       // 长休息时长（分钟）
}

// 完成记录类型
export interface TimerRecord {
  date: string;           // 日期 YYYY-MM-DD
  time: string;           // 时间 HH:mm:ss
  type: TimerMode;        // 模式
  duration: number;       // 时长（分钟）
}

// 日历数据
export interface CalendarData {
  date: string;
  studyCount: number;     // 学习次数
  shortDuration: number;  // 短休息总分钟数
  longDuration: number;   // 长休息总分钟数
}
