import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const Hero58 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-8 lg:gap-14">
            <h1 className="text-4xl font-semibold md:text-5xl lg:text-7xl">
              Your workspace <br />
              <span className="mx-1 inline-block whitespace-nowrap">
                anywhere.
              </span>
            </h1>
            <p className="text-muted-foreground lg:text-lg">
              Set up your environment with everything you need and share it
              effortlessly. Stay productive throughout your workflow, no matter
              where you are.
            </p>
            <Button size="lg" className="w-fit">
              Download <ChevronDown className="ml-2 h-auto w-4" />
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              Use
              <span className="flex size-7 items-center justify-center rounded-md border">
                <ChevronLeft className="h-auto w-4" />
              </span>
              <span className="flex size-7 items-center justify-center rounded-md border">
                <ChevronRight className="h-auto w-4" />
              </span>
              to navigate your options
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_100%_at_50%_50%,#000_60%,transparent_100%)]"></div>
            {/* illustrations available from https://icons8.com/illustrations/style--tokyo */}
            <img
              src="https://shadcnblocks.com/images/block/illustrations/tokyo-selecting-the-elements-of-the-horizontal-graph-chart.svg"
              alt="placeholder"
              className="mx-auto max-h-[700px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero58;
