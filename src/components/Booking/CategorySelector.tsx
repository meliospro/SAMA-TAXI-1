import React, { useState } from 'react';
import { LocationPoint, RideCategory, PaymentMethod } from '../../types/vtc';
import { RIDE_CATEGORIES } from '../../data/kaolackData';
import {
  Users,
  Clock,
  Sparkles,
  Tag,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  X,
  Check,
} from 'lucide-react';

interface Props {
  pickup: LocationPoint;
  dropoff: LocationPoint;
  selectedCategory: RideCategory;
  onSelectCategory: (cat: RideCategory) => void;
  selectedPayment: PaymentMethod;
  onOpenPaymentPicker: () => void;
  onConfirmOrder: (fare: number, notes: string, promoDiscount: number) => void;
  onCancelSelection: () => void;
}

export const CategorySelector: React.FC<Props> = ({
  pickup,
  dropoff,
  selectedCategory,
  onSelectCategory,
  selectedPayment,
  onOpenPaymentPicker,
  onConfirmOrder,
  onCancelSelection,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [driverNote, setDriverNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  // Approximate distance in km based on rough coordinates
  const calculateDistanceKm = (p: LocationPoint, d: LocationPoint) => {
    const latDiff = (p.lat - d.lat) * 111;
    const lngDiff = (p.lng - d.lng) * 111 * Math.cos((p.lat * Math.PI) / 180);
    const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    return Math.max(1.5, Number(dist.toFixed(1)));
  };

  const distanceKm = calculateDistanceKm(pickup, dropoff);
  const distanceMeters = Math.round(distanceKm * 1000);
  const intervals500m = Math.max(1, Math.ceil(distanceMeters / 500));

  // Compute calculated fare in FCFA strictly based on user rule: 200 FCFA pour chaque 500m
  const computeFare = (cat: RideCategory) => {
    let ratePer500m = 200; // Règle officielle Sama Taxi : 200 FCFA / 500m
    if (cat.id === 'moto') ratePer500m = 150; // Moto Jakarta
    else if (cat.id === 'confort') ratePer500m = 250;
    else if (cat.id === 'climatise') ratePer500m = 350;

    let raw = intervals500m * ratePer500m;
    if (appliedPromo) {
      raw = Math.max(400, raw - 500); // 500 FCFA discount
    }
    return Math.round(raw / 50) * 50;
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'TERANGA' || code === 'KAOLACK221' || code === 'MEDINABAYE' || code === 'YANGOSAMA') {
      setAppliedPromo(code);
      setPromoError(null);
      setShowPromoInput(false);
    } else {
      setPromoError('Code promo invalide. Essayez "KAOLACK221" (-500 F).');
    }
  };

  const currentFare = computeFare(selectedCategory);

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 rounded-t-3xl shadow-2xl flex flex-col max-h-[82%] animate-in slide-in-from-bottom-8 duration-200">
      {/* Drawer Handle & Header */}
      <div className="pt-2.5 pb-1 px-4 flex items-center justify-between border-b border-slate-800/60">
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto" />
        <button
          onClick={onCancelSelection}
          className="absolute right-3 top-3 w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Trajet recap summary */}
      <div className="px-4 py-2.5 flex items-center justify-between bg-slate-900/50 text-xs text-slate-400 border-b border-slate-800/40">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-white font-medium truncate">{pickup.name}</span>
          <span>➔</span>
          <span className="text-white font-medium truncate">{dropoff.name}</span>
        </div>
        <div className="shrink-0 font-medium text-slate-300 ml-2 flex items-center gap-1.5">
          <span className="text-amber-400 font-bold font-mono text-[11px] bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
            200 F / 500m
          </span>
          <span>{distanceKm} km</span>
        </div>
      </div>

      {/* Vehicle Categories Scrollable List */}
      <div className="overflow-y-auto px-3 py-2 space-y-2 max-h-56">
        {RIDE_CATEGORIES.map(cat => {
          const isSelected = selectedCategory.id === cat.id;
          const fare = computeFare(cat);

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-amber-950/20 border-amber-400 shadow-lg ring-1 ring-amber-400/40 shadow-amber-500/10'
                  : 'bg-slate-900/40 border-slate-800/70 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-12 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden shrink-0 border border-slate-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{cat.name}</span>
                    {cat.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/25">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-1">{cat.tagline}</div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Clock className="w-3 h-3" /> {cat.etaMinutes} min
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      <Users className="w-3 h-3 text-slate-500" /> {cat.capacity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <div className="text-base font-extrabold text-white font-mono tabular-nums">
                  {fare.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-400">FCFA</span>
                </div>
                {appliedPromo && (
                  <div className="text-[10px] text-emerald-400 font-medium line-through">
                    {(fare + 500).toLocaleString('fr-FR')} F
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra Options: Promo Code & Note to Driver */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-slate-800/60 text-xs">
        {/* Promo code badge / button */}
        {appliedPromo ? (
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Tag className="w-3.5 h-3.5" />
            <span>Code {appliedPromo} (-500 FCFA)</span>
            <button
              onClick={() => setAppliedPromo(null)}
              className="text-slate-500 hover:text-slate-300 ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPromoInput(!showPromoInput)}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <Tag className="w-3.5 h-3.5 text-red-500" />
            <span>Code promo ?</span>
          </button>
        )}

        {/* Note to driver trigger */}
        <button
          onClick={() => setShowNoteInput(!showNoteInput)}
          className={`flex items-center gap-1 transition-colors ${
            driverNote ? 'text-red-400 font-medium' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{driverNote ? 'Note enregistrée' : 'Note au chauffeur'}</span>
        </button>
      </div>

      {/* Promo Code Input Drawer if opened */}
      {showPromoInput && !appliedPromo && (
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Entrez TERANGA"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-red-500"
          />
          <button
            onClick={handleApplyPromo}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg"
          >
            Appliquer
          </button>
        </div>
      )}
      {promoError && (
        <div className="px-4 text-[11px] text-red-400 bg-red-950/40 py-1">{promoError}</div>
      )}

      {/* Note input if opened */}
      {showNoteInput && (
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ex: Devant la pharmacie, bagage lourd..."
            value={driverNote}
            onChange={e => setDriverNote(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
          />
          <button
            onClick={() => setShowNoteInput(false)}
            className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg"
          >
            OK
          </button>
        </div>
      )}

      {/* Payment Selector Bar */}
      <div className="px-4 py-2.5 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={onOpenPaymentPicker}
          className="flex items-center gap-2.5 hover:opacity-90 active:scale-98 transition-transform"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm"
            style={{ backgroundColor: selectedPayment.color }}
          >
            {selectedPayment.id === 'wave'
              ? 'W'
              : selectedPayment.id === 'orange_money'
              ? 'OM'
              : selectedPayment.id === 'wallet'
              ? 'ST'
              : 'F'}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>{selectedPayment.name}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-[10px] text-slate-400">{selectedPayment.description}</div>
          </div>
        </button>

        <div className="text-right">
          <div className="text-xs text-slate-400">Total à payer</div>
          <div className="text-sm font-bold text-white font-mono tabular-nums">
            {currentFare.toLocaleString('fr-FR')} FCFA
          </div>
        </div>
      </div>

      {/* Order Primary CTA Button - Ergonomic Natural Thumb Reach */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <button
          onClick={() => onConfirmOrder(currentFare, driverNote, appliedPromo ? 500 : 0)}
          className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
          <span>Commander {selectedCategory.name}</span>
          <span className="text-xs font-mono font-bold opacity-90">({currentFare.toLocaleString('fr-FR')} F)</span>
        </button>
      </div>
    </div>
  );
};
