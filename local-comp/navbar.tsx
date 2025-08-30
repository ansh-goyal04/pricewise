"use client"

import Image from "next/image"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default function Navbar() {
  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList className="flex-row w-full items-center justify-between">
        {/* Logo (Left side) */}
        <NavigationMenuItem className="flex-row items-center">
          <NavigationMenuLink asChild>
            <Link href="/" className="flex-row items-center gap-1">
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
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Right side icons */}
        <div className="flex items-center gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Image
                src="/assets/icons/search.svg"
                width={26}
                height={28}
                alt="search"
              />
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Image
                src="/assets/icons/black-heart.svg"
                width={28}
                height={28}
                alt="heart"
              />
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Image
                src="/assets/icons/user.svg"
                width={28}
                height={28}
                alt="user"
              />
            </NavigationMenuLink>
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

