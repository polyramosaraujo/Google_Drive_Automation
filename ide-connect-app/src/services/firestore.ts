import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Cell, PrayerRequest } from '../types';

export async function findCellByInviteCode(inviteCode: string): Promise<Cell | null> {
  const q = query(
    collection(db, 'cells'),
    where('inviteCode', '==', inviteCode.trim().toUpperCase())
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  const data = docSnap.data();
  return { id: docSnap.id, name: data.name, inviteCode: data.inviteCode };
}

export async function createUserProfile(
  uid: string,
  name: string,
  email: string,
  cellId: string
) {
  await setDoc(doc(db, 'users', uid), {
    name,
    email,
    cellId,
    createdAt: Date.now(),
  });
}

export function subscribeToWeekRequests(
  cellId: string,
  weekKey: string,
  onChange: (requests: PrayerRequest[]) => void
) {
  const q = query(
    collection(db, 'cells', cellId, 'prayerRequests'),
    where('weekKey', '==', weekKey),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const requests = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        text: data.text,
        authorId: data.authorId,
        authorName: data.authorName,
        weekKey: data.weekKey,
        createdAt: data.createdAt,
        prayedCount: data.prayedCount ?? 0,
      } as PrayerRequest;
    });
    onChange(requests);
  });
}

export async function addPrayerRequest(
  cellId: string,
  text: string,
  authorId: string,
  authorName: string,
  weekKey: string
) {
  await addDoc(collection(db, 'cells', cellId, 'prayerRequests'), {
    text: text.trim(),
    authorId,
    authorName,
    weekKey,
    createdAt: Date.now(),
    prayedCount: 0,
    createdAtServer: serverTimestamp(),
  });
}

export function subscribeToPrayedByMe(
  cellId: string,
  requestId: string,
  uid: string,
  onChange: (prayed: boolean) => void
) {
  return onSnapshot(doc(db, 'cells', cellId, 'prayerRequests', requestId, 'prayedBy', uid), (snap) => {
    onChange(snap.exists());
  });
}

export async function togglePrayed(
  cellId: string,
  requestId: string,
  uid: string,
  currentlyPrayed: boolean
) {
  const prayedRef = doc(db, 'cells', cellId, 'prayerRequests', requestId, 'prayedBy', uid);
  const requestRef = doc(db, 'cells', cellId, 'prayerRequests', requestId);

  if (currentlyPrayed) {
    await deleteDoc(prayedRef);
    await setDoc(requestRef, { prayedCount: increment(-1) }, { merge: true });
  } else {
    await setDoc(prayedRef, { prayedAt: Date.now() });
    await setDoc(requestRef, { prayedCount: increment(1) }, { merge: true });
  }
}

export async function savePushToken(uid: string, pushToken: string) {
  await setDoc(doc(db, 'users', uid), { pushToken }, { merge: true });
}
