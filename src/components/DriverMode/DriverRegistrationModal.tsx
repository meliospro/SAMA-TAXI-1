import React, { useState } from 'react';
import {
  X,
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Car,
  User,
  ShieldCheck,
  Camera,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface Props {
  userId: string;
  userEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const DriverRegistrationModal: React.FC<Props> = ({
  userId,
  userEmail,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form fields
  const [fullName, setFullName] = useState('Mamadou Ndiaye');
  const [phone, setPhone] = useState('+221 77 555 44 33');
  const [cityArea, setCityArea] = useState('Parcelles Assainies, Dakar');

  // Mandatory Driving License fields
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('2028-11-30');
  const [licenseCategory, setLicenseCategory] = useState('B');
  const [licensePhotoRecto, setLicensePhotoRecto] = useState<string | null>(null);
  const [licensePhotoVerso, setLicensePhotoVerso] = useState<string | null>(null);
  const [licenseError, setLicenseError] = useState<string | null>(null);

  // Vehicle info
  const [vehicleModel, setVehicleModel] = useState('Peugeot 301 / Toyota');
  const [vehiclePlate, setVehiclePlate] = useState('DK-7819-BB');
  const [vehicleColor, setVehicleColor] = useState('Gris métallisé');
  const [vehicleYear, setVehicleYear] = useState('2019');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Simulate file upload or camera photo
  const handleSimulatePhoto = (type: 'recto' | 'verso') => {
    // Generate high quality SVG sample of Senegalese Permis de Conduire
    const samplePermisData = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="190" viewBox="0 0 300 190"><rect width="300" height="190" rx="12" fill="%23fef3c7" stroke="%23d97706" stroke-width="2"/><text x="150" y="25" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2392400e" text-anchor="middle">RÉPUBLIQUE DU SÉNÉGAL</text><text x="150" y="40" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23b45309" text-anchor="middle">PERMIS DE CONDUIRE</text><rect x="15" y="55" width="70" height="85" rx="6" fill="%23cbd5e1" stroke="%2394a3b8"/><circle cx="50" cy="85" r="18" fill="%2364748b"/><path d="M25 130 Q50 105 75 130 Z" fill="%2364748b"/><text x="100" y="70" font-family="sans-serif" font-size="11" font-weight="bold" fill="%231e293b">${fullName || 'CHAUFFEUR'}</text><text x="100" y="90" font-family="sans-serif" font-size="9" fill="%23475569">N°: ${licenseNumber || 'SN-DK-2022-8492'}</text><text x="100" y="108" font-family="sans-serif" font-size="9" fill="%23475569">Catégorie: B (Tourisme)</text><text x="100" y="126" font-family="sans-serif" font-size="9" fill="%2316a34a">VALIDE JUSQU'EN 2028</text><rect x="15" y="152" width="270" height="24" rx="4" fill="%23fde68a"/><text x="150" y="168" font-family="sans-serif" font-size="9" font-weight="bold" fill="%2378350f" text-anchor="middle">MINISTÈRE DES INFRASTRUCTURES ET TRANSPORTS</text></svg>`;

    if (type === 'recto') {
      setLicensePhotoRecto(samplePermisData);
      setLicenseError(null);
    } else {
      setLicensePhotoVerso(samplePermisData);
    }
  };

  const handleNextStepFromLicense = () => {
    if (!licenseNumber.trim()) {
      setLicenseError('Le numéro du permis de conduire est strictement obligatoire.');
      return;
    }
    if (!licensePhotoRecto) {
      setLicenseError('La photo du permis de conduire est obligatoire pour vérifier votre identité.');
      return;
    }
    setLicenseError(null);
    setStep(3);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const applicationData = {
        userId,
        userEmail,
        fullName,
        phone,
        cityArea,
        drivingLicenseNumber: licenseNumber,
        drivingLicenseExpiry: licenseExpiry,
        drivingLicenseCategory: licenseCategory,
        drivingLicensePhoto: licensePhotoRecto,
        vehicleModel,
        vehiclePlate,
        vehicleColor,
        vehicleYear,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      // Save to Firestore
      try {
        await addDoc(collection(db, 'driver_applications'), applicationData);
      } catch (err) {
        console.warn('Firestore fallback local:', err);
      }

      // Save to localStorage for demo persistence
      const existing = JSON.parse(localStorage.getItem('sama_driver_applications') || '[]');
      existing.push({ id: `APP-${Date.now()}`, ...applicationData });
      localStorage.setItem('sama_driver_applications', JSON.stringify(existing));
      localStorage.setItem('sama_user_driver_status', 'pending');

      setIsSubmitting(false);
      setSubmitted(true);
      onSuccess();
    } catch {
      setIsSubmitting(false);
      setSubmitted(true);
      onSuccess();
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col justify-between animate-in fade-in duration-150 text-white select-none">
      {/* Top Header */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white">
              SAMA PRO
            </span>
            <h2 className="text-sm font-bold font-display">Inscription Chauffeur Dakar</h2>
          </div>
          <p className="text-[11px] text-slate-400">Rejoignez le 1er réseau VTC du Sénégal</p>
        </div>

        <button
          onClick={onClose}
          aria-label="Fermer"
          className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Step Bar */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between">
        {[
          { num: 1, label: 'Identité' },
          { num: 2, label: 'Permis Obligatoire' },
          { num: 3, label: 'Véhicule' },
          { num: 4, label: 'Validation' },
        ].map(s => (
          <div key={s.num} className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s.num
                  ? 'bg-red-600 text-white'
                  : step > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </span>
            <span
              className={`text-[10px] hidden sm:inline ${
                step === s.num ? 'font-bold text-white' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Content Form Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {submitted ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 mb-3">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Candidature envoyée !</h3>
            <p className="text-xs text-slate-300 max-w-xs mt-2">
              Votre dossier avec permis de conduire a été transmis au service d'accréditation Sama Taxi Dakar.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 text-left max-w-xs">
              <span className="block font-semibold text-white mb-1">Prochaine étape :</span>
              L'administrateur vérifiera l'authenticité de votre permis sous 24h. Vous pouvez aussi le faire valider immédiatement via l'Espace Administrateur.
            </div>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-xs"
            >
              Compris, revenir à l'accueil
            </button>
          </div>
        ) : step === 1 ? (
          /* Step 1: Personal Info */
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
              <User className="w-5 h-5 text-red-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">Informations Personnelles</span>
                <span className="text-slate-400 text-[11px]">Renseignez vos coordonnées sénégalaises</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Nom et prénom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Ex: Cheikh Tidiane Sall"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Numéro de téléphone (Orange / Wave)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+221 77 000 00 00"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Quartier de résidence à Dakar</label>
              <input
                type="text"
                value={cityArea}
                onChange={e => setCityArea(e.target.value)}
                placeholder="Ex: Almadies, Mermoz, Parcelles..."
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        ) : step === 2 ? (
          /* Step 2: MANDATORY Driving License */
          <div className="space-y-3.5">
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-white block">Permis de Conduire Obligatoire</span>
                <span className="text-slate-300 text-[11px]">
                  Conformément à la loi sénégalaise, tout chauffeur VTC doit détenir un permis de conduire valide délivré par le Ministère des Transports.
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                Numéro de permis de conduire <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={e => {
                  setLicenseNumber(e.target.value);
                  setLicenseError(null);
                }}
                placeholder="Ex: SN-DK-2020-84920"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Catégorie</label>
                <select
                  value={licenseCategory}
                  onChange={e => setLicenseCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="B">Catégorie B (Tourisme / VTC)</option>
                  <option value="C">Catégorie C (Poids Lourd)</option>
                  <option value="D">Catégorie D (Transport en commun)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Date d'expiration</label>
                <input
                  type="date"
                  value={licenseExpiry}
                  onChange={e => setLicenseExpiry(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Photo du permis RECTO (Obligatoire) */}
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                Photo du Permis de Conduire (Recto) <span className="text-red-400">* OBLIGATOIRE</span>
              </label>

              {licensePhotoRecto ? (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-500/50 bg-slate-900 p-2">
                  <img
                    src={licensePhotoRecto}
                    alt="Permis Recto"
                    className="w-full h-32 object-contain rounded-xl bg-amber-50"
                  />
                  <div className="mt-2 flex items-center justify-between px-1">
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Permis Recto validé
                    </span>
                    <button
                      onClick={() => setLicensePhotoRecto(null)}
                      className="text-[10px] text-red-400 hover:text-red-300"
                    >
                      Remplacer la photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center text-center">
                  <Camera className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-white">Prendre une photo du permis</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Assurez-vous que le nom et le numéro soient lisibles</span>

                  <button
                    type="button"
                    onClick={() => {
                      if (!licenseNumber) setLicenseNumber('SN-DK-2022-94812');
                      handleSimulatePhoto('recto');
                    }}
                    className="mt-3 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Charger la photo du permis</span>
                  </button>
                </div>
              )}
            </div>

            {licenseError && (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{licenseError}</span>
              </div>
            )}
          </div>
        ) : step === 3 ? (
          /* Step 3: Vehicle Info */
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
              <Car className="w-5 h-5 text-red-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">Détails du véhicule</span>
                <span className="text-slate-400 text-[11px]">Véhicule avec climatisation fonctionnelle</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Marque et modèle</label>
              <input
                type="text"
                value={vehicleModel}
                onChange={e => setVehicleModel(e.target.value)}
                placeholder="Ex: Peugeot 301, Toyota Corolla, Hyundai Accent"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Immatriculation Sénégal</label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={e => setVehiclePlate(e.target.value)}
                  placeholder="DK-XXXX-X"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500 font-mono uppercase"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Couleur</label>
                <input
                  type="text"
                  value={vehicleColor}
                  onChange={e => setVehicleColor(e.target.value)}
                  placeholder="Gris, Blanc, Noir..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Step 4: Summary before submission */
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Récapitulatif de votre dossier</h4>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Chauffeur</span>
                <span className="font-semibold text-white">{fullName}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Téléphone</span>
                <span className="font-mono text-white">{phone}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">N° Permis de conduire</span>
                <span className="font-mono font-bold text-emerald-400">{licenseNumber}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Statut du permis</span>
                <span className="text-emerald-400 font-semibold">Photo fournie (Conforme)</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Véhicule</span>
                <span className="text-white">{vehicleModel} ({vehiclePlate})</span>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                En soumettant ce formulaire, vous attestez sur l'honneur être en possession d'un permis de conduire en cours de validité et d'une assurance transport à jour.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      {!submitted && (
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          {step > 1 && (
            <button
              onClick={() => setStep((s => (s - 1) as any))}
              className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
          )}

          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Étape suivante : Permis de conduire</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleNextStepFromLicense}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Continuer (Véhicule)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={() => setStep(4)}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Vérifier le dossier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
            >
              {isSubmitting ? (
                <span>Enregistrement du dossier...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Soumettre ma candidature avec permis</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
