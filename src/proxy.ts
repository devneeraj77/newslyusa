import { NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  
  const isSignIn = nextUrl.pathname === "/admin/signin"
  const isAdmin = nextUrl.pathname.startsWith("/admin")
    const isDashboard = nextUrl.pathname.startsWith("/dashboard")

  if (isSignIn && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  if ((isAdmin || isDashboard) && !isSignIn && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/signin", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}