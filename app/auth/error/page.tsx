import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/background.png"
          alt="Iridescent background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {params?.error ? (
              <div className="space-y-2">
                <p className="text-sm text-red-400 font-medium">Error: {params.error}</p>
                {params.error_description && <p className="text-sm text-white/70">{params.error_description}</p>}
              </div>
            ) : (
              <p className="text-sm text-white/70">An authentication error occurred. Please try again.</p>
            )}

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
