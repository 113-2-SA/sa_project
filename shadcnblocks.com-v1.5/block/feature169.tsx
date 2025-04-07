import { CircleHelp, Eye, Lightbulb, Volume2 } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const DATA = [
  {
    title: "Unified Scheduling",
    description:
      "Keep all your appointments and events in sync with seamless cross-platform calendar connectivity.",
    icon: CircleHelp,
    image: "https://shadcnblocks.com/images/block/placeholder-1.svg",
  },
  {
    title: "Insightful Performance",
    description:
      "Get clear, real-time analytics tracking your progress, key milestones, focus hours, and completed tasks.",
    icon: Volume2,
    image: "https://shadcnblocks.com/images/block/placeholder-2.svg",
  },
  {
    title: "Effortless Tool Integrations",
    description:
      "Link your favorite apps and services to streamline work without switching between platforms.",
    icon: Lightbulb,
    image: "https://shadcnblocks.com/images/block/placeholder-3.svg",
  },
];

const Feature169 = () => {
  return (
    <section id="optimized-scheduling" className="py-32">
      <div className="border-y">
        <div className="container flex flex-col gap-6 border-x py-4 max-lg:border-x lg:py-8">
          <Badge
            variant="outline"
            className="w-fit gap-1 bg-card px-3 text-sm font-normal tracking-tight shadow-sm"
          >
            <Eye className="size-4" />
            <span>Optimize</span>
          </Badge>
          <h2 className="text-3xl leading-tight tracking-tight md:text-4xl lg:text-6xl">
            Optimize every aspect of your day
          </h2>
          <p className="max-w-[600px] tracking-[-0.32px] text-muted-foreground">
            Achieve seamless productivity with intelligent scheduling,
            insightful analytics, and effortless integrations.
          </p>
        </div>
      </div>

      <div className="container border-x lg:!px-0">
        <Tabs defaultValue={DATA[0].title} className="">
          <TabsList className="h-auto w-full bg-transparent p-0 max-lg:flex-col max-lg:divide-y lg:grid lg:grid-cols-3 lg:divide-x">
            {DATA.map((item, index) => (
              <TabsTrigger
                key={item.title}
                value={item.title}
                className="group relative isolate inline-block h-full w-full whitespace-normal rounded-none px-1 py-5 text-start data-[state=active]:shadow-none max-lg:border-x last:max-lg:!border-b lg:border-b lg:px-8"
              >
                <div className="absolute bottom-[-1px] left-0 h-[1px] w-0 bg-gradient-to-r from-blue-600 via-sky-300 to-transparent transition-all duration-300 group-data-[state=active]:w-1/2" />
                <Accessory className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
                <Accessory className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
                {index === DATA.length - 1 && (
                  <>
                    <Accessory className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2" />
                    <Accessory className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
                  </>
                )}
                <div className="flex items-center gap-2">
                  <div className="relative size-6">
                    <div className="absolute inset-0 -rotate-45 rounded-full bg-gradient-to-l from-blue-600 via-sky-300 to-border to-50% transition-all duration-1000 group-data-[state=inactive]:opacity-0" />
                    <div className="absolute inset-[0.75px] rounded-full bg-gray-100"></div>
                    <div className="absolute inset-[1.25px] grid place-items-center rounded-full bg-border">
                      <item.icon className="size-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl tracking-[-0.36px]">{item.title}</h3>
                </div>
                <p className="mt-2 text-lg tracking-[-0.32px] text-muted-foreground">
                  {item.description}
                </p>
              </TabsTrigger>
            ))}
          </TabsList>

          {DATA.map((item) => (
            <TabsContent key={item.title} value={item.title} className="mt-0">
              <div className="flex flex-1 flex-col px-2 py-4 max-lg:border-x">
                <DiagonalPattern className="h-5" />
                <div className="my-1 border bg-muted px-5 py-1">
                  <img
                    src={item.image}
                    alt={item.title}
                    width={1312}
                    height={743.926}
                    className="object-contain dark:invert"
                  />
                </div>
                <DiagonalPattern className="h-5" />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="h-8 w-full border-y md:h-12 lg:h-[112px]">
        <div className="container h-full w-full border-x"></div>
      </div>
    </section>
  );
};

export default Feature169;

const DiagonalPattern = ({
  className,
  patternColor = "hsl(var(--foreground))",
  patternOpacity = 0.15,
}: {
  className?: string;
  patternColor?: string;
  patternOpacity?: number;
}) => {
  const svgPattern = `url("data:image/svg+xml,%3Csvg width='7' height='7' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${patternColor}' fill-opacity='${patternOpacity}' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div
      className={cn("h-full w-full border-2 border-dashed", className)}
      style={{
        backgroundImage: svgPattern,
      }}
    />
  );
};

const Accessory = ({ className }: { className: string }) => {
  return (
    <div
      className={cn(`size-2 rounded-[1px] bg-red-400`, className)}
      style={{
        background:
          "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 51.04%, rgba(0, 0, 0, 0.06) 100%), hsl(var(--background))",
        boxShadow:
          "0px 0px 0px 0.1px rgba(0, 0, 0, 0.05), 0px 0.5px 1px 0px rgba(0, 0, 0, 0.25)",
      }}
    ></div>
  );
};
