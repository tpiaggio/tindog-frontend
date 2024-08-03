import {atomWithStorage} from "jotai/utils";
import {Dog} from "@/lib/firebase/firestore";

interface DogDraft extends Partial<Dog> {}

export const dogAtom = atomWithStorage<DogDraft>("dog", {}, undefined, {
  getOnInit: true,
});
