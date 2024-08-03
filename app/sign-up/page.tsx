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
import {createUserWithEmail} from "@/lib/firebase/auth";

const initialState = {
  error: false,
  message: "",
};

export default async function SignUpPage() {
  const [state, formAction] = useFormState(createUserWithEmail, initialState);
  const {pending} = useFormStatus();

  return (
    <form action={formAction}>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            Enter your details below to create a new account
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
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button aria-disabled={pending} type="submit" className="w-full">
              Sign up
            </Button>
            <GoogleButton type="button" variant="outline" className="w-full">
              Sign up with Google
            </GoogleButton>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
          {state?.error && (
            <p className="text-sm mt-4 text-center text-red-500">
              {state.message}
            </p>
          )}
          {!state?.error && state?.message && (
            <p className="text-sm mt-4 text-center text-green-500">
              {state.message}
            </p>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
