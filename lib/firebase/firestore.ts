import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  limit,
  arrayUnion,
  arrayRemove,
  getDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import {db} from "./config";

export type Dog = {
  id: string;
  name: string;
  age: number;
  ageUnit: string;
  breed: string;
  description: string;
  gender: string;
  interests: string[];
  size: string;
  userId: string;
  likes: string[];
  seen: string[];
  filePath: string;
};

export type UpdateDog = {
  id: string;
  name: string;
  age: number;
  ageUnit: string;
  breed: string;
  description: string;
  gender: string;
  size: string;
};

export type Chat = {
  id: string;
  dogs: {
    dogId: string;
    name: string;
    userId: string;
  }[];
  userIds: string[];
  updatedAt: Date;
  initialMessage: {
    text: string;
    timestamp: Timestamp;
    readBy: string[];
  };
  lastMessage?: {
    userId: string;
    text: string;
    timestamp: Timestamp;
    read: boolean;
  };
};

export type Message = {
  text: string;
  timestamp: Timestamp;
  userId: string;
};

export async function getCurrentDog(uid: string | null) {
  if (!uid) {
    return null;
  }
  const q = query(collection(db, "dogs"), where("userId", "==", uid), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  }
  return querySnapshot.docs[0].data() as Dog;
}

export async function createDog(data: Dog) {
  await setDoc(doc(db, "dogs", data.id), data);
}

export async function updateDog(data: UpdateDog) {
  await updateDoc(doc(db, "dogs", data.id), data);
}

export async function getDogs(
  uid: string | null,
  currentDogSeen: string[] | undefined
) {
  if (!uid) {
    return null;
  }
  const q = query(collection(db, "dogs"), where("userId", "!=", uid));
  const querySnapshot = await getDocs(q);
  const dogs = querySnapshot.docs.map((doc) => doc.data() as Dog);
  if (!currentDogSeen) {
    return dogs;
  }
  const unseenDogs = dogs.filter((dog) => !currentDogSeen.includes(dog.id));
  return unseenDogs;
}

export async function likeDog(dogId: string, currentDog: string) {
  await updateDoc(doc(db, "dogs", currentDog), {
    likes: arrayUnion(dogId),
    seen: arrayUnion(dogId),
  });
}

export async function dislikeDog(dogId: string, currentDog: string) {
  await updateDoc(doc(db, "dogs", currentDog), {
    seen: arrayUnion(dogId),
  });
}

export async function undoDogAction(dogId: string, currentDog: string) {
  await updateDoc(doc(db, "dogs", currentDog), {
    likes: arrayRemove(dogId),
    seen: arrayRemove(dogId),
  });
}

export async function getChats(uid: string | null) {
  if (!uid) {
    return null;
  }
  const q = query(
    collection(db, "chats"),
    where("userIds", "array-contains", uid),
    orderBy("updatedAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  const chats = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    } as Chat;
  });
  return chats;
}

export async function getChat(chatId: string) {
  const docRef = doc(db, "chats", chatId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Chat;
}

export async function createMessage(chatId: string, message: Message) {
  await addDoc(collection(db, "chats", chatId, "messages"), message);
}

export async function updateChatRead(chat: Chat, userId: string) {
  if (
    chat.lastMessage &&
    chat.lastMessage.userId !== userId &&
    !chat.lastMessage.read
  ) {
    await updateDoc(doc(db, "chats", chat.id), {
      "lastMessage.read": true,
    });
  }
  await updateDoc(doc(db, "chats", chat.id), {
    "initialMessage.readBy": arrayUnion(userId),
  });
}
