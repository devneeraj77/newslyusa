"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function loginWithCredentials(values: { email: string; password: string }) {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirectTo: "/admin",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" }
        default:
          return { error: "Something went wrong" }
      }
    }
    throw error
  }
}

export async function loginWithProvider(providerId: string, callbackUrl?: string) {
  try {
    await signIn(providerId, {
      redirectTo: callbackUrl || "/admin",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message }
    }
    throw error
  }
}
