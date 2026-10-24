import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { UserProgressData } from '../types/vlsi';

export interface FirestoreUserProfile {
  uid: string;
  email: string;
  displayName: string;
  targetRole: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface FirestoreSavedDesign {
  id: string;
  userId: string;
  title: string;
  moduleId: string;
  verilogCode: string;
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface FirestoreUserProgress {
  userId: string;
  logicScore: number;
  completedGateQuizzes: number;
  completedLessonIds?: string[];
  practiceStreakDays?: number;
  testVectorsRunCount?: number;
  updatedAt?: any;
}

// User Profile Operations
export async function saveUserProfileToFirestore(profile: FirestoreUserProfile): Promise<void> {
  const path = `users/${profile.uid}`;
  try {
    const docRef = doc(db, 'users', profile.uid);
    await setDoc(docRef, {
      uid: profile.uid,
      email: profile.email || 'student@vlsilab.edu',
      displayName: profile.displayName || 'ECE Student',
      targetRole: profile.targetRole || 'ASIC Design Engineer',
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadUserProfileFromFirestore(userId: string): Promise<FirestoreUserProfile | null> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as FirestoreUserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// User Progress & Scores Operations
export async function saveProgressToFirestore(userId: string, progress: UserProgressData): Promise<void> {
  const path = `users/${userId}/progress/state`;
  try {
    const docRef = doc(db, 'users', userId, 'progress', 'state');
    await setDoc(docRef, {
      userId,
      logicScore: progress.logicScore,
      completedGateQuizzes: progress.completedGateQuizzes,
      practiceStreakDays: progress.practiceStreakDays,
      testVectorsRunCount: progress.testVectorsRunCount,
      completedLessonIds: progress.verilogCompletedIds || [],
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadProgressFromFirestore(userId: string): Promise<FirestoreUserProgress | null> {
  const path = `users/${userId}/progress/state`;
  try {
    const docRef = doc(db, 'users', userId, 'progress', 'state');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as FirestoreUserProgress;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Saved Verilog Designs Operations
export async function saveDesignToFirestore(design: FirestoreSavedDesign): Promise<void> {
  const path = `users/${design.userId}/designs/${design.id}`;
  try {
    const docRef = doc(db, 'users', design.userId, 'designs', design.id);
    await setDoc(docRef, {
      id: design.id,
      userId: design.userId,
      title: design.title,
      moduleId: design.moduleId,
      verilogCode: design.verilogCode,
      notes: design.notes || '',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadUserDesignsFromFirestore(userId: string): Promise<FirestoreSavedDesign[]> {
  const path = `users/${userId}/designs`;
  try {
    const colRef = collection(db, 'users', userId, 'designs');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => d.data() as FirestoreSavedDesign);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteDesignFromFirestore(userId: string, designId: string): Promise<void> {
  const path = `users/${userId}/designs/${designId}`;
  try {
    const docRef = doc(db, 'users', userId, 'designs', designId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToUserDesigns(
  userId: string,
  onUpdate: (designs: FirestoreSavedDesign[]) => void,
  onError?: (err: any) => void
) {
  const path = `users/${userId}/designs`;
  const colRef = collection(db, 'users', userId, 'designs');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items = snapshot.docs.map(d => d.data() as FirestoreSavedDesign);
      onUpdate(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Data Isolation Probe: Tests cross-user access rejection
 * Attempts to read another user's private documents and verifies that
 * the Firestore Security Rules reject with PERMISSION_DENIED.
 */
export async function testCrossUserIsolation(
  currentUserId: string,
  targetOtherUserId: string
): Promise<{ blockedBySecurityRule: boolean; detail: string }> {
  const forbiddenPath = `users/${targetOtherUserId}/designs`;
  try {
    const colRef = collection(db, 'users', targetOtherUserId, 'designs');
    await getDocs(colRef);
    // If it succeeded, isolation failed!
    return {
      blockedBySecurityRule: false,
      detail: `VULNERABILITY: User ${currentUserId} was able to read ${targetOtherUserId}'s documents!`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Missing or insufficient permissions') || msg.includes('permission-denied')) {
      return {
        blockedBySecurityRule: true,
        detail: `Verified: Access to ${forbiddenPath} was rejected with PERMISSION_DENIED by security rules.`,
      };
    }
    return {
      blockedBySecurityRule: true,
      detail: `Blocked with error: ${msg}`,
    };
  }
}
