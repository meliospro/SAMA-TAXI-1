import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle2,
  XCircle,
  FileText,
  Car,
  TrendingUp,
  MapPin,
  Clock,
  LogOut,
  Users,
  Search,
  Eye,
  Sliders,
  DollarSign
} from 'lucide-react';
import { SamaAppIcon } from '../Common/SamaTaxiLogo';

interface Props {
  onExit: () => void;
}

interface Application {
  id: string;
  fullName: string;
  phone: string;
  drivingLicenseNumber: string;
  drivingLicensePhoto: string;
  vehicleModel: string;
  vehiclePlate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export const AdminDashboard: React.FC<Props> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'trips' | 'pricing'>('applications');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Initial mock applications + stored applications
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'APP-DK-101',
      fullName: 'Mamadou Ndiaye',
      phone: '+221 77 555 44 33',
      drivingLicenseNumber: 'SN-DK-2021-94812',
      drivingLicensePhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="190" viewBox="0 0 300 190"><rect width="300" height="190" rx="12" fill="%23fef3c7" stroke="%23d97706" stroke-width="2"/><text x="150" y="25" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2392400e" text-anchor="middle">RÉPUBLIQUE DU SÉNÉGAL</text><text x="150" y="40" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23b45309" text-anchor="middle">PERMIS DE CONDUIRE</text><rect x="15" y="55" width="70" height="85" rx="6" fill="%23cbd5e1" stroke="%2394a3b8"/><circle cx="50" cy="85" r="18" fill="%2364748b"/><path d="M25 130 Q50 105 75 130 Z" fill="%2364748b"/><text x="100" y="70" font-family="sans-serif" font-size="11" font-weight="bold" fill="%231e293b">MAMADOU NDIAYE</text><text x="100" y="90" font-family="sans-serif" font-size="9" fill="%23475569">N°: SN-DK-2021-94812</text><text x="100" y="108" font-family="sans-serif" font-size="9" fill="%23475569">Catégorie: B (Tourisme)</text><text x="100" y="126" font-family="sans-serif" font-size="9" fill="%2316a34a">VALIDE JUSQU'EN 2028</text><rect x="15" y="152" width="270" height="24" rx="4" fill="%23fde68a"/><text x="150" y="168" font-family="sans-serif" font-size="9" font-weight="bold" fill="%2378350f" text-anchor="middle">MINISTÈRE DES INFRASTRUCTURES ET TRANSPORTS</text></svg>`,
      vehicleModel: 'Peugeot 301 Berline',
      vehiclePlate: 'DK-7819-BB',
      status: 'pending',
      submittedAt: 'Aujourd’hui 15:20',
    },
    {
      id: 'APP-DK-100',
      fullName: 'Abdoulaye Sow',
      phone: '+221 78 123 45 67',
      drivingLicenseNumber: 'SN-DK-2019-48201',
      drivingLicensePhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="190" viewBox="0 0 300 190"><rect width="300" height="190" rx="12" fill="%23fef3c7" stroke="%23d97706" stroke-width="2"/><text x="150" y="25" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2392400e" text-anchor="middle">RÉPUBLIQUE DU SÉNÉGAL</text><text x="150" y="40" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23b45309" text-anchor="middle">PERMIS DE CONDUIRE</text><rect x="15" y="55" width="70" height="85" rx="6" fill="%23cbd5e1"/><circle cx="50" cy="85" r="18" fill="%2364748b"/><path d="M25 130 Q50 105 75 130 Z" fill="%2364748b"/><text x="100" y="70" font-family="sans-serif" font-size="11" font-weight="bold" fill="%231e293b">ABDOULAYE SOW</text><text x="100" y="90" font-family="sans-serif" font-size="9" fill="%23475569">N°: SN-DK-2019-48201</text><text x="100" y="108" font-family="sans-serif" font-size="9" fill="%23475569">Catégorie: B (Tourisme)</text><text x="100" y="126" font-family="sans-serif" font-size="9" fill="%2316a34a">VALIDE</text><rect x="15" y="152" width="270" height="24" rx="4" fill="%23fde68a"/><text x="150" y="168" font-family="sans-serif" font-size="9" font-weight="bold" fill="%2378350f" text-anchor="middle">MINISTÈRE DES TRANSPORTS</text></svg>`,
      vehicleModel: 'Toyota Corolla Gris',
      vehiclePlate: 'DK-4921-BA',
      status: 'approved',
      submittedAt: 'Hier 09:15',
    }
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sama_driver_applications');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          setApplications(prev => {
            const combined = [...parsed, ...prev];
            const unique = Array.from(new Map(combined.map(item => [item.drivingLicenseNumber, item])).values());
            return unique;
          });
        }
      }
    } catch {}
  }, []);

  const handleApprove = (id: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, status: 'approved' } : app))
    );
    localStorage.setItem('sama_user_driver_status', 'approved');
  };

  const handleReject = (id: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, status: 'rejected' } : app))
    );
    localStorage.setItem('sama_user_driver_status', 'rejected');
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col justify-between text-white select-none animate-in fade-in duration-200">
      {/* Top Admin Header */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SamaAppIcon size="sm" />
          <div>
            <h2 className="text-sm font-bold font-display">Backoffice Administrateur</h2>
            <p className="text-[10px] text-slate-400">Supervision Centrale Sama Taxi Kaolack</p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Quitter</span>
        </button>
      </div>

      {/* Admin KPI Ribbon */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/60 border-b border-slate-800 text-center">
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Chauffeurs actifs</span>
          <span className="text-sm font-extrabold text-white font-mono">148</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Courses 24h</span>
          <span className="text-sm font-extrabold text-emerald-400 font-mono">1 240</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Tarif actuel</span>
          <span className="text-sm font-extrabold text-amber-400 font-mono">200 F/500m</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 px-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('applications')}
          className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
            activeTab === 'applications'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Vérification Permis ({applications.filter(a => a.status === 'pending').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('trips')}
          className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
            activeTab === 'trips'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Courses Kaolack en direct</span>
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
            activeTab === 'pricing'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Tarification Kaolack</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'applications' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">Exigence Réglementaire : Permis de Conduire</span>
              Tout chauffeur doit soumettre une photo nette de son permis sénégalais avant toute prise en charge de passagers.
            </div>

            {applications.map(app => (
              <div
                key={app.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{app.fullName}</h4>
                    <p className="text-slate-400 text-[11px] font-mono">{app.phone}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      app.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : app.status === 'rejected'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {app.status === 'approved'
                      ? 'Permis Validé'
                      : app.status === 'rejected'
                      ? 'Rejeté'
                      : 'En attente de revue'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">N° Permis de conduire :</span>
                    <span className="font-mono font-bold text-amber-400">{app.drivingLicenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Véhicule :</span>
                    <span className="font-medium text-white">{app.vehicleModel} ({app.vehiclePlate})</span>
                  </div>
                </div>

                {/* Driving License Preview */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Document légal téléversé :
                  </span>
                  <div
                    onClick={() => setSelectedPhoto(app.drivingLicensePhoto)}
                    className="relative cursor-pointer rounded-xl overflow-hidden border border-slate-800 bg-amber-50 p-1 max-h-28 group"
                  >
                    <img
                      src={app.drivingLicensePhoto}
                      alt="Permis Recto"
                      className="w-full h-24 object-contain group-hover:scale-102 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1 transition-opacity">
                      <Eye className="w-4 h-4" />
                      <span>Agrandir</span>
                    </div>
                  </div>
                </div>

                {/* Validation Actions */}
                {app.status === 'pending' && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleReject(app.id)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Rejeter</span>
                    </button>

                    <button
                      onClick={() => handleApprove(app.id)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-600/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Valider le Permis</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'trips' && (
          <div className="space-y-2.5">
            {[
              {
                id: 'TRP-KLK-904',
                client: 'Aminata Ndiaye',
                driver: 'Moussa Diop (DK-4921-BA)',
                pickup: 'Médina Baye (Grande Mosquée)',
                dropoff: 'Marché Central Kaolack (3.5 km)',
                fare: '1 400 FCFA',
                payment: 'Wave',
                status: 'En cours',
              },
              {
                id: 'TRP-KLK-903',
                client: 'Ibrahima Fall',
                driver: 'Cheikh Sarr (Taxi Jaune)',
                pickup: 'Garage Nioro (Gare Sud)',
                dropoff: 'Hôpital Régional Ibrahima Niass (2.5 km)',
                fare: '1 000 FCFA',
                payment: 'Orange Money',
                status: 'En cours',
              },
              {
                id: 'TRP-KLK-902',
                client: 'Fatou Diagne',
                driver: 'Moustapha Ba (Moto Jakarta)',
                pickup: 'Quartier Ndorong',
                dropoff: 'Léona Niassène (1.5 km)',
                fare: '450 FCFA',
                payment: 'Espèces',
                status: 'Terminée',
              },
            ].map(t => (
              <div key={t.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-slate-400 font-bold">{t.id}</span>
                  <span className="font-mono font-extrabold text-emerald-400">{t.fare}</span>
                </div>
                <div className="flex justify-between text-white font-medium">
                  <span>Passager : {t.client}</span>
                  <span className="text-slate-300">Chauffeur : {t.driver}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  {t.pickup} ➔ {t.dropoff}
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <span>Mode : {t.payment}</span>
                  <span className="text-emerald-400 font-bold">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Règle de Tarification Active (Kaolack)
            </h4>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Tarif officiel par palier :</span>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">200 FCFA / 500 mètres</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Équivalent kilométrique :</span>
                <span className="font-mono text-white">400 FCFA / kilomètre</span>
              </div>
            </div>

            <div className="space-y-2 text-slate-300 text-[11px]">
              <div className="flex justify-between p-2 rounded-lg bg-slate-950">
                <span>Trajet Médina Baye ➔ Marché Central (3.5 km)</span>
                <span className="font-mono font-bold text-white">1 400 FCFA</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950">
                <span>Trajet Garage Nioro ➔ Hôpital Régional (2.5 km)</span>
                <span className="font-mono font-bold text-white">1 000 FCFA</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950">
                <span>Trajet Ndorong ➔ Campus USSEIN Kahone (6 km)</span>
                <span className="font-mono font-bold text-white">2 400 FCFA</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal image zoom if clicked */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in"
        >
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 max-w-sm w-full">
            <img src={selectedPhoto} alt="Zoom Permis" className="w-full rounded-xl bg-amber-50" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="mt-3 w-full py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
            >
              Fermer l'aperçu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
