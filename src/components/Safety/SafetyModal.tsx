import React, { useState } from 'react';
import { X, Shield, PhoneCall, Share2, AlertOctagon, CheckCircle2, Lock } from 'lucide-react';

interface Props {
  onClose: () => void;
  onShareTrip: () => void;
}

export const SafetyModal: React.FC<Props> = ({ onClose, onShareTrip }) => {
  const [sosActivated, setSosActivated] = useState(false);

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          <div>
            <h2 className="text-base font-bold text-white font-display">Centre de Sécurité Teranga</h2>
            <p className="text-xs text-slate-400">Assistance 24/7 et numéros d'urgence Sénégal</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* SOS Emergency Button */}
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 text-center">
          <AlertOctagon className="w-10 h-10 text-red-500 mx-auto mb-2 animate-pulse" />
          <h3 className="text-base font-bold text-white">Bouton d'urgence SOS</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            En cas de danger immédiat, déclenchez l'alerte d'assistance et contactez la Police Secours.
          </p>

          <button
            onClick={() => setSosActivated(true)}
            className="mt-3 w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/40 active:scale-98 transition-all"
          >
            Déclencher l'alerte d'urgence
          </button>

          {sosActivated && (
            <div className="mt-3 p-3 rounded-xl bg-red-900/60 border border-red-400 text-xs text-white">
              Signal d'urgence envoyé à l'équipe de supervision Sama Taxi Kaolack & Police Secours.
            </div>
          )}
        </div>

        {/* Share trip live link */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Partager ma position en direct</h4>
              <p className="text-[11px] text-slate-400">Envoyez le lien de suivi GPS à un proche</p>
            </div>
          </div>
          <button
            onClick={onShareTrip}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
          >
            Partager
          </button>
        </div>

        {/* Senegal Emergency Services Directory */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Services d'urgence nationaux
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-bold text-white block">Police Secours Dakar</span>
                <span className="text-[10px] text-slate-400">Intervention d'urgence</span>
              </div>
              <span className="text-sm font-mono font-bold text-red-400">17</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-bold text-white block">Sapeurs Pompiers Sénégal</span>
                <span className="text-[10px] text-slate-400">Secours routier et incendie</span>
              </div>
              <span className="text-sm font-mono font-bold text-amber-400">18</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-bold text-white block">SAMU National (Urgences médicales)</span>
                <span className="text-[10px] text-slate-400">Assistance médicale d'urgence</span>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-400">1515</span>
            </div>
          </div>
        </div>

        {/* 3 Golden Rules */}
        <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-xs space-y-2 text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Vérifiez toujours que la plaque d'immatriculation correspond à l'application.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Ne montez pas si le chauffeur vous demande de payer un supplément non affiché.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
