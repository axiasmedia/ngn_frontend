"use client"

import { Button } from "@/components/ui/button"
import { Inbox, Package, Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden bg-gray-700 p-2">
        <Button
          variant="ghost"
          className="text-white w-full flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Menu</span>
          <Menu size={20} />
        </Button>
      </div>

      <aside className={`${isOpen ? "block" : "hidden"} md:block w-full md:w-48 bg-gray-700 text-white`}>
        <nav className="flex flex-col">
          <Link
            href="#"
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-600 border-l-4 border-transparent hover:border-primary"
          >
            <Inbox size={16} />
            <span>Open Incidents</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-600 border-l-4 border-transparent hover:border-primary"
          >
            <Package size={16} />
            <span>My Equipment</span>
          </Link>
          <Button variant="ghost" className="justify-start text-white hover:bg-gray-600 rounded-none h-10 px-4">
            Button
          </Button>
          <Button variant="ghost" className="justify-start text-white hover:bg-gray-600 rounded-none h-10 px-4">
            Button
          </Button>
        </nav>
      </aside>
    </>
  )
}

