import React, { useState } from 'react';
import { X, Wallet, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  balance: number;
  onTopUp: (amount: number, method: string) => void;
  onClose: () => void;
}

export const WalletModal: React.FC<Props> = ({ balance, onTopUp, onClose }) => {
  const [topUpAmount, setTopUpAmount] = useState<number>(5000);
  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'orange_money'>('wave');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirmTopUp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      onTopUp(topUpAmount, selectedMethod === 'wave' ? 'Wave' : 'Orange Money');
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-slate-900 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white font-display">Portefeuille Sama</h2>
          <p className="text-xs text-slate-400">Rechargez et profitez de 5% de réduction</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Balance Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-xl shadow-red-600/20 relative overflow-hidden">
          <div className="flex items-center justify-between opacity-80 text-xs">
            <span>Solde disponible</span>
            <span>Sama Pay Dakar</span>
          </div>

          <div className="mt-2 text-3xl font-black font-mono tracking-tight">
            {balance.toLocaleString('fr-FR')} <span className="text-lg font-normal">FCFA</span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] bg-black/20 rounded-xl px-3 py-1.5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Bonus fidélité actif : 5% remboursés sur chaque course</span>
          </div>
        </div>

        {/* Top Up Section */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Recharger votre compte
          </h3>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[2000, 5000, 10000, 20000].map(amt => (
              <button
                key={amt}
                onClick={() => setTopUpAmount(amt)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  topUpAmount === amt
                    ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                    : 'bg-slate-950 text-slate-300 border-slate-800'
                }`}
              >
                {amt.toLocaleString('fr-FR')} F
              </button>
            ))}
          </div>

          {/* Payment Method for topup */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setSelectedMethod('wave')}
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                selectedMethod === 'wave'
                  ? 'bg-blue-950/40 border-blue-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-[#1BA7FE] text-white flex items-center justify-center font-bold text-xs">
                W
              </div>
              <span className="text-xs font-bold">Wave (0%)</span>
            </button>

            <button
              onClick={() => setSelectedMethod('orange_money')}
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                selectedMethod === 'orange_money'
                  ? 'bg-orange-950/40 border-orange-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-[#FF6600] text-white flex items-center justify-center font-bold text-xs">
                OM
              </div>
              <span className="text-xs font-bold">Orange Money</span>
            </button>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmTopUp}
            disabled={isProcessing}
            className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-98 transition-all"
          >
            {isProcessing ? (
              <span className="animate-pulse">Validation {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'}...</span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Recharger {topUpAmount.toLocaleString('fr-FR')} FCFA</span>
              </>
            )}
          </button>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Rechargement réussi ! Votre solde a été crédité.</span>
          </div>
        )}

        {/* Transactions History */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <h4 className="text-xs font-bold text-white mb-2">Dernières opérations</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-semibold text-white block">Recharge Wave</span>
                  <span className="text-[10px] text-slate-400">Aujourd’hui 10:14</span>
                </div>
              </div>
              <span className="font-bold text-emerald-400 font-mono">+10 000 F</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-red-400" />
                <div>
                  <span className="font-semibold text-white block">Course Sama Confort</span>
                  <span className="text-[10px] text-slate-400">Hier 18:20</span>
                </div>
              </div>
              <span className="font-bold text-white font-mono">-2 400 F</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
