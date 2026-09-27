import React from 'react';
import { PaymentMethod } from '../../types/vtc';
import { PAYMENT_METHODS } from '../../data/dakarData';
import { Check, ShieldCheck, X } from 'lucide-react';

interface Props {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  onClose: () => void;
}

export const PaymentMethodModal: React.FC<Props> = ({
  selectedMethod,
  onSelect,
  onClose,
}) => {
  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-[#11181D] border-t border-[#273740] rounded-t-3xl p-4 flex flex-col max-h-[75%] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#202C33]">
          <div>
            <h3 className="text-base font-bold text-white font-display">Modes de paiement</h3>
            <p className="text-xs text-slate-400">Choisissez comment régler votre course Sama Taxi</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#162026] border border-[#273740] flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Payment Methods List */}
        <div className="py-3 space-y-2.5 overflow-y-auto">
          {PAYMENT_METHODS.map(method => {
            const isSelected = selectedMethod.id === method.id;

            return (
              <button
                key={method.id}
                onClick={() => {
                  onSelect(method);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? 'bg-[#182329] border-[#FDB813] shadow-lg shadow-amber-500/10 ring-1 ring-[#FDB813]/40'
                    : 'bg-[#162026]/60 border-[#223038] hover:bg-[#182329]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm shrink-0"
                    style={{
                      backgroundColor: method.color,
                      color: method.id === 'wallet' ? '#000000' : '#ffffff',
                    }}
                  >
                    {method.id === 'wave'
                      ? '🌊'
                      : method.id === 'orange_money'
                      ? 'OM'
                      : method.id === 'wallet'
                      ? 'ST'
                      : '💵'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{method.name}</span>
                      {method.id === 'wave' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Sans frais
                        </span>
                      )}
                      {method.id === 'wallet' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDB813]/20 text-[#FDB813] border border-[#FDB813]/40">
                          -5% de remise
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{method.description}</p>
                    {method.balance !== undefined && (
                      <p className="text-xs font-semibold text-[#FDB813] mt-0.5">
                        Solde dispo : {method.balance.toLocaleString('fr-FR')} FCFA
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'bg-[#FDB813] border-[#FDB813] text-black font-bold' : 'border-[#31434D]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Security guarantee */}
        <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 justify-center">
          <ShieldCheck className="w-4 h-4 text-[#FDB813]" />
          <span>Transactions directes sécurisées à Dakar</span>
        </div>
      </div>
    </div>
  );
};
