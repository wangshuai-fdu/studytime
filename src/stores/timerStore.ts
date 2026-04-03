import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings, TimerMode, TimerRecord } from '../types';

interface TimerState {
  // 当前状态
  currentMode: TimerMode;
  isRunning: boolean;
  remainingTime: number; // 剩余秒数
  totalTime: number;     // 总秒数

  // 设置
  settings: Settings;

  // 历史记录
  records: TimerRecord[];

  // 设置相关
  enableNotify: boolean;
  enableSound: boolean;

  // 状态更新
  setCurrentMode: (mode: TimerMode) => void;
  setRunning: (running: boolean) => void;
  setTimer: (remaining: number, total: number) => void;
  resetTimer: () => void;

  // 设置操作
  updateSetting: <K extends keyof Settings>(key: K, value: number) => void;
  toggleNotify: () => void;
  toggleSound: () => void;

  // 记录操作
  addRecord: (mode: TimerMode, duration: number) => void;
  clearRecords: () => void;
}

const defaultSettings: Settings = {
  studyTime: 25,
  shortTime: 5,
  longTime: 15,
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentMode: 'study',
      isRunning: false,
      remainingTime: defaultSettings.studyTime * 60,
      totalTime: defaultSettings.studyTime * 60,
      settings: defaultSettings,
      records: [],
      enableNotify: true,
      enableSound: true,

      // 状态更新
      setCurrentMode: (mode) => {
        const settings = get().settings;
        const timeKey = mode === 'study' ? 'studyTime' : mode === 'shortBreak' ? 'shortTime' : 'longTime';
        set({
          currentMode: mode,
          totalTime: settings[timeKey] * 60,
          remainingTime: settings[timeKey] * 60
        });
      },

      setRunning: (running) => set({ isRunning: running }),

      setTimer: (remaining, total) => set({ remainingTime: remaining, totalTime: total }),

      resetTimer: () => {
        const { currentMode, settings } = get();
        const timeKey = currentMode === 'study' ? 'studyTime' : currentMode === 'shortBreak' ? 'shortTime' : 'longTime';
        const totalTime = settings[timeKey] * 60;
        set({ remainingTime: totalTime, totalTime });
      },

      // 设置操作
      updateSetting: (key, value) => {
        const state = get();
        const newSettings = { ...state.settings, [key]: value };

        // 如果修改的是当前模式的时长，立即重置计时器并暂停
        const modeKeyMap = {
          studyTime: 'study',
          shortTime: 'shortBreak',
          longTime: 'longBreak',
        };
        const currentModeKey = modeKeyMap[key as keyof typeof modeKeyMap];

        if (currentModeKey === state.currentMode) {
          return set({
            settings: newSettings,
            isRunning: false,
            remainingTime: value * 60,
            totalTime: value * 60,
          });
        }

        return set({
          settings: newSettings,
        });
      },

      toggleNotify: () => set((state) => ({ enableNotify: !state.enableNotify })),
      toggleSound: () => set((state) => ({ enableSound: !state.enableSound })),

      // 记录操作
      addRecord: (mode, duration) => set((state) => {
        const now = new Date();
        const record: TimerRecord = {
          date: now.toISOString().split('T')[0],
          time: now.toTimeString().split(' ')[0],
          type: mode,
          duration: duration,
        };
        return { records: [...state.records, record] };
      }),

      clearRecords: () => set({ records: [] }),
    }),
    {
      name: 'pomodoro-storage',
    }
  )
);
