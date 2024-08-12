import Chats from "@/components/chats";
import {SESSION_COOKIE_NAME} from "@/constants";
import {cookies} from "next/headers";

export default function Chat() {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <header className="py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Chats</h1>
      </header>
      <div className="flex-1 overflow-y-auto">
        <Chats session={session} />
      </div>
    </div>
  );
}
