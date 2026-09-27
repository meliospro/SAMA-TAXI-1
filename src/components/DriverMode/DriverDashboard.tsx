import React, { useState, useEffect } from 'react';
import {
  Power,
  TrendingUp,
  MapPin,
  Clock,
  Navigation,
  CheckCircle,
  XCircle,
  RotateCcw,
  Star,
  Fuel,
  ShieldCheck,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { SamaAppIcon } from '../Common/SamaTaxiLogo';

interface Props {
  onSwitchToPassenger: () => void;
}

export const DriverDashboard: React.FC<Props> = ({ onSwitchToPassenger }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [earningsToday, setEarningsToday] = useState(34500);
  const [tripsCount, setTripsCount] = useState(7);
  const [hasIncomingRequest, setHasIncomingRequest] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [activeDriverRide, setActiveDriverRide] = useState<null | {
    clientName: string;
    pickup: string;
    dropoff: string;
    fare: number;
    distance: string;
    status: 'en_route_pickup' | 'at_pickup' | 'in_progress';
  }>(null);

  // Incoming ride request generator
  useEffect(() => {
    if (!isOnline || activeDriverRide) return;

    const timer = setTimeout(() => {
      setHasIncomingRequest(true);
      setCountdown(15);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isOnline, activeDriverRide]);

  // Countdown timer for incoming request
  useEffect(() => {
    if (!hasIncomingRequest) return;
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          setHasIncomingRequest(false);
          return 15;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasIncomingRequest]);

  const handleAcceptRide = () => {
    setHasIncomingRequest(false);
    setActiveDriverRide({
      clientName: 'Aminata Ndiaye',
      pickup: 'Médina Baye (Grande Mosquée)',
      dropoff: 'Marché Central Kaolack',
      fare: 1400,
      distance: '3.5 km',
      status: 'en_route_pickup',
    });
  };

  const handleDeclineRide = () => {
    setHasIncomingRequest(false);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between overflow-hidden text-white select-none">
      {/* Top Header Bar */}
      <div className="px-4 pt-4 pb-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <SamaAppIcon size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono">
                SAMA PRO
              </span>
              <span className="text-sm font-bold text-white font-display">Espace Chauffeur</span>
            </div>
            <p className="text-[11px] text-slate-400">Moussa Diop · Kaolack Centre</p>
          </div>
        </div>

        <button
          onClick={onSwitchToPassenger}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all"
        >
          Mode Client
        </button>
      </div>

      {/* Online / Offline Status Toggle Bar */}
      <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-3 h-3 rounded-full ${
              isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'
            }`}
          />
          <span className="text-xs font-bold">
            {isOnline ? 'EN LIGNE · Prêt à recevoir des courses' : 'HORS LIGNE · Pause'}
          </span>
        </div>

        <button
          onClick={() => {
            setIsOnline(!isOnline);
            setHasIncomingRequest(false);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            isOnline
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isOnline ? 'Actif' : 'Activer'}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Daily Stats Overview */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Revenus du jour (Kaolack)</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +18% vs hier
            </span>
          </div>

          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {earningsToday.toLocaleString('fr-FR')} <span className="text-sm font-normal text-slate-400">FCFA</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center">
            <div>
              <span className="block text-[10px] text-slate-400">Courses</span>
              <span className="text-sm font-bold text-white font-mono">{tripsCount}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">Acceptation</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">98%</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">Note</span>
              <span className="text-sm font-bold text-amber-400 flex items-center justify-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400" /> 4.96
              </span>
            </div>
          </div>
        </div>

        {/* Active Driver Ride in Progress if accepted */}
        {activeDriverRide && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-red-500/50 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {activeDriverRide.status === 'en_route_pickup'
                    ? 'Vers le client (2 min)'
                    : activeDriverRide.status === 'at_pickup'
                    ? 'Arrivé sur place'
                    : 'Course en cours'}
                </span>
              </div>
              <span className="text-sm font-bold text-red-400 font-mono">
                {activeDriverRide.fare.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Prise en charge</span>
                  <span className="font-semibold text-white">{activeDriverRide.pickup}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-sm bg-red-500 mt-1 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Destination</span>
                  <span className="font-semibold text-white">{activeDriverRide.dropoff}</span>
                </div>
              </div>
            </div>

            {/* GPS Instruction bar */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
              <Navigation className="w-5 h-5 text-red-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">Dans 180 m, serrez à droite</span>
                <span className="text-slate-400 text-[11px]">Direction Corniche Ouest / Sea Plaza</span>
              </div>
            </div>

            {/* Action buttons for driver lifecycle */}
            <div className="mt-4 flex gap-2">
              {activeDriverRide.status === 'en_route_pickup' && (
                <button
                  onClick={() => setActiveDriverRide({ ...activeDriverRide, status: 'at_pickup' })}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Je suis arrivé
                </button>
              )}
              {activeDriverRide.status === 'at_pickup' && (
                <button
                  onClick={() => setActiveDriverRide({ ...activeDriverRide, status: 'in_progress' })}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Démarrer la course
                </button>
              )}
              {activeDriverRide.status === 'in_progress' && (
                <button
                  onClick={() => {
                    setEarningsToday(prev => prev + activeDriverRide.fare);
                    setTripsCount(c => c + 1);
                    setActiveDriverRide(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                >
                  Terminer la course & Encaisser
                </button>
              )}
            </div>
          </div>
        )}

        {/* Zones à forte demande (Surge heatmap list in Dakar) */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-amber-400" /> Zones chaudes de Dakar
            </span>
            <span className="text-[10px] text-amber-400 font-semibold">+1.3x Tarif</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <div>
                <span className="font-semibold text-white block">Les Almadies</span>
                <span className="text-[10px] text-slate-400">Forte demande restaurants & nuit</span>
              </div>
              <span className="text-xs font-bold text-amber-400 font-mono">+600 F</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <div>
                <span className="font-semibold text-white block">Plateau / Sandaga</span>
                <span className="text-[10px] text-slate-400">Sorties de bureaux et commerce</span>
              </div>
              <span className="text-xs font-bold text-amber-400 font-mono">+400 F</span>
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Ride Request Overlay Modal (Yango Style Accept Timer) */}
      {hasIncomingRequest && (
        <div className="absolute inset-x-3 bottom-4 z-50 bg-slate-950 border-2 border-red-500 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">
                Nouvelle commande VTC
              </span>
            </div>
            {/* Radial countdown ring display */}
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-red-500/60 flex items-center justify-center text-xs font-mono font-bold text-white">
              {countdown}s
            </div>
          </div>

          <div className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Aminata Ndiaye</h4>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>4.92 (54 courses)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-white font-mono">1 400 FCFA</span>
                <span className="block text-[10px] text-blue-400 font-semibold">Paiement Wave</span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">Médina Baye (à 500 m · 1 min)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 rounded-sm bg-red-500 shrink-0" />
                <span className="truncate">Marché Central Kaolack (3.5 km)</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              onClick={handleDeclineRide}
              className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 active:scale-95 transition-transform"
            >
              Refuser
            </button>
            <button
              onClick={handleAcceptRide}
              className="flex-[2] py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Accepter ({countdown}s)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
