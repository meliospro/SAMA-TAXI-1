import React, { useState, useEffect } from 'react';
import { Driver } from '../../types/vtc';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface Props {
  driver: Driver;
  onEndCall: () => void;
}

export const DriverCallModal: React.FC<Props> = ({ driver, onEndCall }) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected'>('connecting');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  // Transition from connecting to connected after 1.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus('connected');
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  // Timer interval for call duration
  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = setInterval(() => {
      setDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 animate-in fade-in duration-200">
      {/* Top Details */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Appel sécurisé via Sama Taxi (Numéro masqué)</span>
        </div>

        <div className="relative w-28 h-28 mx-auto mb-4">
          <img
            src={driver.photoUrl}
            alt={driver.name}
            referrerPolicy="no-referrer"
            className="w-full h-full rounded-3xl object-cover border-4 border-slate-800 shadow-2xl"
          />
          {callStatus === 'connecting' && (
            <div className="absolute inset-0 rounded-3xl border-2 border-red-500 animate-ping opacity-40 pointer-events-none" />
          )}
        </div>

        <h3 className="text-xl font-bold text-white font-display">{driver.name}</h3>
        <p className="text-xs text-slate-400 mt-1">
          {driver.carModel} · <span className="font-mono text-slate-300">{driver.licensePlate}</span>
        </p>

        <p className="text-sm font-semibold text-red-400 mt-3 font-mono">
          {callStatus === 'connecting' ? 'Appel en cours...' : formatDuration(duration)}
        </p>
      </div>

      {/* In-Call Controls */}
      <div className="pb-8">
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`h-14 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
              isMuted
                ? 'bg-red-950/40 border-red-500/50 text-red-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-[10px] font-medium">{isMuted ? 'Micro coupé' : 'Micro'}</span>
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`h-14 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
              isSpeaker
                ? 'bg-blue-950/40 border-blue-500/50 text-blue-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="text-[10px] font-medium">{isSpeaker ? 'Haut-parleur' : 'Écouteur'}</span>
          </button>
        </div>

        {/* Hang up button */}
        <button
          onClick={onEndCall}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-red-600/40 active:scale-95 transition-all"
          aria-label="Raccrocher"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
