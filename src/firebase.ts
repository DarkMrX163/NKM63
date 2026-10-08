import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Connection test as required by skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or starting up.');
    }
    return false;
  }
}

// Anonymous auth helper so writes are authenticated
export async function ensureAuth() {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
    return auth.currentUser;
  } catch (err) {
    console.warn('Anonymous auth note:', err);
    return null;
  }
}

export interface LeaderboardRecord {
  id?: string;
  playerName: string;
  playerLocation?: string;
  avatar?: string;
  score: number;
  level: 'easy' | 'medium' | 'hard' | 'mixed';
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  createdAt: string;
}

// Fetch top leaderboard entries
export async function fetchLeaderboard(limitCount = 50): Promise<LeaderboardRecord[]> {
  const path = 'leaderboard';
  try {
    const q = query(collection(db, path), orderBy('score', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    const records: LeaderboardRecord[] = [];
    snapshot.forEach((docSnap) => {
      records.push({ id: docSnap.id, ...(docSnap.data() as Omit<LeaderboardRecord, 'id'>) });
    });
    return records;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
}

// Submit a new record
export async function submitScore(record: Omit<LeaderboardRecord, 'id'>): Promise<string | null> {
  const path = 'leaderboard';
  try {
    await ensureAuth();
    const docRef = await addDoc(collection(db, path), record);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return null;
  }
}
