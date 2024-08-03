"use client";

import {useEffect, useState} from "react";
import {onAuthStateChanged} from "../lib/firebase/auth";
import {useSetAtom} from "jotai";
import {dogAtom} from "@/atoms/dogAtom";
import {RESET} from "jotai/utils";

export default function useUserSession(InitSession: string | null) {
  const [userUid, setUserUid] = useState<string | null>(InitSession);
  const setDog = useSetAtom(dogAtom);

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
