import { MainMenu } from "@/components/main-menu"
import Image from "next/image"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
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

      <MainMenu />
    </main>
  )
}
