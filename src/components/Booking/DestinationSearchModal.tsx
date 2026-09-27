import React, { useState } from 'react';
import { LocationPoint } from '../../types/vtc';
import { KAOLACK_LOCATIONS } from '../../data/kaolackData';
import {
  Search,
  MapPin,
  Clock,
  ArrowUpDown,
  Plane,
  Building2,
  Home,
  Briefcase,
  Sparkles,
  ChevronRight,
  X,
  Compass,
} from 'lucide-react';

interface Props {
  pickup: LocationPoint;
  onSelectPickup: (loc: LocationPoint) => void;
  onSelectDropoff: (loc: LocationPoint) => void;
  onClose: () => void;
}

export const DestinationSearchModal: React.FC<Props> = ({
  pickup,
  onSelectPickup,
  onSelectDropoff,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [activeInput, setActiveInput] = useState<'dropoff' | 'pickup'>('dropoff');

  // Filter locations by search query
  const filteredLocations = KAOLACK_LOCATIONS.filter(loc => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.neighborhood.toLowerCase().includes(q) ||
      loc.address.toLowerCase().includes(q)
    );
  });

  const handleSelect = (loc: LocationPoint) => {
    if (activeInput === 'pickup') {
      onSelectPickup(loc);
      setActiveInput('dropoff');
    } else {
      onSelectDropoff(loc);
      onClose();
    }
  };

  const getIconForType = (type?: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-4 h-4 text-emerald-400" />;
      case 'work':
        return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'station':
        return <Building2 className="w-4 h-4 text-amber-400" />;
      default:
        return <MapPin className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-200">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-slate-800">
        <h2 className="text-base font-bold text-white font-display">Choisissez votre trajet à Kaolack</h2>
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Input Fields Container */}
      <div className="p-4 bg-slate-900 border-b border-slate-800/80">
        <div className="relative flex flex-col gap-2.5">
          {/* Pickup Input */}
          <div
            onClick={() => setActiveInput('pickup')}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
              activeInput === 'pickup'
                ? 'bg-slate-800/90 border-emerald-500/70 shadow-sm'
                : 'bg-slate-950/70 border-slate-800 text-slate-300'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] text-slate-400 font-medium">Départ (Kaolack)</span>
              <span className="block text-sm font-semibold text-white truncate">{pickup.name}</span>
            </div>
          </div>

          {/* Destination Input */}
          <div
            onClick={() => setActiveInput('dropoff')}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
              activeInput === 'dropoff'
                ? 'bg-slate-800/90 border-red-500/70 shadow-sm'
                : 'bg-slate-950/70 border-slate-800 text-slate-300'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500 ring-4 ring-red-500/20 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] text-slate-400 font-medium">Destination finale</span>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Où allez-vous à Kaolack ?"
                autoFocus
                className="w-full bg-transparent text-sm font-semibold text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            {query && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuery('');
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Kaolack Destination Badges */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => {
              const medina = KAOLACK_LOCATIONS.find(l => l.id === 'medina_baye');
              if (medina) handleSelect(medina);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 whitespace-nowrap active:scale-95 transition-transform"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Médina Baye</span>
          </button>
          <button
            onClick={() => {
              const marche = KAOLACK_LOCATIONS.find(l => l.id === 'marche_central');
              if (marche) handleSelect(marche);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 whitespace-nowrap active:scale-95 transition-transform"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Marché Central</span>
          </button>
          <button
            onClick={() => {
              const nioro = KAOLACK_LOCATIONS.find(l => l.id === 'garage_nioro');
              if (nioro) handleSelect(nioro);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 whitespace-nowrap active:scale-95 transition-transform"
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Garage Nioro</span>
          </button>
          <button
            onClick={() => {
              const ndorong = KAOLACK_LOCATIONS.find(l => l.id === 'garage_dakar_ndorong');
              if (ndorong) handleSelect(ndorong);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 whitespace-nowrap active:scale-95 transition-transform"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ndorong</span>
          </button>
        </div>
      </div>

      {/* Locations Search Results List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-slate-900">
        <div className="py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Lieux recommandés à Kaolack
        </div>
        {filteredLocations.map(loc => (
          <button
            key={loc.id}
            onClick={() => handleSelect(loc)}
            className="w-full flex items-center justify-between py-3.5 px-2 hover:bg-slate-900/60 rounded-xl transition-colors text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-slate-700 transition-colors">
                {getIconForType(loc.type)}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors truncate">
                  {loc.name}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {loc.address} · <span className="text-slate-300 font-medium">{loc.neighborhood}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-500 pl-2">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        ))}

        {filteredLocations.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">
            Aucune adresse trouvée pour "{query}". Essayez "Médina Baye", "Marché Central", "Ndorong" ou "Garage Nioro".
          </div>
        )}
      </div>
    </div>
  );
};
