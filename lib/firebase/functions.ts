import {httpsCallable} from "firebase/functions";
import {functions} from "./config";

interface AnalizeDogReq {
  filePath: string;
}

interface AnalizeDogRes {
  isDog: boolean;
  breed: string;
  size: string;
  description: string;
}

export async function analizeDog(filePath: string) {
  const dogDataFlow = httpsCallable<AnalizeDogReq, AnalizeDogRes>(
    functions,
    "dogDataFlow"
  );
  return dogDataFlow({filePath});
}

interface MatchDogsReq {
  firstDogId: string;
  secondDogId: string;
}

interface MatchDogsRes {
  success: boolean;
  text: string;
  chatId: string;
}

export async function matchDogs(firstDogId: string, secondDogId: string) {
  const matchDogsFunction = httpsCallable<MatchDogsReq, MatchDogsRes>(
    functions,
    "matchDogs"
  );
  return matchDogsFunction({firstDogId, secondDogId});
}
