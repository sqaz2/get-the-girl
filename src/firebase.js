import { initializeApp, getApps } from 'firebase/app'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  enableIndexedDbPersistence,
} from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let appInstance
let dbInstance
let authInstance

export function isFirebaseConfigured() {
  return Object.values(firebaseConfig).every((value) => typeof value === 'string' && value.length)
}

export async function initFirebase() {
  if (!isFirebaseConfigured()) {
    return null
  }
  if (!getApps().length) {
    appInstance = initializeApp(firebaseConfig)
    dbInstance = getFirestore(appInstance)
    authInstance = getAuth(appInstance)
    try {
      await enableIndexedDbPersistence(dbInstance)
    } catch (error) {
      console.warn('Offline persistence unavailable', error.message)
    }
  } else if (!appInstance) {
    appInstance = getApps()[0]
    dbInstance = getFirestore(appInstance)
    authInstance = getAuth(appInstance)
  }
  return { app: appInstance, db: dbInstance, auth: authInstance }
}

export async function ensureAnonymousUser() {
  const instance = await initFirebase()
  if (!instance) return null
  const { auth } = instance
  if (auth.currentUser) return auth.currentUser
  await signInAnonymously(auth)
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          unsub()
          resolve(user)
        }
      },
      (error) => {
        unsub()
        reject(error)
      },
    )
  })
}

export async function ensureUserProfile(uid) {
  const { db } = await initFirebase()
  if (!db) return null
  const ref = doc(db, 'users', uid)
  const snapshot = await getDoc(ref)
  if (!snapshot.exists()) {
    await setDoc(ref, {
      uid,
      createdAt: serverTimestamp(),
      mbti: 'ENTP',
      enneagramPrimary: '4',
      enneagramSecondary: '8',
    })
  }
  return getDoc(ref)
}

export async function fetchCollectionDocs(path) {
  const { db } = await initFirebase()
  if (!db) return []
  const snapshot = await getDocs(collection(db, path))
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
}

export async function fetchUserBundle(uid) {
  const { db } = await initFirebase()
  if (!db) return { intake: null, drafts: [], reflections: [], starters: [] }
  const [intakeSnap, starterDocs, draftDocs, reflectionDocs] = await Promise.all([
    getDoc(doc(db, 'intake', uid)),
    getDocs(collection(db, 'prompts', uid, 'starters')),
    getDocs(collection(db, 'drafts', uid, 'items')),
    getDocs(collection(db, 'reflections', uid, 'items')),
  ])

  return {
    intake: intakeSnap.exists() ? intakeSnap.data() : null,
    starters: starterDocs.docs.map((snap) => ({ id: snap.id, ...snap.data() })),
    drafts: draftDocs.docs.map((snap) => ({ id: snap.id, ...snap.data() })),
    reflections: reflectionDocs.docs.map((snap) => ({ id: snap.id, ...snap.data() })),
  }
}

function timestampedPayload(data, uid) {
  const now = Date.now()
  return {
    ...data,
    uid,
    updatedAt: now,
    createdAt: data.createdAt || now,
    serverUpdatedAt: serverTimestamp(),
  }
}

export async function saveIntake(uid, intake) {
  const { db } = await initFirebase()
  if (!db) return null
  const payload = {
    ...intake,
    uid,
    updatedAt: Date.now(),
    serverUpdatedAt: serverTimestamp(),
  }
  await setDoc(doc(db, 'intake', uid), payload, { merge: true })
  return payload
}

export async function saveDraft(uid, draft) {
  const { db } = await initFirebase()
  if (!db) return null
  const payload = timestampedPayload(draft, uid)
  const collectionRef = collection(db, 'drafts', uid, 'items')
  if (draft.id) {
    await setDoc(doc(collectionRef, draft.id), payload, { merge: true })
    return { ...payload, id: draft.id }
  }
  const docRef = await addDoc(collectionRef, payload)
  return { ...payload, id: docRef.id }
}

export async function deleteDraft(uid, draftId) {
  const { db } = await initFirebase()
  if (!db) return null
  return deleteDoc(doc(db, 'drafts', uid, 'items', draftId))
}

export async function saveReflection(uid, reflection) {
  const { db } = await initFirebase()
  if (!db) return null
  const payload = timestampedPayload(reflection, uid)
  const collectionRef = collection(db, 'reflections', uid, 'items')
  if (reflection.id) {
    await setDoc(doc(collectionRef, reflection.id), payload, { merge: true })
    return { ...payload, id: reflection.id }
  }
  const docRef = await addDoc(collectionRef, payload)
  return { ...payload, id: docRef.id }
}

export async function saveStarter(uid, starter) {
  const { db } = await initFirebase()
  if (!db) return null
  const payload = timestampedPayload(starter, uid)
  const collectionRef = collection(db, 'prompts', uid, 'starters')
  if (starter.id) {
    await setDoc(doc(collectionRef, starter.id), payload, { merge: true })
    return { ...payload, id: starter.id }
  }
  const docRef = await addDoc(collectionRef, payload)
  return { ...payload, id: docRef.id }
}
