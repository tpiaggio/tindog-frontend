import Profile from "@/components/profile";
import {SESSION_COOKIE_NAME} from "@/constants";
import {cookies} from "next/headers";

export default function Page() {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!session) return <p>Loading...</p>;
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto">
        <Profile />
      </div>
    </div>
  );
}
