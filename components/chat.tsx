"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import useUserSession from "@/hooks/useUserSession";
import {useAtomValue} from "jotai";
import {dogAtom} from "@/atoms/dogAtom";
import {
  Chat,
  createMessage,
  getChat,
  Message,
  updateChatRead,
} from "@/lib/firebase/firestore";
import {formatTimestamp, getThumbnailUrl} from "@/lib/utils";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import {db} from "@/lib/firebase/config";
import {SESSION_COOKIE_NAME} from "@/constants";
import {getCookie} from "cookies-next";

export default function Component({
  session,
  id,
}: {
  session: string | undefined;
  id: string;
}) {
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(true);
  const currentDog = useAtomValue(dogAtom);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const initSession = session || getCookie(SESSION_COOKIE_NAME) || null;
  const userSessionId = useUserSession(initSession);

  useEffect(() => {
    getChat(id).then((data) => {
      if (data) {
        setChat(data);
        updateChatRead(data, userSessionId!);
      }
      setLoading(false);
    });
    const q = query(
      collection(db, "chats", id, "messages"),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = [] as Message[];
      querySnapshot.forEach((doc) => {
        newMessages.push(doc.data() as Message);
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  const getOtherDog = () => {
    return chat?.dogs.find((dog) => dog.dogId !== currentDog.id)!;
  };

  const getDogThumbnail = (dogId: string) => {
    return getThumbnailUrl(dogId);
  };

  const handleCreateMessage = () => {
    createMessage(id, {
      text: message,
      userId: userSessionId!,
      timestamp: Timestamp.now(),
    }).then(() => setMessage(""));
  };

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] mb-5">
      <header className="py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/chat"
            className="rounded-full p-2 hover:bg-primary/20"
            prefetch={false}
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-2">
            <Avatar className="border w-10 h-10">
              <AvatarImage
                src={getDogThumbnail(getOtherDog().dogId)}
                alt="Emma's Image"
              />
              <AvatarFallback>{getOtherDog().name}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <p className="font-medium">{getOtherDog().name}</p>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          <div key="initialMessage" className="flex items-end gap-4">
            <Avatar className="border w-10 h-10">
              <AvatarImage
                src="https://cdn-icons-png.freepik.com/512/4823/4823463.png"
                alt="Tindog's Image"
              />
              <AvatarFallback>TD</AvatarFallback>
            </Avatar>
            <div className="bg-muted max-w-[70%] rounded-lg p-4">
              <p className="text-sm">{chat?.initialMessage.text}</p>
              <div className="flex items-center justify-end gap-2 pt-2 text-xs text-muted-foreground">
                <span>{formatTimestamp(chat?.initialMessage.timestamp!)}</span>
              </div>
            </div>
          </div>
          {messages.map((message, index) => {
            return message.userId != userSessionId ? (
              <div key={index} className="flex items-end gap-4">
                <Avatar className="border w-10 h-10">
                  <AvatarImage
                    src={getDogThumbnail(getOtherDog().dogId)}
                    alt="Emma's Image"
                  />
                  <AvatarFallback>{getOtherDog().name}</AvatarFallback>
                </Avatar>
                <div className="bg-muted max-w-[70%] rounded-lg p-4">
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-end gap-2 pt-2 text-xs text-muted-foreground">
                    <span>{formatTimestamp(message.timestamp)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div key={index} className="flex items-end gap-4 justify-end">
                <div className="bg-primary text-primary-foreground max-w-[70%] rounded-lg p-4">
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-end gap-2 pt-2 text-xs text-primary-foreground">
                    <span>{formatTimestamp(message.timestamp)}</span>
                  </div>
                </div>
                <Avatar className="border w-10 h-10">
                  <AvatarImage
                    src={getDogThumbnail(currentDog.id!)}
                    alt="Alex's Image"
                  />
                  <AvatarFallback>{currentDog.name}</AvatarFallback>
                </Avatar>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-background border-t px-4 py-2 flex items-center gap-2">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateMessage()}
          className="flex-1 bg-muted border-0 focus:ring-0 focus:outline-none"
        />
        <Button
          onClick={handleCreateMessage}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <SendIcon className="h-6 w-6" />
          <span className="sr-only">Send Message</span>
        </Button>
      </div>
    </div>
  );
}

function ArrowLeftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
