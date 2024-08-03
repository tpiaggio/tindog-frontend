"use client";

import {signInWithGoogle} from "@/lib/firebase/auth";
import {Button, ButtonProps} from "./button";
import {createSession} from "@/actions/auth";

const handleSignInWithGoogle = async () => {
  const userUid = await signInWithGoogle();
  if (userUid) {
    await createSession(userUid);
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
