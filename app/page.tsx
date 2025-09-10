import CarouselComp from "@/local-comp/Carousel";
import SearchBox from "@/local-comp/SearchBox";
import Trending from "@/local-comp/Trending";
import Image from "next/image";

const heroImg = [
  { src: "/assets/images/hero-1.svg", alt: "smartwatch" },
  { src: "/assets/images/hero-2.svg", alt: "bag" },
  { src: "/assets/images/hero-3.svg", alt: "lamp" },
  { src: "/assets/images/hero-4.svg", alt: "air fryer" },
  { src: "/assets/images/hero-5.svg", alt: "chair" },
];

export default function Home() {
  return (
    <div>
      <section className="px-6 md:px-20 py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left column */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <p className="small-text text-red-500 flex items-center gap-1">
              Smart Shopping starts here
              <Image
                src="/assets/icons/arrow-right.svg"
                height={10}
                width={14}
                alt="arrowright"
                className="inline-block"
              />
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-4">
              Unleash the power of{" "}
              <span className="text-red-500">PiceWise</span>
            </h1>
            <p className="mt-6 text-gray-600 max-w-md">
              Powerful, self-serve product and growth analytics to help you
              convert, engage, and retain more.
            </p>

            <div className="mt-6">
              <SearchBox />
            </div>
          </div>

          {/* Right column (carousel) */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <CarouselComp list={heroImg} />
          </div>
        </div>
      </section>

      <section className="px-6 md:px-20 py-12">
        <Trending/>
      </section>
    </div>
  );
}
