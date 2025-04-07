"use client";

import {
  ArrowDownToLine,
  ArrowUpDown,
  Code,
  Redo,
  Repeat,
  Scaling,
  Scan,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const badges = [
  {
    title: "Integrations",
    icon: <Code className="size-4" />,
  },
  {
    title: "Automation",
    icon: <ArrowUpDown className="size-4" />,
  },
  {
    title: "Customization",
    icon: <Redo className="size-4" />,
  },
  {
    title: "Collaboration",
    icon: <ArrowDownToLine className="size-4" />,
  },
  {
    title: "Security",
    icon: <Repeat className="size-4" />,
  },
  {
    title: "Performance",
    icon: <Scan className="size-4" />,
  },
  {
    title: "Scalability",
    icon: <Scaling className="size-4" />,
  },
];

const Feature154 = () => {
  return (
    <section className="relative py-32 before:absolute before:inset-0 before:bg-primary/10 before:[mask-image:url(/images/block/waves.svg)] before:[mask-repeat:repeat] before:[mask-size:_64px_32px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-background"></div>
      <div className="container mx-auto">
        <div className="relative z-[3] flex flex-col items-center gap-8">
          <Badge
            variant="secondary"
            className="body-small m-auto block w-fit rounded-full px-3 py-1 text-center"
          >
            Badge
          </Badge>
          <h1 className="text-center text-4xl font-semibold md:text-6xl">
            This is where your feature goes
          </h1>
          <p className="w-full max-w-80 text-center text-sm font-normal sm:max-w-[430px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="relative m-auto mt-20 w-[calc(100%-100px)] overflow-hidden before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-28 before:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-28 after:-scale-x-100 after:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] after:content-[''] max-[980px]:mt-12 max-[980px]:w-full max-[580px]:mt-9">
          <div className="flex w-[calc(250px*10)] animate-infinite-slider">
            {badges.map((item, index) => (
              <Badge
                variant="secondary"
                className="mr-12 flex h-16 w-fit items-center justify-center rounded-full shadow-sm"
                key={index}
              >
                <p className="flex size-8 max-h-10 min-h-10 min-w-10 max-w-10 items-center justify-center rounded-full bg-accent lg:size-10">
                  {item.icon}
                </p>
                <p className="flex w-fit items-center justify-center text-xl font-semibold md:text-2xl lg:text-2xl">
                  {item.title}
                </p>
              </Badge>
            ))}
            {badges.map((item, index) => (
              <Badge
                variant="secondary"
                className="mr-12 flex h-16 w-fit items-center justify-center rounded-full shadow-sm"
                key={index}
              >
                <p className="flex size-8 max-h-10 min-h-10 min-w-10 max-w-10 items-center justify-center rounded-full bg-accent lg:size-10">
                  {item.icon}
                </p>
                <p className="flex w-fit items-center justify-center text-xl font-semibold md:text-2xl lg:text-2xl">
                  {item.title}
                </p>
              </Badge>
            ))}
          </div>
        </div>

        <div className="relative m-auto mt-11 w-[calc(100%-100px)] overflow-hidden before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-28 before:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-28 after:-scale-x-100 after:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] after:content-[''] max-[980px]:w-full">
          <div className="flex w-[calc(250px*10)] animate-infinite-slider-reverse">
            {badges.map((item, index) => (
              <Badge
                variant="secondary"
                className="mr-12 flex h-16 w-fit items-center justify-center rounded-full shadow-sm"
                key={index}
              >
                <p className="flex size-8 max-h-10 min-h-10 min-w-10 max-w-10 items-center justify-center rounded-full bg-accent lg:size-10">
                  {item.icon}
                </p>
                <p className="flex w-fit items-center justify-center text-xl font-semibold md:text-2xl lg:text-2xl">
                  {item.title}
                </p>
              </Badge>
            ))}
            {badges.map((item, index) => (
              <Badge
                variant="secondary"
                className="mr-12 flex h-16 w-fit items-center justify-center rounded-full p-4 shadow-sm"
                key={index}
              >
                <p className="flex size-8 max-h-10 min-h-10 min-w-10 max-w-10 items-center justify-center rounded-full bg-accent lg:size-10">
                  {item.icon}
                </p>
                <p className="flex w-fit items-center justify-center text-xl font-semibold md:text-2xl lg:text-2xl">
                  {item.title}
                </p>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature154;
