import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '../stores/timerStore';
import { playBeep } from '../utils/beep';

export function useTimer() {
  const {
    isRunning,
    remainingTime,
    totalTime,
    currentMode,
    settings,
    enableSound,
    setRunning,
    setTimer,
    resetTimer,
    addRecord,
  } = useTimerStore();

  const settingsRef = useRef(settings);
  const currentModeRef = useRef(currentMode);
  const addRecordRef = useRef(addRecord);

  useEffect(() => {
    settingsRef.current = settings;
    currentModeRef.current = currentMode;
    addRecordRef.current = addRecord;
  }, [settings, currentMode, addRecord]);

  const triggerNotification = useCallback(() => {
    const titles = {
      study: '学习计时结束',
      shortBreak: '短休息结束',
      longBreak: '长休息结束',
    };

    if (Notification.permission === 'granted') {
      new Notification(titles[currentModeRef.current], {
        body: '休息一下或开始下一个番茄钟',
      });
    }
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? Math.round(((totalTime - remainingTime) / totalTime) * 100) : 0;

  useEffect(() => {
    if (!isRunning) return;

    const startTime = Date.now();
    const endTime = startTime + remainingTime * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.ceil((endTime - now) / 1000);

      if (elapsed <= 0) {
        clearInterval(interval);
        setRunning(false);
        if (enableSound) playBeep();
        triggerNotification();
        const currentModeVal = currentModeRef.current;
        const settingsVal = settingsRef.current;
        const timeKey = currentModeVal === 'study' ? 'studyTime' : currentModeVal === 'shortBreak' ? 'shortTime' : 'longTime';
        const duration = settingsVal[timeKey as keyof typeof settingsVal];
        addRecordRef.current(currentModeVal, duration);
        setTimer(duration * 60, duration * 60);
        return;
      }

      setTimer(elapsed, totalTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remainingTime, totalTime, setRunning, setTimer, enableSound, triggerNotification]);

  return {
    isRunning,
    displayTime: formatTime(remainingTime),
    progress,
    setRunning,
    resetTimer,
    playBeep,
  };
}
