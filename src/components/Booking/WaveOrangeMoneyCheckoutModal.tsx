import React, { useState, useEffect } from 'react';
import { MobilePaymentGateway, WaveCheckoutSessionResponse } from '../../services/paymentApi';
import { X, CheckCircle2, QrCode, Smartphone, ArrowRight, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  method: 'wave' | 'orange_money';
  amount: number;
  tripId: string;
  onSuccess: (txId: string) => void;
  onCancel: () => void;
}

export const WaveOrangeMoneyCheckoutModal: React.FC<Props> = ({
  method,
  amount,
  tripId,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'initial' | 'waiting_push' | 'success' | 'error'>('initial');
  const [phone, setPhone] = useState('77 452 89 12');
  const [omOtp, setOmOtp] = useState('');
  const [session, setSession] = useState<WaveCheckoutSessionResponse | null>(null);
  const [txId, setTxId] = useState('');

  // Init Wave session
  useEffect(() => {
    if (method === 'wave') {
      setLoading(true);
      MobilePaymentGateway.createWaveSession({
        amount,
        currency: 'XOF',
        clientReference: tripId,
        description: `Course Sama Taxi ${tripId}`,
      }).then(res => {
        setSession(res);
        setLoading(false);
      });
    }
  }, [method, amount, tripId]);

  const handlePayWave = async () => {
    setStatus('waiting_push');
    try {
      const res = await MobilePaymentGateway.confirmWavePayment(session?.id || 'session');
      if (res.success) {
        setTxId(res.txId);
        setStatus('success');
        setTimeout(() => {
          onSuccess(res.txId);
        }, 1200);
      }
    } catch {
      setStatus('error');
    }
  };

  const handlePayOrangeMoney = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const res = await MobilePaymentGateway.initiateOrangeMoney({
        orderId: tripId,
        amount,
        phone,
        otpCode: omOtp || '1234',
      });
      setLoading(false);
      if (res.status === 'SUCCESS') {
        setTxId(res.transactionId);
        setStatus('success');
        setTimeout(() => {
          onSuccess(res.transactionId);
        }, 1200);
      }
    } catch {
      setLoading(false);
      setStatus('error');
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-end p-0 md:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl md:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90%] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            {method === 'wave' ? (
              <div className="w-9 h-9 rounded-xl bg-[#1BA7FE] text-white flex items-center justify-center font-black text-sm shadow-md">
                W
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#FF6600] text-white flex items-center justify-center font-black text-sm shadow-md">
                OM
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                {method === 'wave' ? 'Paiement Wave API' : 'Paiement Orange Money Sénégal'}
              </h3>
              <p className="text-[11px] text-slate-400">Règlement sécurisé Sama Taxi</p>
            </div>
          </div>

          <button
            onClick={onCancel}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Total à régler</span>
            <span className="text-xl font-black text-white font-mono">
              {amount.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
            Tarif 200 F / 500m
          </span>
        </div>

        {/* Success View */}
        {status === 'success' ? (
          <div className="py-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">Paiement validé avec succès !</h4>
            <p className="text-xs text-slate-400 mt-1">Transaction N° {txId}</p>
            <p className="text-xs text-emerald-400 mt-2">Votre course est confirmée.</p>
          </div>
        ) : method === 'wave' ? (
          /* Wave Flow */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#1BA7FE]/10 border border-[#1BA7FE]/30 flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-lg mb-3 flex items-center justify-center">
                {/* Simulated Wave SVG QR Code */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" fill="currentColor" />
                  <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" fill="currentColor" />
                  <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" fill="currentColor" />
                  <circle cx="50" cy="50" r="12" fill="#1BA7FE" />
                  <text x="50" y="54" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">W</text>
                </svg>
              </div>
              <span className="text-xs font-semibold text-white">Scannez avec l'app Wave</span>
              <span className="text-[11px] text-slate-400">ou validez directement sur ce téléphone</span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handlePayWave}
                disabled={status === 'waiting_push'}
                className="w-full py-3.5 rounded-xl bg-[#1BA7FE] hover:bg-[#1593df] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1BA7FE]/20 active:scale-98 transition-all"
              >
                {status === 'waiting_push' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Confirmation Wave en cours...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>Valider sur mon compte Wave (0% frais)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Orange Money Flow */
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#FF6600]/10 border border-[#FF6600]/30 text-xs">
              <div className="flex items-center gap-2 text-white font-semibold mb-1">
                <span className="w-5 h-5 rounded-full bg-[#FF6600] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Obtenir le code d'autorisation OM</span>
              </div>
              <p className="text-slate-300 text-[11px] pl-7">
                Composez le <span className="font-mono font-bold text-amber-400">#144#391#</span> sur votre mobile Orange pour recevoir votre code OTP temporaire.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Numéro de téléphone Orange</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400">+221</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="77 000 00 00"
                    className="flex-1 bg-transparent text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Code secret / Code OTP OM</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <input
                    type="password"
                    maxLength={6}
                    value={omOtp}
                    onChange={e => setOmOtp(e.target.value)}
                    placeholder="Ex: 4892 (ou tapez 4 chiffres)"
                    className="flex-1 bg-transparent text-xs text-white focus:outline-none font-mono tracking-widest"
                  />
                </div>
              </div>

              <button
                onClick={handlePayOrangeMoney}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#FF6600] hover:bg-[#e05a00] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF6600]/20 active:scale-98 transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Traitement Orange Money...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>Confirmer le paiement OM</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Certification API Sandbox & Production Sénégal BCEAO</span>
        </div>
      </div>
    </div>
  );
};
