import { providerMap } from "@/auth"
import { LoginForm } from "@/components/login-form"
import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl: string | undefined }>
}) {
  const searchParams = await props.searchParams
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            NewslyUSA
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm 
              providerMap={providerMap} 
              callbackUrl={searchParams?.callbackUrl} 
            />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="https://plus.unsplash.com/premium_vector-1749519354371-491017e20648?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Background"
          fill
          className="absolute inset-0 h-full w-full object-cover "
        />
      </div>
    </div>
  )
}
