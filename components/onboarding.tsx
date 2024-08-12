"use client";

import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import {dogDraftAtom} from "@/atoms/dogDraftAtom";
import {dogAtom} from "@/atoms/dogAtom";
import ImageUpload from "@/components/image-upload";
import useUserSession from "@/hooks/useUserSession";
import DogForm from "./dog-form";
import {getCurrentDog} from "@/lib/firebase/firestore";
import {RESET} from "jotai/utils";
import {SESSION_COOKIE_NAME} from "@/constants";
import {getCookie} from "cookies-next";

const Onboarding = ({session}: {session: string | undefined}) => {
  const [dog, setDog] = useAtom(dogAtom);
  const [draftDog, setDraftDog] = useAtom(dogDraftAtom);
  const [isLoading, setLoading] = useState(true);

  const initSession = session || getCookie(SESSION_COOKIE_NAME) || null;
  const userSessionId = useUserSession(initSession);

  useEffect(() => {
    getCurrentDog(userSessionId)
      .then((data) => {
        if (data) {
          setDog(data);
          setDraftDog(RESET);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (!userSessionId) return null;
  if (isLoading) return null;
  if (!dog.id)
    return draftDog.id ? <DogForm userId={userSessionId} /> : <ImageUpload />;

  return null;
};

export default Onboarding;
