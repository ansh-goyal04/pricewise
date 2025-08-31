"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

type Item = {
  alt: string
  src: string
}

export default function CarouselComp({ list }: { list: Item[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false})
  )

  return (
    <div className="relative w-full max-w-xs">
      {/* Carousel */}
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {list.map((item) => (
            <CarouselItem key={item.alt}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={484}
                      height={484}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Arrow image superimposed */}
      <Image
        src="/assets/icons/hand-drawn-arrow.svg"
        alt="arrow"
        width={175}
        height={175}
        className="absolute bottom-0 left-0 translate-x-[-50%] translate-y-[-20%]"
      />
    </div>
  )
}
