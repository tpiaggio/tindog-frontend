"use client";

import {useEffect, useState} from "react";
import {onAuthStateChanged} from "../lib/firebase/auth";
import {useSetAtom} from "jotai";
import {dogAtom} from "@/atoms/dogAtom";
import {RESET} from "jotai/utils";
import {firebaseConfig} from "@/lib/firebase/config";

export default function useUserSession(InitSession: string | null) {
  const [userUid, setUserUid] = useState<string | null>(InitSession);
  const setDog = useSetAtom(dogAtom);

  // Register the service worker that sends auth state back to server
  // The service worker is built with npm run build-service-worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig)
      );
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;

      navigator.serviceWorker
        .register(serviceWorkerUrl)
        .then((registration) => console.log("scope is: ", registration.scope));
    }
  }, []);

  // Listen for changes to the user session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUserUid(authUser.uid);
      } else {
        setUserUid(null);
        setDog(RESET);
      }
    });

    return () => unsubscribe();
  }, []);

  return userUid;
}
