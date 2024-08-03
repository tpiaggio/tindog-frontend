"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import useUserSession from "@/hooks/useUserSession";
import {useAtomValue} from "jotai";
import {dogAtom} from "@/atoms/dogAtom";
import {Chat} from "@/lib/firebase/firestore";
import {getThumbnailUrl} from "@/lib/utils";
import {clsx} from "clsx";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {db} from "@/lib/firebase/config";

const Chats = ({session}: {session: string}) => {
  const currentDog = useAtomValue(dogAtom);
  const userSessionId = useUserSession(session);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("userIds", "array-contains", userSessionId),
      orderBy("updatedAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newChats = [] as Chat[];
      querySnapshot.forEach((doc) => {
        const chat = {
          id: doc.id,
          ...doc.data(),
        } as Chat;
        newChats.push(chat);
      });
      setChats(newChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getDog = (chat: Chat) => {
    return chat.dogs.find((dog) => dog.dogId !== currentDog.id)!;
  };

  const getDogThumbnail = (chat: Chat) => {
    const dog = getDog(chat);
    return getThumbnailUrl(dog!.dogId);
  };

  const chatRead = (chat: Chat) => {
    if (!chat.lastMessage) {
      return chat.initialMessage.readBy.includes(userSessionId!);
    }

    if (chat.lastMessage.userId === userSessionId) {
      return true;
    } else {
      return chat.lastMessage.read;
    }
  };

  const chatMessage = (chat: Chat) => {
    if (!chat.lastMessage) {
      return chat.initialMessage.text;
    }

    return chat.lastMessage.text;
  };

  if (!isLoading && chats.length === 0) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">No chats found</h2>
          <p className="mt-2 text-muted-foreground">
            It looks like you haven&apos;t matched with any dogs yet. Why
            don&apos;t you try liking a new dog and see if they like you back?
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          prefetch={false}
        >
          See dogs
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-4 p-4">
      {chats.map((chat, index) => (
        <Link
          key={index}
          href={`/chat/${chat.id}`}
          className={clsx(
            "flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50",
            !chatRead(chat) && "bg-muted"
          )}
          prefetch={false}
        >
          <Avatar className="border w-12 h-12">
            <AvatarImage src={getDogThumbnail(chat)} alt="Alex's Image" />
            <AvatarFallback>{getDog(chat).name}</AvatarFallback>
          </Avatar>
          <div className="flex-1 grid gap-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{getDog(chat).name}</p>
              <p className="text-xs text-muted-foreground">1d</p>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {chatMessage(chat)}
            </p>
          </div>
          {!chatRead(chat) && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Unread</span>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

export default Chats;
