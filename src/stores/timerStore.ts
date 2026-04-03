import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings, TimerMode, TimerRecord } from '../types';

interface TimerState {
  currentMode: TimerMode;
  isRunning: boolean;
  remainingTime: number; // 剩余秒数
  totalTime: number;     // 总秒数
  settings: Settings;
  records: TimerRecord[];
  enableNotify: boolean;
  enableSound: boolean;
  setCurrentMode: (mode: TimerMode) => void;
  setRunning: (running: boolean) => void;
  setTimer: (remaining: number, total: number) => void;
  resetTimer: () => void;
  updateSetting: <K extends keyof Settings>(key: K, value: number) => void;
  toggleNotify: () => void;
  toggleSound: () => void;
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
      currentMode: 'study',
      isRunning: false,
      remainingTime: defaultSettings.studyTime * 60,
      totalTime: defaultSettings.studyTime * 60,
      settings: defaultSettings,
      records: [],
      enableNotify: true,
      enableSound: true,

      setCurrentMode: (mode) => {
        const settings = get().settings;
        const timeKey = mode === 'study' ? 'studyTime' : mode === 'shortBreak' ? 'shortTime' : 'longTime';
        set({
          currentMode: mode,
          totalTime: settings[timeKey] * 60,
          remainingTime: settings[timeKey] * 60,
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

      updateSetting: (key, value) => {
        const state = get();
        const newSettings = { ...state.settings, [key]: value };

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

        return set({ settings: newSettings });
      },

      toggleNotify: () => set((state) => ({ enableNotify: !state.enableNotify })),
      toggleSound: () => set((state) => ({ enableSound: !state.enableSound })),

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
  ),
);
