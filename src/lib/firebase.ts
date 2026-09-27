import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with configured databaseId
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test connection check
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Client hors ligne Firestore ou configuration réseau.");
    }
  }
}

// User Profile interface
export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  role: 'passenger' | 'driver' | 'admin';
  walletBalance: number;
  createdAt: string;
  driverApplicationStatus?: 'pending' | 'approved' | 'rejected' | 'none';
}

// Sync or fetch App User
export async function syncUserInFirestore(user: FirebaseUser, roleOverride?: 'passenger' | 'driver' | 'admin'): Promise<AppUser> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as AppUser;
      if (roleOverride && data.role !== roleOverride) {
        await updateDoc(userRef, { role: roleOverride });
        return { ...data, role: roleOverride };
      }
      return data;
    } else {
      // Determine initial role: if email is admin@samataxi.sn or adminOverride
      const initialRole = roleOverride || (user.email === 'admin@samataxi.sn' ? 'admin' : 'passenger');
      const newUser: AppUser = {
        uid: user.uid,
        email: user.email || 'user@samataxi.sn',
        displayName: user.displayName || user.email?.split('@')[0] || 'Passager Dakar',
        photoURL: user.photoURL || undefined,
        phone: user.phoneNumber || '+221 77 000 00 00',
        role: initialRole,
        walletBalance: 15000,
        createdAt: new Date().toISOString(),
        driverApplicationStatus: 'none',
      };
      await setDoc(userRef, newUser);
      return newUser;
    }
  } catch (err) {
    console.error('Erreur synchronisation profil Firestore:', err);
    // Fallback in-memory
    return {
      uid: user.uid,
      email: user.email || 'user@samataxi.sn',
      displayName: user.displayName || 'Utilisateur Sama',
      role: roleOverride || (user.email === 'admin@samataxi.sn' ? 'admin' : 'passenger'),
      walletBalance: 15000,
      createdAt: new Date().toISOString(),
      driverApplicationStatus: 'none',
    };
  }
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
};
