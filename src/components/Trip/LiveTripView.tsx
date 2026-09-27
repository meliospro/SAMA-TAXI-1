import React, { useState, useEffect } from 'react';
import { Trip, Driver, RideStatus } from '../../types/vtc';
import {
  Phone,
  MessageCircle,
  Share2,
  Shield,
  Star,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  Navigation,
  Car,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  trip: Trip;
  status: RideStatus;
  driver?: Driver;
  onOpenChat: () => void;
  onOpenCall: () => void;
  onCancelTrip: () => void;
  onFinishTrip: (rating: number, tip: number) => void;
  onShareTrip: () => void;
}

export const LiveTripView: React.FC<Props> = ({
  trip,
  status,
  driver,
  onOpenChat,
  onOpenCall,
  onCancelTrip,
  onFinishTrip,
  onShareTrip,
}) => {
  const [rating, setRating] = useState(5);
  const [selectedTip, setSelectedTip] = useState(0);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>(['Véhicule propre', 'Conduite souple']);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const complimentsList = [
    'Véhicule propre',
    'Conduite souple',
    'Ponctualité',
    'Chauffeur courtois',
    'Climatisation agréable',
    'Bonne musique',
  ];

  const toggleCompliment = (c: string) => {
    setSelectedCompliments(prev =>
      prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
    );
  };

  // 1. Searching Driver Screen (Radar Pulse)
  if (status === 'searching_driver') {
    return (
      <div className="absolute inset-x-0 bottom-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 rounded-t-3xl p-5 shadow-2xl flex flex-col items-center text-center animate-in slide-in-from-bottom duration-200">
        {/* Radar Pulse Circle */}
        <div className="relative w-20 h-20 my-2 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-500/25 animate-radar" />
          <div className="absolute inset-2 rounded-full bg-amber-500/40 animate-ping opacity-60" />
          <div className="relative w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 font-bold">
            <Car className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <h3 className="text-base font-bold text-white mt-2 font-display">Recherche d'un chauffeur...</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Nous contactons les chauffeurs les plus proches à {trip.pickup.neighborhood}.
        </p>

        {/* Course details reminder */}
        <div className="w-full mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <div className="text-left">
            <span className="text-slate-400 block text-[10px]">Destination</span>
            <span className="font-semibold text-white truncate max-w-[170px] block">
              {trip.dropoff.name}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">Tarif fixé</span>
            <span className="font-bold text-red-400 font-mono">
              {trip.estimatedFare.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancelTrip}
          className="mt-4 w-full py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
        >
          Annuler la commande
        </button>
      </div>
    );
  }

  // 2. Completed Trip Summary Screen
  if (status === 'completed') {
    return (
      <div className="absolute inset-x-0 bottom-0 z-40 bg-slate-950/98 backdrop-blur-xl border-t border-slate-800 rounded-t-3xl p-5 shadow-2xl flex flex-col max-h-[90%] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/40">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-white text-center font-display">Course terminée !</h3>
        <p className="text-xs text-slate-400 text-center">Vous êtes bien arrivé(e) à {trip.dropoff.name}</p>

        {/* Fare Receipt Box */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Montant payé</span>
            <span className="text-xl font-black text-white font-mono">
              {(trip.actualFare || trip.estimatedFare + selectedTip).toLocaleString('fr-FR')} FCFA
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Mode de paiement</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {trip.paymentMethod.name}
            </span>
          </div>
        </div>

        {/* Star Rating */}
        <div className="mt-4 text-center">
          <p className="text-xs font-semibold text-slate-300 mb-2">Notez Moussa Diop</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1.5 text-2xl active:scale-125 transition-transform"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                      : 'text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Compliment Badges */}
        <div className="mt-4">
          <p className="text-[11px] font-medium text-slate-400 mb-2">Qu’avez-vous apprécié ?</p>
          <div className="flex flex-wrap gap-1.5">
            {complimentsList.map(comp => {
              const active = selectedCompliments.includes(comp);
              return (
                <button
                  key={comp}
                  onClick={() => toggleCompliment(comp)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors border ${
                    active
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {comp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip Driver (Pourboire) */}
        <div className="mt-4">
          <p className="text-[11px] font-medium text-slate-400 mb-2">Ajouter un pourboire au chauffeur</p>
          <div className="grid grid-cols-4 gap-2">
            {[0, 200, 500, 1000].map(tipAmount => (
              <button
                key={tipAmount}
                onClick={() => setSelectedTip(tipAmount)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedTip === tipAmount
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                    : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                {tipAmount === 0 ? 'Aucun' : `+${tipAmount} F`}
              </button>
            ))}
          </div>
        </div>

        {/* Finish CTA */}
        <button
          onClick={() => onFinishTrip(rating, selectedTip)}
          className="mt-5 w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all"
        >
          Valider & Revenir à l'accueil
        </button>
      </div>
    );
  }

  // 3. Driver Assigned / Arriving / In Progress Screen
  const isArriving = status === 'driver_assigned' || status === 'driver_arriving';
  const isInProgress = status === 'in_progress';

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 rounded-t-3xl p-4 shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-200">
      {/* Top Status Bar: ETA & Security PIN */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="text-sm font-bold text-white font-display">
              {isArriving ? 'Chauffeur en route' : 'Course en cours'}
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isArriving
              ? 'Arrive dans environ 2 minutes'
              : `Arrivée estimée à ${trip.dropoff.name}`}
          </p>
        </div>

        {/* Security PIN Code Box - Hallmark of VTC Safety */}
        <div className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-center">
          <span className="block text-[9px] uppercase tracking-wider text-amber-300 font-bold">
            Code PIN
          </span>
          <span className="block text-base font-extrabold text-white font-mono tracking-widest">
            {trip.pinCode}
          </span>
        </div>
      </div>

      {/* Driver & Vehicle Details Card */}
      <div className="py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={driver?.photoUrl}
              alt={driver?.name}
              referrerPolicy="no-referrer"
              className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-amber-400" />
              <span>{driver?.rating}</span>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white">{driver?.name}</h5>
            <p className="text-xs text-slate-300 font-medium">{driver?.carModel}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-white font-mono tracking-wider border border-slate-700">
                {driver?.licensePlate}
              </span>
              <span className="text-xs text-slate-400">{driver?.carColor}</span>
            </div>
          </div>
        </div>

        {/* Quick Driver Communication Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenChat}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200 hover:text-white active:scale-95 transition-transform relative"
            aria-label="Discuter avec le chauffeur"
          >
            <MessageCircle className="w-5 h-5 text-red-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-slate-950" />
          </button>

          <button
            onClick={onOpenCall}
            className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform"
            aria-label="Appeler le chauffeur"
          >
            <Phone className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>

      {/* Trajet & Fare details row */}
      <div className="pt-2 pb-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span>{trip.category.name}</span>
          <span>·</span>
          <span className="text-slate-300 font-medium">{trip.paymentMethod.name}</span>
        </div>
        <div className="font-bold text-white font-mono">
          {trip.estimatedFare.toLocaleString('fr-FR')} FCFA
        </div>
      </div>

      {/* Safety & Action Footer Bar */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onShareTrip}
          className="flex-1 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-98 transition-all"
        >
          <Share2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Partager le trajet</span>
        </button>

        <button
          onClick={() => setShowCancelConfirm(true)}
          className="px-3 h-10 rounded-xl border border-red-950 bg-red-950/30 hover:bg-red-900/40 text-red-400 text-xs font-semibold active:scale-98 transition-all"
        >
          Annuler
        </button>
      </div>

      {/* Cancellation Confirmation Dialog */}
      {showCancelConfirm && (
        <div className="absolute inset-0 bg-slate-950/98 rounded-3xl p-5 flex flex-col justify-center items-center text-center z-50 animate-in fade-in duration-150">
          <AlertTriangle className="w-10 h-10 text-amber-400 mb-2" />
          <h4 className="text-base font-bold text-white">Voulez-vous vraiment annuler ?</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Le chauffeur Moussa est déjà en route vers votre position.
          </p>
          <div className="flex gap-2 w-full mt-4">
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold"
            >
              Continuer la course
            </button>
            <button
              onClick={() => {
                setShowCancelConfirm(false);
                onCancelTrip();
              }}
              className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold"
            >
              Confirmer l'annulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
