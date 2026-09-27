import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Award,
  Globe,
  Car,
  Gift,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Check,
  FileCheck,
  Shield,
  Sparkles,
  ArrowRight,
  Smartphone,
} from 'lucide-react';
import { AppUser } from '../../lib/firebase';
import { SamaTaxiLogo, SamaAppIcon } from '../Common/SamaTaxiLogo';

interface Props {
  user: AppUser | null;
  onClose: () => void;
  onOpenDriverRegistration: () => void;
  onSwitchToDriver: () => void;
  onOpenAdmin: () => void;
  onOpenApkModal?: () => void;
  onSignOut: () => void;
}

export const ProfileModal: React.FC<Props> = ({
  user,
  onClose,
  onOpenDriverRegistration,
  onSwitchToDriver,
  onOpenAdmin,
  onOpenApkModal,
  onSignOut,
}) => {
  const [language, setLanguage] = useState<'fr' | 'wo'>('fr');
  const [copiedCode, setCopiedCode] = useState(false);
  const [driverStatus, setDriverStatus] = useState<string>('none');

  useEffect(() => {
    const status = localStorage.getItem('sama_user_driver_status') || 'none';
    setDriverStatus(status);
  }, []);

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText('SAMA-TERANGA-221');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-150 text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <SamaTaxiLogo size="sm" showSubtitle={false} />
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* User Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center font-black text-lg shadow-md">
              {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'AN'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {user?.displayName || 'Aminata Ndiaye'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {user?.email || '+221 77 452 89 12'}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-400 font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>
                  {user?.role === 'admin'
                    ? 'Superviseur Administrateur'
                    : driverStatus === 'approved'
                    ? 'Chauffeur Partenaire Agréé'
                    : 'Client Teranga Gold (4.95 ★)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion d'inscription en tant que chauffeur (Highlight demandé) */}
        {driverStatus !== 'approved' ? (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-950/80 via-slate-900 to-slate-900 border-2 border-red-500/50 shadow-xl space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-400">
                    Opportunité Kaolack
                  </span>
                  <h4 className="text-sm font-bold text-white">Devenez Chauffeur Sama Taxi</h4>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Jusqu'à 50 000 F / jour
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Rentabilisez votre véhicule ou moto Jakarta à Kaolack. Roulez selon vos disponibilités et recevez vos gains chaque jour via Wave ou Orange Money.
            </p>

            {/* Mention Permis Obligatoire */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-[11px] text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-white">Permis de conduire obligatoire :</strong> Prévoir une photo lisible de votre permis sénégalais.
              </span>
            </div>

            <div className="pt-1">
              {driverStatus === 'pending' ? (
                <div className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  <span>Dossier avec permis envoyé (En cours de validation)</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onOpenDriverRegistration();
                  }}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-98 transition-all"
                >
                  <span>S'inscrire comme chauffeur (Permis requis)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Chauffeur déjà validé */
          <button
            onClick={() => {
              onClose();
              onSwitchToDriver();
            }}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 hover:border-emerald-500 transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-emerald-400 transition-colors">
                  Basculer sur l'Espace Chauffeur (Sama Pro)
                </span>
                <span className="text-[11px] text-slate-400">
                  Permis validé · Prêt à recevoir des courses à Kaolack
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
          </button>
        )}

        {/* Administration Access Link */}
        <button
          onClick={() => {
            onClose();
            onOpenAdmin();
          }}
          className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-white block group-hover:text-amber-400 transition-colors">
                Espace Administrateur Sama Taxi
              </span>
              <span className="text-[11px] text-slate-400">
                Valider les permis des chauffeurs & régulation
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
        </button>

        {/* Android APK Download Option */}
        {onOpenApkModal && (
          <button
            onClick={() => {
              onClose();
              onOpenApkModal();
            }}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 hover:border-emerald-500 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block group-hover:text-emerald-400 transition-colors">
                  Application Android (Package APK)
                </span>
                <span className="text-[11px] text-slate-400">
                  Installer l'application sur smartphone Android
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
          </button>
        )}

        {/* Language Selection: French / Wolof */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 mb-2.5">
            <Globe className="w-4 h-4 text-slate-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Langue de l'application
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLanguage('fr')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                language === 'fr'
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              Français (Sénégal)
            </button>
            <button
              onClick={() => setLanguage('wo')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                language === 'wo'
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              Wolof (Sama Taxi)
            </button>
          </div>
          {language === 'wo' && (
            <p className="text-[11px] text-emerald-400 mt-2">
              Jërëjëf ! Sama Taxi dinassi wax ak yaw ci Wolof.
            </p>
          )}
        </div>

        {/* Referral Program */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <Gift className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Parrainez un ami à Dakar
            </h4>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Offrez 1 000 FCFA sur leur première course et recevez 1 000 FCFA sur votre compte Sama Pay.
          </p>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="flex-1 font-mono font-bold text-xs text-red-400 text-center">
              SAMA-TERANGA-221
            </span>
            <button
              onClick={handleCopyInvite}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : 'Copier'}
            </button>
          </div>
        </div>

        {/* App Version & Official Badge */}
        <div className="pt-2 pb-1 flex flex-col items-center justify-center gap-1.5 opacity-80">
          <SamaTaxiLogo size="sm" showSubtitle={true} />
          <span className="text-[10px] text-slate-500 font-mono">
            Application Android v3.4.1 (Édition Kaolack) · Made with ❤️ for Kaolack
          </span>
        </div>

        {/* Disconnect button */}
        <button
          onClick={onSignOut}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/40 text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};
