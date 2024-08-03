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

const Onboarding = ({session}: {session: string}) => {
  const [dog, setDog] = useAtom(dogAtom);
  const [draftDog, setDraftDog] = useAtom(dogDraftAtom);
  const [isLoading, setLoading] = useState(true);
  const userSessionId = useUserSession(session);

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
