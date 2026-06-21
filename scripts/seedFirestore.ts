/**
 * One-time seed script — populates the Firestore "products" collection
 * from constants.tsx's INITIAL_PRODUCTS.
 *
 * Run once with:  npx tsx scripts/seedFirestore.ts
 * (or: node --loader ts-node/esm scripts/seedFirestore.ts)
 *
 * Safe to delete after running successfully.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { INITIAL_PRODUCTS } from '../constants';
import dotenv from 'dotenv';
import path from 'path';
import readline from 'readline';

// Explicitly load .env.local from the project root.
// (dotenv/config only auto-loads a file literally named ".env" — Vite projects use ".env.local",
// so that file was never being read, leaving every config value undefined.)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Fail fast with a clear message instead of a cryptic Firestore gRPC error
const missing = Object.entries(firebaseConfig).filter(([, v]) => !v).map(([k]) => k);
if (missing.length > 0) {
  console.error('Missing Firebase config values:', missing.join(', '));
  console.error('Make sure .env.local exists in the project root and contains the matching VITE_FIREBASE_* keys.');
  console.error('Current working directory:', process.cwd());
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const ADMIN_EMAIL = 'nimrahshahid744@gmail.com';

// Prompts for the admin password in the terminal without printing it as you type
function promptPassword(query: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    // @ts-ignore - _writeToOutput is an internal readline API used here to mask input
    rl._writeToOutput = (str: string) => {
      if (str.includes('\n')) (rl as any).output.write('\n');
    };
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function seed() {
  // Must be signed in as the admin account for Firestore security rules to allow writes
  const password = await promptPassword(`Enter password for ${ADMIN_EMAIL}: `);
  try {
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
    console.log('\nSigned in as admin.');
  } catch (err) {
    console.error('\nAdmin sign-in failed:', err);
    process.exit(1);
  }

  const productsRef = collection(db, 'products');

  // Safety check: don't double-seed if products already exist
  const existing = await getDocs(productsRef);
  if (!existing.empty) {
    console.log(`Firestore "products" already has ${existing.size} document(s). Aborting to avoid duplicates.`);
    console.log('Delete the existing documents first (or the whole collection) if you want to re-seed.');
    return;
  }

  console.log(`Seeding ${INITIAL_PRODUCTS.length} products...`);

  for (const product of INITIAL_PRODUCTS) {
    // Drop the hardcoded "id" field — let Firestore generate its own document ID
    const { id, ...data } = product as any;
    const docRef = await addDoc(productsRef, data);
    console.log(`  ✓ ${data.name} -> ${docRef.id}`);
  }

  console.log('Done. Seeded all products into Firestore.');
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => process.exit(0));