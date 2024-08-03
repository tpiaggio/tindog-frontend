import Chat from "@/components/chat";
import {SESSION_COOKIE_NAME} from "@/constants";
import {cookies} from "next/headers";

export default function Page({params}: {params: {id: string}}) {
  const id = params.id;
  const session = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!session) return <p>Loading...</p>;
  return <Chat session={session} id={id} />;
}
