import { LocationPoint, RideCategory, PaymentMethod, Driver } from '../types/vtc';

// Generated assets
import driverAvatar from '../assets/images/driver_avatar_moussa_1790448805948.jpg';
import carConfortImg from '../assets/images/car_sama_confort_1790448816768.jpg';
import motoExpressImg from '../assets/images/moto_sama_express_1790448832020.jpg';

export const KAOLACK_LOCATIONS: LocationPoint[] = [
  {
    id: 'medina_baye',
    name: 'Médina Baye (Grande Mosquée)',
    address: 'Esplanade Cheikh Ibrahima Niass',
    neighborhood: 'Médina Baye',
    lat: 14.1610,
    lng: -16.0715,
    type: 'popular',
  },
  {
    id: 'marche_central',
    name: 'Marché Central de Kaolack',
    address: 'Avenue Valdiodio Ndiaye',
    neighborhood: 'Centre-Ville',
    lat: 14.1432,
    lng: -16.0754,
    type: 'popular',
  },
  {
    id: 'garage_nioro',
    name: 'Garage Nioro (Gare Routière Sud)',
    address: 'Route Nationale 4, sortie Nioro',
    neighborhood: 'Passoire / Nioro',
    lat: 14.1378,
    lng: -16.0820,
    type: 'station',
  },
  {
    id: 'garage_dakar_ndorong',
    name: 'Garage Dakar (Rond-Point Ndorong)',
    address: 'Route Nationale 1, entrée Kaolack',
    neighborhood: 'Ndorong',
    lat: 14.1652,
    lng: -16.0912,
    type: 'station',
  },
  {
    id: 'hopital_regional',
    name: 'Hôpital Régional El Hadji Ibrahima Niass',
    address: 'Boulevard El Hadji Ibrahima Niass',
    neighborhood: 'Léona Niassène',
    lat: 14.1485,
    lng: -16.0702,
    type: 'popular',
  },
  {
    id: 'universite_ussein',
    name: 'Université du Sine Saloum (USSEIN)',
    address: 'Route de Kahone / Kaffrine',
    neighborhood: 'Kahone / Campus USSEIN',
    lat: 14.1750,
    lng: -16.0620,
    type: 'popular',
  },
  {
    id: 'leona_niassene',
    name: 'Grande Mosquée Léona Niassène',
    address: 'Rue Serigne Babacar Niass',
    neighborhood: 'Léona',
    lat: 14.1520,
    lng: -16.0680,
    type: 'popular',
  },
  {
    id: 'gouvernance_place',
    name: 'Place de la Gouvernance / Mairie',
    address: 'Place de l’Indépendance de Kaolack',
    neighborhood: 'Plateau Kaolack',
    lat: 14.1410,
    lng: -16.0790,
    type: 'popular',
  },
  {
    id: 'port_fluvial_saloum',
    name: 'Port Fluvial de Kaolack (Bras du Saloum)',
    address: 'Quai de chargement maritime Saloum',
    neighborhood: 'Zone Portuaire',
    lat: 14.1340,
    lng: -16.0845,
    type: 'popular',
  },
  {
    id: 'boustane',
    name: 'Quartier Boustane',
    address: 'Boulevard de Boustane',
    neighborhood: 'Boustane',
    lat: 14.1670,
    lng: -16.0780,
    type: 'home',
  },
  {
    id: 'dialegne',
    name: 'Quartier Dialègne',
    address: 'Rue 14 x Dialègne',
    neighborhood: 'Dialègne',
    lat: 14.1510,
    lng: -16.0850,
    type: 'popular',
  },
  {
    id: 'kasnack',
    name: 'Quartier Kasnack',
    address: 'Avenue Cheikh Anta Diop Kaolack',
    neighborhood: 'Kasnack',
    lat: 14.1460,
    lng: -16.0910,
    type: 'popular',
  },
  {
    id: 'stade_lamine_gueye',
    name: 'Stade Lamine Guèye',
    address: 'Avenue de la République',
    neighborhood: 'Kundam',
    lat: 14.1490,
    lng: -16.0775,
    type: 'popular',
  },
  {
    id: 'kahone_cite',
    name: 'Kahone (Zone Historique & Saloum)',
    address: 'Route Nationale 1 Est',
    neighborhood: 'Kahone',
    lat: 14.1800,
    lng: -16.0350,
    type: 'popular',
  },
];

export const RIDE_CATEGORIES: RideCategory[] = [
  {
    id: 'eco',
    name: 'Sama Taxi Kaolack',
    tagline: 'Le taxi jaune-noir classique de Kaolack, 200F / 500m',
    basePrice: 600,
    perKmRate: 400, // 200 FCFA / 500m
    etaMinutes: 2,
    capacity: 4,
    image: carConfortImg,
    badge: 'Standard 200F/500m',
    features: ['200 FCFA par 500 mètres', 'Chauffeur local de Kaolack', 'Paiement Wave & OM instantané'],
  },
  {
    id: 'moto',
    name: 'Sama Moto Jakarta',
    tagline: 'L’incontournable moto-taxi de Kaolack, rapide pour le marché',
    basePrice: 400,
    perKmRate: 300, // 150 FCFA / 500m
    etaMinutes: 1,
    capacity: 1,
    image: motoExpressImg,
    badge: 'Jakarta Kaolack',
    features: ['Slalom rapide dans Kaolack', 'Casque de protection fourni', 'Tarif ultra abordable'],
  },
  {
    id: 'confort',
    name: 'Sama Confort Berline',
    tagline: 'Berline récente avec climatisation pour vos courses',
    basePrice: 1000,
    perKmRate: 500, // 250 FCFA / 500m
    etaMinutes: 4,
    capacity: 4,
    image: carConfortImg,
    badge: 'Climatisé',
    features: ['Climatisation forte garantie', 'Trajet Médina Baye & Hôpital', 'Chauffeur courtois'],
  },
  {
    id: 'climatise',
    name: 'Sama Interurbain / 7-Places',
    tagline: 'Trajets vers Nioro, Fatick, Guinguinéo ou Kaffrine',
    basePrice: 2000,
    perKmRate: 700, // 350 FCFA / 500m
    etaMinutes: 6,
    capacity: 6,
    image: carConfortImg,
    features: ['Sortie de Kaolack (RN1 & RN4)', 'Grand coffre pour bagages', 'Idéal familles'],
  },
  {
    id: 'express',
    name: 'Sama Express Colis Kaolack',
    tagline: 'Livraison de marchandises du Marché Central en 20 min',
    basePrice: 500,
    perKmRate: 360,
    etaMinutes: 3,
    capacity: 1,
    image: motoExpressImg,
    features: ['Enlèvement direct au Marché Central', 'Suivi GPS temps réel', 'Notification SMS au destinataire'],
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
    description: 'Validation par code OM (#144#391#)',
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
    color: '#E61E25',
    balance: 15000,
  },
];

export const MOCK_DRIVER: Driver = {
  id: 'drv_cheikh_kaolack',
  name: 'Cheikh Ndao',
  phone: '+221 77 412 80 95',
  rating: 4.97,
  totalTrips: 1420,
  carModel: 'Peugeot 301 (Taxi Jaune-Noir)',
  carColor: 'Jaune et Noir',
  licensePlate: 'KL-3829-B',
  photoUrl: driverAvatar,
  lat: 14.1520,
  lng: -16.0780,
  bearing: 45,
};

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg_1',
    sender: 'driver' as const,
    text: 'Salam alaykoum ! Je suis à côté du Rond-point Ndorong, j’arrive dans 2 minutes.',
    timestamp: '14:22',
  },
];

export const PRESET_CHAT_REPLIES = [
  "Je vous attends devant la Grande Mosquée",
  "Je suis à la porte 3 du Marché Central",
  "Prenez la rue à côté de la pharmacie",
  "J'arrive tout de suite (1 min)",
  "J'ai des bagages pour le coffre",
];

export const PAST_TRIPS = [
  {
    id: 'trp_kl_401',
    pickup: 'Marché Central de Kaolack',
    dropoff: 'Médina Baye (Grande Mosquée)',
    date: 'Aujourd’hui, 11:20',
    category: 'Sama Taxi Kaolack',
    fare: 1200, // 3 km = 6 x 500m = 1200 FCFA
    paymentMethod: 'Wave',
    rating: 5,
    status: 'Terminée',
  },
  {
    id: 'trp_kl_400',
    pickup: 'Garage Dakar (Ndorong)',
    dropoff: 'Hôpital Régional El Hadji Ibrahima Niass',
    date: 'Hier, 16:45',
    category: 'Sama Moto Jakarta',
    fare: 600,
    paymentMethod: 'Orange Money',
    rating: 5,
    status: 'Terminée',
  },
  {
    id: 'trp_kl_399',
    pickup: 'Quartier Boustane',
    dropoff: 'Garage Nioro (Sortie RN4)',
    date: '25 Septembre, 09:15',
    category: 'Sama Confort Berline',
    fare: 1800,
    paymentMethod: 'Espèces',
    rating: 5,
    status: 'Terminée',
  },
];

// For backward compatibility
export const DAKAR_LOCATIONS = KAOLACK_LOCATIONS;
