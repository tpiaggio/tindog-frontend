"use client";

import {signOut} from "@/lib/firebase/auth";
import {removeSession} from "@/actions/auth";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useSetAtom} from "jotai";
import {dogAtom} from "@/atoms/dogAtom";
import {RESET} from "jotai/utils";

export default function Navbar() {
  const setDog = useSetAtom(dogAtom);

  const handleSignOut = async () => {
    await signOut();
    await removeSession();
    setDog(RESET);
  };

  return (
    <header className="flex h-16 w-full items-center justify-between bg-background px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <span className="text-lg font-bold">🐶 Tindog</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link
          href="/chat"
          className="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50"
          prefetch={false}
        >
          Chat
        </Link>
        <Link
          href="/profile"
          className="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50"
          prefetch={false}
        >
          Profile
        </Link>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <LogOutIcon className="h-5 w-5" />
          <span className="sr-only">Sign Out</span>
        </Button>
      </nav>
    </header>
  );
}

function LogOutIcon(props: any) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function MountainIcon(props: any) {
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
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function XIcon(props: any) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
