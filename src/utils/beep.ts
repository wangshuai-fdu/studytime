export function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
}
