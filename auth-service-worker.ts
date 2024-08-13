export type {};
declare const self: any;

import {initializeApp} from "firebase/app";
import {getAuth, getIdToken, onIdTokenChanged} from "firebase/auth";
import {firebaseConfig} from "./lib/firebase/config";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentIdToken = (async () => {
  await auth.authStateReady();
  setTimeout(() => {
    onIdTokenChanged(auth, (user) => {
      if (user) {
        currentIdToken = getIdToken(user);
      } else {
        currentIdToken = Promise.resolve(null);
      }
    });
  }, 0);
  return auth.currentUser && (await getIdToken(auth.currentUser));
})();

const fetchWithFirebaseHeaders = async (event: any) => {
  const headers = new Headers(event.request.headers);
  const idToken = await currentIdToken;
  if (idToken) headers.append("Authorization", `Bearer ${idToken}`);
  if (auth.currentUser) headers.append("user_session", auth.currentUser.uid);
  const newRequest = new Request(event.request, {headers});
  return await fetch(newRequest);
};

self.addEventListener("fetch", (event: any) => {
  const url = new URL(event.request.url);
  if (self.location.origin !== url.origin) return;
  if (url.pathname.startsWith("/_next/")) return;
  // TODO ignore other static resources
  event.respondWith(fetchWithFirebaseHeaders(event));
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});
