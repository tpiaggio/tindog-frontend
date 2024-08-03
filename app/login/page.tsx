"use client";

import Link from "next/link";

import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {GoogleButton} from "@/components/ui/google-button";
import {useFormState, useFormStatus} from "react-dom";
import {signInWithEmailAndPassword} from "@/lib/firebase/auth";

const initialState = {
  error: false,
  message: "",
};

export default async function LoginForm() {
  const [state, dispatch] = useFormState(
    signInWithEmailAndPassword,
    initialState
  );
  const {pending} = useFormStatus();

  return (
    <div className="flex items-center justify-center h-screen">
      <form action={dispatch}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button aria-disabled={pending} type="submit" className="w-full">
                Login
              </Button>
              <GoogleButton type="button" variant="outline" className="w-full">
                Login with Google
              </GoogleButton>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline">
                Sign up
              </Link>
            </div>
            {state?.error && (
              <p className="text-sm mt-4 text-center text-red-500">
                {state.message}
              </p>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
