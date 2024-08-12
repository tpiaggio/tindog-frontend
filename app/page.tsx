import Onboarding from "@/components/onboarding";
import Cards from "@/components/cards";
import {SESSION_COOKIE_NAME} from "@/constants";
import {cookies} from "next/headers";
import Navbar from "@/components/navbar";

export default async function Home() {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value;

  return (
    <>
      <Navbar />
      <Onboarding session={session} />
      <Cards session={session} />
    </>
  );
}
