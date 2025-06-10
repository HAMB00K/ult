
import { auth } from '@/config/firebase-config';
import type { User as FirebaseUserType } from 'firebase/auth'; // Renamed to avoid naming conflict

// Interface for the user object we'll use in the app
export interface AppUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  getIdToken: () => Promise<string>;
}

// Gets the current Firebase user and maps it to AppUser interface.
export async function getCurrentUser(): Promise<AppUser | null> {
  const firebaseUser: FirebaseUserType | null = auth.currentUser;
  if (firebaseUser) {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      getIdToken: async () => firebaseUser.getIdToken(true), // Force refresh for fresh token
    };
  }
  return null;
}

// Gets the Firebase ID token for the current user.
export async function getUserIdToken(): Promise<string | null> {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    try {
      return await firebaseUser.getIdToken(true); // Force refresh
    } catch (error) {
      console.error("Error getting ID token:", error);
      return null;
    }
  }
  return null;
}

// Gets the UID of the current Firebase user.
export async function getCurrentUserId(): Promise<string | null> {
  return auth.currentUser ? auth.currentUser.uid : null;
}

// Listener for auth state changes
export function onAuthChange(callback: (user: AppUser | null) => void) {
  return auth.onAuthStateChanged(async (firebaseUser: FirebaseUserType | null) => {
    if (firebaseUser) {
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        getIdToken: async () => firebaseUser.getIdToken(true),
      });
    } else {
      callback(null);
    }
  });
}
