import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="bg-primary h-8 w-8 flex items-center justify-center rounded text-primary-foreground font-bold">
        CH
      </div>
      <span className="font-semibold text-lg hidden sm:inline-block">Chrysalis Health</span>
    </Link>
  )
}

