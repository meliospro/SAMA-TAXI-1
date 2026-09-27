import { LocationPoint, RideCategory, PaymentMethod, Driver } from '../types/vtc';

// Generated assets
import driverAvatar from '../assets/images/driver_avatar_moussa_1790448805948.jpg';
import carConfortImg from '../assets/images/car_sama_confort_1790448816768.jpg';
import motoExpressImg from '../assets/images/moto_sama_express_1790448832020.jpg';

export const DAKAR_LOCATIONS: LocationPoint[] = [
  {
    id: 'sea_plaza',
    name: 'Sea Plaza Dakar',
    address: 'Place du Souvenir, Corniche Ouest',
    neighborhood: 'Fann Résidence',
    lat: 14.6942,
    lng: -17.4721,
    type: 'popular',
  },
  {
    id: 'almadies_plage',
    name: 'Plage des Almadies',
    address: 'Route des Almadies, près de la Pointe',
    neighborhood: 'Almadies',
    lat: 14.7431,
    lng: -17.5284,
    type: 'popular',
  },
  {
    id: 'plateau_independance',
    name: "Place de l'Indépendance",
    address: 'Avenue Léopold Sédar Senghor',
    neighborhood: 'Dakar Plateau',
    lat: 14.6688,
    lng: -17.4332,
    type: 'popular',
  },
  {
    id: 'aibd_airport',
    name: 'Aéroport International Blaise Diagne (AIBD)',
    address: 'Autoroute de l’Avenir, Diass',
    neighborhood: 'Diass / AIBD',
    lat: 14.6711,
    lng: -17.0733,
    type: 'airport',
  },
  {
    id: 'renaissance_monument',
    name: 'Monument de la Renaissance Africaine',
    address: 'Colline des Mamelles',
    neighborhood: 'Ouakam',
    lat: 14.7222,
    lng: -17.4947,
    type: 'popular',
  },
  {
    id: 'ngor_embarcadere',
    name: 'Embarcadère Île de Ngor',
    address: 'Village de Ngor, Corniche des Almadies',
    neighborhood: 'Ngor',
    lat: 14.7554,
    lng: -17.5147,
    type: 'popular',
  },
  {
    id: 'ucad_dakar',
    name: 'Université Cheikh Anta Diop (UCAD)',
    address: 'Avenue Cheikh Anta Diop',
    neighborhood: 'Fann Point E',
    lat: 14.6917,
    lng: -17.4645,
    type: 'popular',
  },
  {
    id: 'mermoz_poste',
    name: 'Mermoz - Ancienne Piste',
    address: 'Avenue Cheikh Anta Diop prolongée',
    neighborhood: 'Mermoz',
    lat: 14.7103,
    lng: -17.4789,
    type: 'popular',
  },
  {
    id: 'goree_ferry',
    name: 'Gare Maritime de Gorée',
    address: 'Port Autonome de Dakar, Boulevard de la Libération',
    neighborhood: 'Plateau',
    lat: 14.6763,
    lng: -17.4278,
    type: 'station',
  },
  {
    id: 'parcelles_assainies',
    name: 'Parcelles Assainies Unité 15',
    address: 'Terminus Dém Dikk, Route des Parcelles',
    neighborhood: 'Parcelles Assainies',
    lat: 14.7612,
    lng: -17.4419,
    type: 'popular',
  },
  {
    id: 'diamniadio_cite',
    name: 'Cité Ministérielle Diamniadio',
    address: 'Pôle Urbain de Diamniadio',
    neighborhood: 'Diamniadio',
    lat: 14.7214,
    lng: -17.1821,
    type: 'popular',
  },
  {
    id: 'home_point_e',
    name: 'Maison (Point E)',
    address: 'Rue de Louga x Boulevard de l’Est',
    neighborhood: 'Point E',
    lat: 14.6989,
    lng: -17.4589,
    type: 'home',
  },
  {
    id: 'work_plateau',
    name: 'Bureau (Tour Rokhaya)',
    address: 'Rue Wagane Diouf, Immeuble Kébé',
    neighborhood: 'Plateau',
    lat: 14.6719,
    lng: -17.4354,
    type: 'work',
  }
];

export const RIDE_CATEGORIES: RideCategory[] = [
  {
    id: 'eco',
    name: 'Sama Eco',
    tagline: 'Économique, rapide & climatisé',
    basePrice: 1200,
    perKmRate: 220,
    etaMinutes: 2,
    capacity: 4,
    image: carConfortImg,
    badge: 'Populaire',
    features: ['Climatisation garantie', 'Paiement Wave/OM direct', 'Prix fixe garanti'],
  },
  {
    id: 'confort',
    name: 'Sama Confort',
    tagline: 'Berlines récentes & chauffeurs 5 étoiles',
    basePrice: 1900,
    perKmRate: 310,
    etaMinutes: 4,
    capacity: 4,
    image: carConfortImg,
    badge: 'Top Confort',
    features: ['Berline premium récente', 'Chauffeur d’élite certifié', 'Bouteille d’eau offerte', 'Chargeur téléphone'],
  },
  {
    id: 'moto',
    name: 'Sama Moto',
    tagline: 'Évitez les bouchons de Dakar en toute sécurité',
    basePrice: 650,
    perKmRate: 140,
    etaMinutes: 1,
    capacity: 1,
    image: motoExpressImg,
    badge: 'Ultra Rapide',
    features: ['Casque nettoyé fourni', 'Trajet 2x plus rapide aux heures de pointe', 'Gilet de sécurité'],
  },
  {
    id: 'climatise',
    name: 'Sama XL / VIP',
    tagline: 'SUV spacieux, parfait pour bagages & AIBD',
    basePrice: 3200,
    perKmRate: 480,
    etaMinutes: 6,
    capacity: 6,
    image: carConfortImg,
    features: ['Grand coffre bagages AIBD', 'Espace 6 places assises', 'Idéal familles et délégations'],
  },
  {
    id: 'express',
    name: 'Sama Express',
    tagline: 'Livraison de plis & colis express en 30 min',
    basePrice: 900,
    perKmRate: 180,
    etaMinutes: 3,
    capacity: 1,
    image: motoExpressImg,
    features: ['Suivi du colis en direct par le destinataire', 'Code de remise sécurisé', 'Jusqu’à 15 kg'],
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'wave',
    name: 'Wave',
    iconName: 'wave',
    description: 'Paiement instantané sans frais',
    color: '#1BA7FE',
  },
  {
    id: 'orange_money',
    name: 'Orange Money',
    iconName: 'orange',
    description: 'Validation par code secret OM',
    color: '#FF6600',
  },
  {
    id: 'cash',
    name: 'Espèces',
    iconName: 'cash',
    description: 'Règlement au chauffeur à l’arrivée',
    color: '#10B981',
  },
  {
    id: 'wallet',
    name: 'Sama Portefeuille',
    iconName: 'wallet',
    description: 'Solde prépayé avec 5% de réduction',
    color: '#FDB813',
    balance: 14500,
  },
];

export const MOCK_DRIVER: Driver = {
  id: 'drv_moussa_diop',
  name: 'Moussa Diop',
  phone: '+221 77 642 19 88',
  rating: 4.96,
  totalTrips: 1840,
  carModel: 'Toyota Corolla Berline',
  carColor: 'Gris Métallisé',
  licensePlate: 'DK-4921-BA',
  photoUrl: driverAvatar,
  lat: 14.6975,
  lng: -17.4695,
  bearing: 42,
};

export const NEARBY_DRIVERS = [
  { id: 'car_1', type: 'car', lat: 14.6962, lng: -17.4715, bearing: 85 },
  { id: 'car_2', type: 'car', lat: 14.6925, lng: -17.4740, bearing: 210 },
  { id: 'moto_1', type: 'moto', lat: 14.6950, lng: -17.4680, bearing: 330 },
  { id: 'car_3', type: 'car', lat: 14.6990, lng: -17.4660, bearing: 140 },
  { id: 'car_4', type: 'car', lat: 14.6890, lng: -17.4705, bearing: 15 },
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg_1',
    sender: 'driver' as const,
    text: 'Salam alaykoum ! Je suis en route, j’arrive dans 2 minutes.',
    timestamp: '14:22',
  },
];

export const PRESET_CHAT_REPLIES = [
  "Je suis devant le portail d'entrée",
  "Je vous attends sur le trottoir",
  "Prenez la rue juste après la pharmacie",
  "J'arrive tout de suite (1 min)",
  "J'ai un sac de voyage dans le coffre",
];

export const PAST_TRIPS = [
  {
    id: 'trp_dk_982',
    pickup: 'Sea Plaza, Corniche Ouest',
    dropoff: 'Plage des Almadies',
    date: 'Aujourd’hui, 11:45',
    category: 'Sama Confort',
    fare: 2400,
    paymentMethod: 'Wave',
    rating: 5,
    status: 'Terminée',
  },
  {
    id: 'trp_dk_981',
    pickup: 'Maison (Point E)',
    dropoff: 'Aéroport Blaise Diagne (AIBD)',
    date: 'Hier, 16:30',
    category: 'Sama XL / VIP',
    fare: 15500,
    paymentMethod: 'Orange Money',
    rating: 5,
    status: 'Terminée',
  },
  {
    id: 'trp_dk_980',
    pickup: 'Plateau - Place de l’Indépendance',
    dropoff: 'Mermoz Ancienne Piste',
    date: '24 Septembre, 19:15',
    category: 'Sama Moto',
    fare: 950,
    paymentMethod: 'Espèces',
    rating: 5,
    status: 'Terminée',
  },
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_welcome',
    title: 'Bienvenue sur Sama Taxi Dakar !',
    body: 'Votre trajet, notre priorité. Profitez de 500 FCFA offerts avec le code promo TERANGA.',
    type: 'system' as const,
    timestamp: '10:00',
    read: false,
  },
  {
    id: 'notif_past_arrived',
    title: 'Votre chauffeur était arrivé',
    body: 'Moussa Diop vous attendait à Sea Plaza (Toyota Corolla DK-4921-BA).',
    type: 'driver_arrived' as const,
    timestamp: '11:43',
    read: true,
  },
];
