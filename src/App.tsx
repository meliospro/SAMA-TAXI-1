import React, { useState, useEffect } from 'react';
import {
  LocationPoint,
  RideCategory,
  PaymentMethod,
  RideStatus,
  UserMode,
  Trip,
  Driver,
} from './types/vtc';
import {
  KAOLACK_LOCATIONS,
  RIDE_CATEGORIES,
  PAYMENT_METHODS,
  MOCK_DRIVER,
} from './data/kaolackData';

import {
  auth,
  onAuthStateChanged,
  signOut,
  AppUser,
  testFirestoreConnection,
  syncUserInFirestore,
} from './lib/firebase';

import { KaolackInteractiveMap } from './components/Map/KaolackInteractiveMap';
import { DestinationSearchModal } from './components/Booking/DestinationSearchModal';
import { CategorySelector } from './components/Booking/CategorySelector';
import { PaymentMethodModal } from './components/Booking/PaymentMethodModal';
import { WaveOrangeMoneyCheckoutModal } from './components/Booking/WaveOrangeMoneyCheckoutModal';
import { LiveTripView } from './components/Trip/LiveTripView';
import { DriverChatModal } from './components/Communication/DriverChatModal';
import { DriverCallModal } from './components/Communication/DriverCallModal';
import { DriverDashboard } from './components/DriverMode/DriverDashboard';
import { DriverRegistrationModal } from './components/DriverMode/DriverRegistrationModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AuthModal } from './components/Auth/AuthModal';
import { RideHistoryModal } from './components/Activity/RideHistoryModal';
import { WalletModal } from './components/Wallet/WalletModal';
import { SafetyModal } from './components/Safety/SafetyModal';
import { ProfileModal } from './components/Profile/ProfileModal';
import { AndroidApkModal } from './components/Android/AndroidApkModal';
import { SamaTaxiLogo, SamaAppIcon } from './components/Common/SamaTaxiLogo';

import {
  Search,
  Navigation,
  Compass,
  Clock,
  Car,
  Bike,
  Shield,
  User,
  History,
  Wallet,
  Sparkles,
  Plane,
  Building2,
  ChevronRight,
  Wifi,
  Battery,
  Signal,
  Smartphone,
  Maximize2,
  Minimize2,
  CheckCircle,
  LogIn,
  KeyRound,
} from 'lucide-react';

export default function App() {
  // Mobile presentation mode (framed phone device or full screen)
  const [deviceFrameMode, setDeviceFrameMode] = useState(true);

  // App & User states
  const [currentUser, setCurrentUser] = useState<AppUser | null>({
    uid: 'demo_user_kaolack',
    email: 'aminata.ndiaye@samataxi.sn',
    displayName: 'Aminata Ndiaye',
    role: 'passenger',
    walletBalance: 15000,
    createdAt: new Date().toISOString(),
  });

  const [userMode, setUserMode] = useState<UserMode>('passenger');
  const [currentTab, setCurrentTab] = useState<'home' | 'activity' | 'wallet' | 'safety' | 'profile'>('home');

  // Booking & Trip states
  const [pickup, setPickup] = useState<LocationPoint>(KAOLACK_LOCATIONS[0]); // Médina Baye
  const [dropoff, setDropoff] = useState<LocationPoint | null>(null);
  const [rideStatus, setRideStatus] = useState<RideStatus>('idle');
  const [selectedCategory, setSelectedCategory] = useState<RideCategory>(RIDE_CATEGORIES[0]); // Sama Taxi Kaolack
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]); // Wave
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [driver, setDriver] = useState<Driver>(MOCK_DRIVER);
  const [tripProgress, setTripProgress] = useState(0); // 0 to 1

  // Modals visibility
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showDriverRegistration, setShowDriverRegistration] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'user' | 'admin'>('user');
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);

  // Wave / Orange Money Checkout Gateway state
  const [pendingCheckout, setPendingCheckout] = useState<{
    method: 'wave' | 'orange_money';
    amount: number;
    tripId: string;
    fare: number;
  } | null>(null);

  // User Wallet Balance
  const [walletBalance, setWalletBalance] = useState(15000);

  // Clock in status bar
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Listen to Firebase Auth state & test Firestore connection on mount
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        const appUser = await syncUserInFirestore(firebaseUser);
        setCurrentUser(appUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // Autonomous ride lifecycle progression simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (rideStatus === 'searching_driver') {
      // Find driver after 3.2 seconds
      timer = setTimeout(() => {
        setRideStatus('driver_assigned');
      }, 3200);
    } else if (rideStatus === 'driver_assigned') {
      // Driver arrives towards pickup point
      timer = setTimeout(() => {
        setRideStatus('driver_arriving');
      }, 1500);
    } else if (rideStatus === 'driver_arriving') {
      // Progressively animate driver arrival in 4 seconds
      const startTime = Date.now();
      const duration = 4000;
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        setTripProgress(progress);

        if (progress >= 1) {
          clearInterval(progressInterval);
          setRideStatus('in_progress');
          setTripProgress(0);
        }
      }, 100);

      return () => clearInterval(progressInterval);
    } else if (rideStatus === 'in_progress') {
      // Progressively animate trip to destination in 7 seconds
      const startTime = Date.now();
      const duration = 7500;
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        setTripProgress(progress);

        if (progress >= 1) {
          clearInterval(progressInterval);
          setRideStatus('completed');
        }
      }, 100);

      return () => clearInterval(progressInterval);
    }

    return () => clearTimeout(timer);
  }, [rideStatus]);

  // Handle destination selection
  const handleSelectDropoff = (loc: LocationPoint) => {
    setDropoff(loc);
    setShowSearchModal(false);
    setRideStatus('choosing_vehicle');
  };

  // Quick shortcut selection
  const handleQuickDestination = (loc: LocationPoint) => {
    setDropoff(loc);
    setRideStatus('choosing_vehicle');
  };

  // Confirm and start booking (with Wave / OM API trigger)
  const handleConfirmOrder = (fare: number, notes: string, discount: number) => {
    if (!dropoff) return;

    const tripId = `TRP-KLK-${Math.floor(1000 + Math.random() * 9000)}`;

    // If Wave or Orange Money is selected, open the real API Checkout Modal first
    if (selectedPayment.id === 'wave' || selectedPayment.id === 'orange_money') {
      setPendingCheckout({
        method: selectedPayment.id,
        amount: fare,
        tripId,
        fare,
      });
      return;
    }

    // Direct booking with cash or wallet
    initiateTrip(tripId, fare);
  };

  const initiateTrip = (tripId: string, fare: number) => {
    if (!dropoff) return;

    const newTrip: Trip = {
      id: tripId,
      pickup,
      dropoff,
      category: selectedCategory,
      paymentMethod: selectedPayment,
      estimatedFare: fare,
      distanceKm: 6.2,
      durationMinutes: 14,
      driver,
      pinCode: String(Math.floor(1000 + Math.random() * 9000)),
      status: 'searching_driver',
      createdAt: new Date().toISOString(),
    };

    setActiveTrip(newTrip);
    setRideStatus('searching_driver');
    setTripProgress(0);
  };

  // Cancel current trip
  const handleCancelTrip = () => {
    setRideStatus('idle');
    setActiveTrip(null);
    setDropoff(null);
    setTripProgress(0);
  };

  // Finish trip after rating
  const handleFinishTrip = (rating: number, tip: number) => {
    setRideStatus('idle');
    setActiveTrip(null);
    setDropoff(null);
    setTripProgress(0);
  };

  // Share trip position
  const handleShareTrip = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  // Top up wallet
  const handleTopUpWallet = (amt: number, method: string) => {
    setWalletBalance(b => b + amt);
  };

  // Auth success
  const handleAuthSuccess = (user: AppUser) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    if (user.role === 'admin') {
      setShowAdminDashboard(true);
    }
  };

  return (
    <div className="min-h-screen h-[100dvh] w-full bg-neutral-950 flex flex-col items-center justify-center p-0 md:p-3 text-slate-100 font-sans selection:bg-amber-400 selection:text-black overflow-hidden">
      {/* Top Helper Bar on Desktop */}
      <header className="hidden md:flex items-center justify-between w-full max-w-md mb-2 px-3 text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <SamaTaxiLogo size="sm" showSubtitle={false} />
          <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-mono">
            200 F / 500m
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApkModal(true)}
            className="px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-colors flex items-center gap-1 font-semibold text-[11px]"
          >
            <Smartphone className="w-3 h-3 text-emerald-400" />
            <span>APK Android</span>
          </button>

          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => setShowAdminDashboard(true)}
              className="px-2.5 py-1 rounded-lg bg-amber-600/30 text-amber-300 border border-amber-500/40 hover:bg-amber-600/50 transition-colors"
            >
              Admin Backoffice
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthInitialMode('admin');
                setShowAuthModal(true);
              }}
              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              Accès Admin
            </button>
          )}

          <button
            onClick={() => setUserMode(m => (m === 'passenger' ? 'driver' : 'passenger'))}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            {userMode === 'passenger' ? 'Sama Pro' : 'Client'}
          </button>

          <button
            onClick={() => setDeviceFrameMode(f => !f)}
            title="Basculer format mobile / plein écran"
            className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            {deviceFrameMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main App Container - Completely Flexible (Flex) */}
      <div
        className={`relative w-full overflow-hidden transition-all duration-300 bg-slate-950 flex flex-col justify-between ${
          deviceFrameMode
            ? 'md:max-w-md md:h-[840px] md:max-h-[calc(100dvh-2.5rem)] md:rounded-[40px] md:border-8 md:border-neutral-900 md:shadow-[0_25px_70px_rgba(0,0,0,0.85)] md:ring-1 md:ring-slate-800'
            : 'w-full h-full'
        }`}
      >
        {/* Mobile Device Status Bar */}
        <div className="relative z-40 px-5 pt-2.5 pb-1 flex items-center justify-between text-xs text-white select-none pointer-events-none shrink-0">
          <span className="font-bold text-xs tracking-tight font-mono">{currentTime || '14:24'}</span>

          {/* Dynamic Island Pill */}
          <div className="w-22 h-4 bg-black rounded-full flex items-center justify-center gap-2 border border-neutral-800/60 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            <span className="w-1 h-1 rounded-full bg-blue-900/60" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-200">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Content View: Passenger vs Driver Mode */}
        {userMode === 'driver' ? (
          <DriverDashboard onSwitchToPassenger={() => setUserMode('passenger')} />
        ) : (
          <div className="relative flex-1 flex flex-col overflow-hidden">
            {/* Interactive Kaolack Google Maps Engine */}
            <div className="absolute inset-0">
              <KaolackInteractiveMap
                pickup={pickup}
                dropoff={dropoff}
                status={rideStatus}
                driver={driver}
                tripProgress={tripProgress}
              />
            </div>

            {/* Top Floating App Bar (when in idle state) */}
            {rideStatus === 'idle' && (
              <div className="relative z-20 px-3.5 pt-2 pb-0 flex flex-col gap-2.5">
                {/* Brand & User Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800/90 shadow-lg">
                    <SamaTaxiLogo size="sm" showSubtitle={false} />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* APK Install Button */}
                    <button
                      onClick={() => setShowApkModal(true)}
                      title="Télécharger l'APK Android"
                      aria-label="Télécharger l'APK Android"
                      className="h-9 px-2.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 flex items-center gap-1 text-xs font-bold shadow-lg active:scale-95 transition-transform"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>APK</span>
                    </button>

                    {/* Admin portal shortcut button */}
                    <button
                      onClick={() => {
                        if (currentUser?.role === 'admin') {
                          setShowAdminDashboard(true);
                        } else {
                          setAuthInitialMode('admin');
                          setShowAuthModal(true);
                        }
                      }}
                      title="Accès Administrateur"
                      aria-label="Accès Administrateur"
                      className="w-9 h-9 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>

                    {/* Profile Trigger */}
                    <button
                      onClick={() => setCurrentTab('profile')}
                      aria-label="Mon profil"
                      className="w-9 h-9 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800/90 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                      <User className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Big Search Bar Trigger "Où allez-vous ?" */}
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="w-full p-3.5 rounded-2xl bg-slate-900/92 hover:bg-slate-900 backdrop-blur-xl border border-slate-800/90 shadow-2xl flex items-center justify-between text-left active:scale-[0.99] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
                      <Search className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block group-hover:text-amber-400 transition-colors">
                        Où allez-vous à Kaolack ?
                      </span>
                      <span className="text-[11px] text-slate-400 truncate block">
                        Médina Baye, Marché Central, Hôpital, Garage Nioro...
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </button>

                {/* Quick Kaolack Destination Shortcuts */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    onClick={() => {
                      const medina = KAOLACK_LOCATIONS.find(l => l.id === 'medina_baye');
                      if (medina) handleQuickDestination(medina);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs text-slate-200 hover:text-white whitespace-nowrap active:scale-95 transition-transform"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Médina Baye</span>
                  </button>

                  <button
                    onClick={() => {
                      const marche = KAOLACK_LOCATIONS.find(l => l.id === 'marche_central');
                      if (marche) handleQuickDestination(marche);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs text-slate-200 hover:text-white whitespace-nowrap active:scale-95 transition-transform"
                  >
                    <Building2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Marché Central</span>
                  </button>

                  <button
                    onClick={() => {
                      const garage = KAOLACK_LOCATIONS.find(l => l.id === 'garage_nioro');
                      if (garage) handleQuickDestination(garage);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs text-slate-200 hover:text-white whitespace-nowrap active:scale-95 transition-transform"
                  >
                    <Car className="w-3.5 h-3.5 text-blue-400" />
                    <span>Garage Nioro</span>
                  </button>

                  <button
                    onClick={() => {
                      const hopital = KAOLACK_LOCATIONS.find(l => l.id === 'hopital_regional');
                      if (hopital) handleQuickDestination(hopital);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs text-slate-200 hover:text-white whitespace-nowrap active:scale-95 transition-transform"
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hôpital Régional</span>
                  </button>
                </div>
              </div>
            )}

            {/* Vehicle Selection Drawer (State: choosing_vehicle) with 200F / 500m pricing */}
            {rideStatus === 'choosing_vehicle' && dropoff && (
              <CategorySelector
                pickup={pickup}
                dropoff={dropoff}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedPayment={selectedPayment}
                onOpenPaymentPicker={() => setShowPaymentModal(true)}
                onConfirmOrder={handleConfirmOrder}
                onCancelSelection={() => {
                  setDropoff(null);
                  setRideStatus('idle');
                }}
              />
            )}

            {/* Live Trip Lifecycle View (Searching, Arriving, In-Progress, Completed) */}
            {(rideStatus === 'searching_driver' ||
              rideStatus === 'driver_assigned' ||
              rideStatus === 'driver_arriving' ||
              rideStatus === 'in_progress' ||
              rideStatus === 'completed') &&
              activeTrip && (
                <LiveTripView
                  trip={activeTrip}
                  status={rideStatus}
                  driver={driver}
                  onOpenChat={() => setShowChatModal(true)}
                  onOpenCall={() => setShowCallModal(true)}
                  onCancelTrip={handleCancelTrip}
                  onFinishTrip={handleFinishTrip}
                  onShareTrip={handleShareTrip}
                />
              )}

            {/* Wave & Orange Money Real Checkout Gateway Modal */}
            {pendingCheckout && (
              <WaveOrangeMoneyCheckoutModal
                method={pendingCheckout.method}
                amount={pendingCheckout.amount}
                tripId={pendingCheckout.tripId}
                onSuccess={txId => {
                  const fare = pendingCheckout.fare;
                  const tripId = pendingCheckout.tripId;
                  setPendingCheckout(null);
                  initiateTrip(tripId, fare);
                }}
                onCancel={() => setPendingCheckout(null)}
              />
            )}

            {/* Destination Search Modal Fullscreen */}
            {showSearchModal && (
              <DestinationSearchModal
                pickup={pickup}
                onSelectPickup={setPickup}
                onSelectDropoff={handleSelectDropoff}
                onClose={() => setShowSearchModal(false)}
              />
            )}

            {/* Payment Method Selector Modal */}
            {showPaymentModal && (
              <PaymentMethodModal
                selectedMethod={selectedPayment}
                onSelect={setSelectedPayment}
                onClose={() => setShowPaymentModal(false)}
              />
            )}

            {/* Driver Chat Modal */}
            {showChatModal && (
              <DriverChatModal
                driver={driver}
                onClose={() => setShowChatModal(false)}
                onCallDriver={() => {
                  setShowChatModal(false);
                  setShowCallModal(true);
                }}
              />
            )}

            {/* Driver Audio Call Modal */}
            {showCallModal && (
              <DriverCallModal driver={driver} onEndCall={() => setShowCallModal(false)} />
            )}

            {/* Driver Registration Modal (Permis de conduire obligatoire) */}
            {showDriverRegistration && (
              <DriverRegistrationModal
                userId={currentUser?.uid || 'user_1'}
                userEmail={currentUser?.email || 'driver@samataxi.sn'}
                onClose={() => setShowDriverRegistration(false)}
                onSuccess={() => {
                  setShowDriverRegistration(false);
                }}
              />
            )}

            {/* Administrator Backoffice In-App Screen */}
            {showAdminDashboard && (
              <AdminDashboard onExit={() => setShowAdminDashboard(false)} />
            )}

            {/* Google Firebase & Admin Login Modal */}
            {showAuthModal && (
              <AuthModal
                initialMode={authInitialMode}
                onSuccess={handleAuthSuccess}
                onClose={() => setShowAuthModal(false)}
              />
            )}

            {/* Past Rides / History Modal */}
            {currentTab === 'activity' && (
              <RideHistoryModal onClose={() => setCurrentTab('home')} />
            )}

            {/* Wallet / Paiements Modal */}
            {currentTab === 'wallet' && (
              <WalletModal
                balance={walletBalance}
                onTopUp={handleTopUpWallet}
                onClose={() => setCurrentTab('home')}
              />
            )}

            {/* Safety & SOS Modal */}
            {currentTab === 'safety' && (
              <SafetyModal onClose={() => setCurrentTab('home')} onShareTrip={handleShareTrip} />
            )}

            {/* Profile & Settings Modal */}
            {currentTab === 'profile' && (
              <ProfileModal
                user={currentUser}
                onClose={() => setCurrentTab('home')}
                onOpenDriverRegistration={() => setShowDriverRegistration(true)}
                onSwitchToDriver={() => setUserMode('driver')}
                onOpenAdmin={() => {
                  if (currentUser?.role === 'admin') {
                    setShowAdminDashboard(true);
                  } else {
                    setAuthInitialMode('admin');
                    setShowAuthModal(true);
                  }
                }}
                onOpenApkModal={() => setShowApkModal(true)}
                onSignOut={async () => {
                  await signOut(auth);
                  setCurrentUser(null);
                  setCurrentTab('home');
                }}
              />
            )}

            {/* Android APK Download & Install Modal */}
            {showApkModal && (
              <AndroidApkModal onClose={() => setShowApkModal(false)} />
            )}

            {/* Share Trip Link Toast */}
            {showShareToast && (
              <div className="absolute top-16 inset-x-4 z-50 p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 backdrop-blur-md text-white text-xs flex items-center gap-2.5 shadow-2xl animate-in slide-in-from-top duration-200">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block">Lien de suivi copié !</span>
                  <span className="text-[11px] text-emerald-300">
                    Partagez-le sur WhatsApp ou SMS avec vos proches à Kaolack.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fixed Ergonomic Bottom Tab Bar (Navigation Anchor) */}
        {userMode === 'passenger' && (
          <nav
            aria-label="Navigation principale"
            className="relative z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around select-none shrink-0"
          >
            {/* Tab 1: Course (Map) */}
            <button
              onClick={() => setCurrentTab('home')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all min-w-[56px] ${
                currentTab === 'home'
                  ? 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Car className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Course</span>
            </button>

            {/* Tab 2: Activité (History) */}
            <button
              onClick={() => setCurrentTab('activity')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all min-w-[56px] ${
                currentTab === 'activity'
                  ? 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Activité</span>
            </button>

            {/* Tab 3: Portefeuille (Wave & OM) */}
            <button
              onClick={() => setCurrentTab('wallet')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all min-w-[56px] ${
                currentTab === 'wallet'
                  ? 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Portefeuille</span>
            </button>

            {/* Tab 4: Sécurité */}
            <button
              onClick={() => setCurrentTab('safety')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all min-w-[56px] ${
                currentTab === 'safety'
                  ? 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Sécurité</span>
            </button>

            {/* Tab 5: Compte */}
            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all min-w-[56px] ${
                currentTab === 'profile'
                  ? 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Compte</span>
            </button>
          </nav>
        )}

        {/* Mobile Home Gesture Indicator */}
        <div className="relative z-40 w-full py-1 flex justify-center bg-slate-950 pointer-events-none shrink-0">
          <div className="w-32 h-1 bg-slate-700/80 rounded-full" />
        </div>
      </div>
    </div>
  );
}
