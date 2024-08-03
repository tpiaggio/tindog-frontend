import {atomWithStorage} from "jotai/utils";
import {Dog} from "@/lib/firebase/firestore";

interface DogDraft extends Partial<Dog> {}

export const dogDraftAtom = atomWithStorage<DogDraft>(
  "dogDraft",
  {},
  undefined,
  {
    getOnInit: true,
  }
);
