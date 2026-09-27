import React, { useState } from 'react';
import { PAST_TRIPS } from '../../data/kaolackData';
import { X, Clock, MapPin, Receipt, Star, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const RideHistoryModal: React.FC<Props> = ({ onClose }) => {
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-slate-900 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white font-display">Mes courses</h2>
          <p className="text-xs text-slate-400">Historique de vos trajets Sama Taxi à Kaolack</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Trips list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {PAST_TRIPS.map(trip => (
          <div
            key={trip.id}
            onClick={() => setSelectedReceipt(trip)}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col gap-2.5 active:scale-99"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">{trip.date}</span>
              <span className="font-extrabold text-white font-mono">
                {trip.fare.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-white font-medium truncate">{trip.pickup}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-sm bg-red-500 shrink-0" />
                <span className="text-slate-300 truncate">{trip.dropoff}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  {trip.category}
                </span>
                <span>Paiement {trip.paymentMethod}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{trip.rating}.0</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Receipt Modal if selected */}
      {selectedReceipt && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-5 flex flex-col justify-between z-50 animate-in fade-in duration-150">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-bold text-white">Reçu de course</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-3">
              <div className="flex justify-between text-slate-400">
                <span>Numéro de course</span>
                <span className="font-mono text-white">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Date & heure</span>
                <span className="text-white">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Véhicule</span>
                <span className="text-white">{selectedReceipt.category}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Moyen de paiement</span>
                <span className="text-emerald-400 font-bold">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm">
                <span className="font-bold text-white">Total débité</span>
                <span className="font-black text-red-400 font-mono">
                  {selectedReceipt.fare.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedReceipt(null)}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Fermer le reçu
          </button>
        </div>
      )}
    </div>
  );
};
