import {
  CalendarClock,
  ChartNoAxesCombined,
  PocketKnife,
  SquarePen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const FEATURES_DATA = [
  {
    title: "Smart Task Management",
    description:
      "Create, prioritize, and delegate tasks effortlessly. AI helps you identify what matters most with smart recommendations and automated workflows.",
    icon: SquarePen,
    image: "https://shadcnblocks.com/images/block/block-1.svg",
  },
  {
    title: "Automated Scheduling",
    description:
      "Let AI find the best time slots for meetings, reminders, and tasks based on your calendar and working habits. Stay organized without the hassle.",
    icon: CalendarClock,
    image: "https://shadcnblocks.com/images/block/block-2.svg",
  },
  {
    title: "Personalized Insights",
    description:
      "Track your productivity with AI-powered insights. Get weekly summaries and actionable tips to improve your workflow and manage workloads better.",
    icon: ChartNoAxesCombined,
    image: "https://shadcnblocks.com/images/block/block-3.svg",
  },
];
const Feature167 = () => {
  return (
    <section className="py-32">
      <div className="border-y">
        <div className="container flex flex-col gap-6 border-x py-4 max-lg:border-x lg:py-8">
          <Badge
            variant="outline"
            className="w-fit gap-1 bg-card px-3 text-sm font-normal tracking-tight shadow-sm"
          >
            <PocketKnife className="size-4" />
            <span>Features</span>
          </Badge>

          <h2 className="text-3xl leading-tight tracking-tight md:text-4xl lg:text-6xl">
            Smart productivity with AI
          </h2>
          <p className="max-w-[600px] tracking-[-0.32px] text-muted-foreground">
            Unlock smarter productivity with features that help you manage
            tasks, time, and focus—seamlessly.
          </p>
        </div>
      </div>

      <div className="container border-x lg:!px-0">
        <Tabs
          defaultValue={FEATURES_DATA[0].title}
          className="flex items-center max-lg:flex-col lg:divide-x"
        >
          <TabsList className="flex h-auto flex-1 flex-col bg-transparent p-0 max-lg:border-x lg:border-t">
            {FEATURES_DATA.map((item) => (
              <TabsTrigger
                key={item.title}
                value={item.title}
                className="group relative whitespace-normal border-b px-1 py-5 text-start data-[state=active]:shadow-none lg:px-8"
              >
                <div className="absolute bottom-[-1px] left-0 z-10 h-[1px] w-0 bg-gradient-to-r from-blue-600 via-sky-300 to-transparent transition-all duration-300 group-data-[state=active]:w-1/2" />
                <div className="">
                  <div className="flex items-center gap-1.5">
                    <item.icon className="size-4" />
                    <h3 className="text-lg tracking-[-0.36px]">{item.title}</h3>
                  </div>
                  <p className="mt-2.5 tracking-[-0.32px] text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1">
            {FEATURES_DATA.map((item, index) => (
              <TabsContent
                key={index}
                value={item.title}
                className="m-0 px-6 py-[38px] max-lg:border-x"
              >
                <div className="flex justify-center">
                  <div>
                    <div className="px-6 lg:px-10">
                      <DiagonalPattern className="h-6 lg:h-10" />
                    </div>
                    <div className="relative grid grid-cols-[auto_1fr_auto] items-stretch">
                      <DiagonalPattern className="h-full w-6 lg:w-10" />
                      <img
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={510}
                        className="object-contain dark:invert"
                        style={{
                          boxShadow:
                            "0px 8px 8px 0px rgba(0, 0, 0, 0.06), 0px 4px 4px 0px rgba(0, 0, 0, 0.06), 0px 2px 2px 0px rgba(0, 0, 0, 0.06), 0px 0px 0px 1px rgba(0, 0, 0, 0.06)",
                        }}
                      />
                      <DiagonalPattern className="w-6 lg:w-10" />
                    </div>
                    <div className="px-6 lg:px-10">
                      <DiagonalPattern className="h-6 lg:h-10" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>

      <div className="h-8 w-full border-y md:h-12 lg:h-[112px]">
        <div className="container h-full w-full border-x"></div>
      </div>
    </section>
  );
};

export default Feature167;

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
