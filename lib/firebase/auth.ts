import {z} from "zod";
import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged as _onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

import {auth} from "./config";
import {createSession} from "@/actions/auth";
import {setCookie} from "cookies-next";
import {SESSION_COOKIE_NAME} from "@/constants";

export function onAuthStateChanged(callback: (authUser: User | null) => void) {
  return _onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);

    if (!result || !result.user) {
      throw new Error("Google sign in failed");
    }
    return result.user.uid;
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signInWithEmailAndPassword(
  prevState: {error: boolean; message: string} | undefined,
  formData: FormData
) {
  try {
    const loginFields = AuthSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!loginFields.success) {
      return {
        error: true,
        message: "Invalid credentials. Please try again.",
      };
    }
    const {email, password} = loginFields.data;
    const result = await _signInWithEmailAndPassword(auth, email, password);

    if (!result || !result.user) {
      throw new Error("Email and password sign in failed");
    }
    if (!result.user.emailVerified) {
      await sendEmailVerification(result.user);
      await auth.signOut();
      return {
        error: true,
        message:
          "Email is not verified. Please verify your email and try again.",
      };
    }
    await createSession(result.user.uid);
    setCookie(SESSION_COOKIE_NAME, result.user.uid);
    return {
      error: false,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Error signing in with email and password", error);
  }
}

export async function signOut() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}

export async function createUserWithEmail(
  prevState: {error: boolean; message: string} | undefined,
  formData: FormData
) {
  try {
    const signUpFields = AuthSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!signUpFields.success) {
      return {
        error: true,
        message: "Invalid credentials. Please try again.",
      };
    }
    const {email, password} = signUpFields.data;
    const result = await createUserWithEmailAndPassword(auth, email, password);

    if (!result || !result.user) {
      return {
        error: true,
        message: "Create user with email and password failed",
      };
    }
    await sendEmailVerification(result.user);
    return {
      error: false,
      message: "Email verification sent",
    };
  } catch (error) {
    console.error("Error creating user with email and password", error);
  }
}
