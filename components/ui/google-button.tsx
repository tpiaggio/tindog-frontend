"use client";

import {signInWithGoogle} from "@/lib/firebase/auth";
import {Button, ButtonProps} from "./button";
import {createSession} from "@/actions/auth";
import {setCookie} from "cookies-next";
import {SESSION_COOKIE_NAME} from "@/constants";

const handleSignInWithGoogle = async () => {
  const userUid = await signInWithGoogle();
  if (userUid) {
    await createSession(userUid);
    setCookie(SESSION_COOKIE_NAME, userUid);
  }
};

const GoogleButton = ({children, ...props}: ButtonProps) => {
  return (
    <Button {...props} onClick={handleSignInWithGoogle}>
      {children}
    </Button>
  );
};

export {GoogleButton};
