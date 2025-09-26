"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import {
  Navbar as ResizableNavbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <ResizableNavbar className="top-0">
        {/* Desktop navbar */}
        <NavBody className="px-4">
          {/* Left: Logo */}
          <Link href="/" className="flex flex-row items-center gap-1">
            <Image
              src="/assets/icons/logo.svg"
              height={26}
              width={26}
              alt="logo"
            />
            <p className="font-semibold text-lg">
              Price<span className="text-red-600">Wise</span>
            </p>
          </Link>

          {/* Right: Icons */}
          <div className="ml-auto flex items-center gap-4">
            <Image src="/assets/icons/search.svg" width={26} height={28} alt="search" />
            <Image src="/assets/icons/black-heart.svg" width={28} height={28} alt="heart" />
            <Image src="/assets/icons/user.svg" width={28} height={28} alt="user" />
          </div>
        </NavBody>

        {/* Mobile navbar */}
        <MobileNav>
          <MobileNavHeader>
            {/* Left: Logo */}
            <Link href="/" className="flex flex-row items-center gap-1">
              <Image
                src="/assets/icons/logo.svg"
                height={26}
                width={26}
                alt="logo"
              />
              <p className="font-semibold text-lg">
                Price<span className="text-red-600">Wise</span>
              </p>
            </Link>

            {/* Right: Toggle */}
            <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen((o) => !o)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="flex w-full items-center justify-end gap-6">
              <Image src="/assets/icons/search.svg" width={26} height={28} alt="search" />
              <Image src="/assets/icons/black-heart.svg" width={28} height={28} alt="heart" />
              <Image src="/assets/icons/user.svg" width={28} height={28} alt="user" />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>
    </div>
  )
}

