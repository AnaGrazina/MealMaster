// ===== Firebase core =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// ---- Config do teu projeto ---
const firebaseConfig = {
  apiKey: "AIzaSyCSGqGbxhBXtITLpvd5M6mi-nuc5zlcGKw",
  authDomain: "mealmaster-1a82d.firebaseapp.com",
  projectId: "mealmaster-1a82d",
  storageBucket: "mealmaster-1a82d.firebasestorage.app",
  messagingSenderId: "540763054313",
  appId: "1:540763054313:web:6fa1c74a3ee1ac03d09078",
  measurementId: "G-VRG6GHHK8K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

// ===== Helpers de paths =====
const userDoc     = (uid)       => doc(db, "users", uid);
const recipesCol  = (uid)       => collection(db, "users", uid, "recipes");
const recipeDoc   = (uid, id)   => doc(db, "users", uid, "recipes", id);
const legacyMetaDoc = (uid, n)  => doc(db, "users", uid, "meta", n);

// ===== Auth =====
export async function loginEmail(email, pass){
  try{
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  }catch(err){
    if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      return cred.user;
    }
    throw err;
  }
}
export function logout(){ return signOut(auth); }

// ===== Receitas =====
export async function getAllRecipes(uid){
  if (!uid) return [];
  const snap = await getDocs(recipesCol(uid));
  const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  return arr.map(r => {
    const rawTags = r.tags ?? [];
    const tags = Array.isArray(rawTags)
      ? rawTags
      : String(rawTags).split(",").map(t=>t.trim()).filter(Boolean);

    return {
      id: r.id ?? null,
      titulo: r.titulo || r.title || "Sem título",
      img: r.img || r.image || "",
      tipo: r.tipo || "almoco",
      tags,
      ingredientes: r.ingredientes || "",
      passos: r.passos || ""
    };
  });
}

/** Cria/atualiza uma receita (merge). Espera {id?, titulo, tipo, tags[], img, ingredientes, passos} */
export async function saveRecipe(uid, receita){
  if (!uid) throw new Error("Sem UID");
  if (!receita) throw new Error("Sem dados da receita");

  const id = receita.id || (crypto?.randomUUID?.() ? crypto.randomUUID() : String(Date.now()));
  const data = {
    titulo: (receita.titulo || receita.title || "Sem título").trim(),
    tipo: receita.tipo || "almoco",
    tags: Array.isArray(receita.tags)
      ? receita.tags
      : String(receita.tags || "").split(",").map(t=>t.trim()).filter(Boolean),
    img: (receita.img || "").trim(),
    ingredientes: (receita.ingredientes || "").trim(),
    passos: (receita.passos || "").trim()
  };

  try{
    await setDoc(recipeDoc(uid, id), data, { merge: true });
    return { id, ...data };
  }catch(e){
    console.error("Falhou a gravação da receita:", e);
    throw e;
  }
}

/** Apaga uma receita pelo id */
export async function deleteRecipe(uid, id){
  if (!uid) throw new Error("Sem UID");
  if (!id) throw new Error("Sem ID da receita");
  try{
    await deleteDoc(recipeDoc(uid, id));
  }catch(e){
    console.error("Falhou a remoção da receita:", e);
    throw e;
  }
}

// ===== Plano semanal =====
export async function getPlan(uid){
  if (!uid) return {};
  const snap = await getDoc(userDoc(uid));
  if (snap.exists() && snap.data()?.plan && typeof snap.data().plan === "object") {
    return snap.data().plan;
  }
  const legacy = await getDoc(legacyMetaDoc(uid, "plan"));
  return legacy.exists() ? (legacy.data().plan || {}) : {};
}

export async function setPlan(uid, plan){
  if (!uid) throw new Error("Sem UID");
  try {
    await setDoc(userDoc(uid), { plan: plan || {} }, { merge: true });
  } catch (e) {
    console.warn("Falhou users/{uid}.plan; a gravar em legacy meta/plan", e);
    await setDoc(legacyMetaDoc(uid, "plan"), { plan: plan || {} }, { merge: true });
  }
}

// ===== Lista de compras =====
export async function getShoppingList(uid){
  if (!uid) return [];
  const snap = await getDoc(userDoc(uid));
  let arr = [];
  if (snap.exists() && Array.isArray(snap.data()?.shoppingList)) {
    arr = snap.data().shoppingList;
  } else {
    const legacy = await getDoc(legacyMetaDoc(uid, "shoppingList"));
    arr = legacy.exists() ? (legacy.data().items || []) : [];
  }
  return (arr || []).map(i => ({
    nome: i?.nome || "",
    quantidade: i?.quantidade || "",
    comprado: !!i?.comprado,
    src: i?.src || "menu",
    key: i?.key ?? null
  }));
}

export async function setShoppingList(uid, items){
  if (!uid) throw new Error("Sem UID");
  if (!Array.isArray(items)) throw new Error("Lista tem de ser array");
  try {
    await setDoc(userDoc(uid), { shoppingList: items }, { merge: true });
  } catch (e) {
    console.warn("Falhou users/{uid}.shoppingList; a gravar em legacy meta/shoppingList", e);
    await setDoc(legacyMetaDoc(uid, "shoppingList"), { items }, { merge: true });
  }
}
