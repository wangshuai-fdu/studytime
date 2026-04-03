import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '../stores/timerStore';

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
    addRecord,
  } = useTimerStore();

  const audioContextRef = useRef<AudioContext | null>(null);
  const settingsRef = useRef(settings);
  const currentModeRef = useRef(currentMode);
  const enableSoundRef = useRef(enableSound);
  const addRecordRef = useRef(addRecord);

  // 保持 refs 同步
  useEffect(() => {
    settingsRef.current = settings;
    currentModeRef.current = currentMode;
    enableSoundRef.current = enableSound;
    addRecordRef.current = addRecord;
  }, [settings, currentMode, enableSound, addRecord]);

  // 播放提示音
  const playBeep = useCallback(() => {
    if (!enableSoundRef.current) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.frequency.setValueAtTime(800, now);
      osc1.type = 'sine';
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc1.start(now);
      osc1.stop(now + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.setValueAtTime(1000, now + 0.6);
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.3, now + 0.6);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 1.1);
      osc2.start(now + 0.6);
      osc2.stop(now + 1.1);

      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.frequency.setValueAtTime(1200, now + 1.2);
      osc3.type = 'sine';
      gain3.gain.setValueAtTime(0.3, now + 1.2);
      gain3.gain.exponentialRampToValueAtTime(0.01, now + 1.7);
      osc3.start(now + 1.2);
      osc3.stop(now + 1.7);
    } catch (e) {
      console.error('播放声音失败:', e);
    }
  }, []);

  // 触发通知
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

  // 格式化时间显示
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 计算进度百分比
  const progress = totalTime > 0 ? Math.round(((totalTime - remainingTime) / totalTime) * 100) : 0;

  // 计时器逻辑
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
        playBeep();
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
  }, [isRunning, remainingTime, totalTime, setRunning, setTimer, playBeep, triggerNotification]);

  return {
    isRunning,
    displayTime: formatTime(remainingTime),
    progress,
    setRunning,
    playBeep,
  };
}
