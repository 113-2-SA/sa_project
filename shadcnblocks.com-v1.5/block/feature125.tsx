"use client";

import { Check, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const checkedItems: string[] = [
  "Responsive Design and Layout",
  "Clean and Modern Design",
  "Easy to Customize",
  "Cross Browser Compatible",
  "SEO Friendly",
  "High Performance and Speed",
];

const Feature125 = () => {
  return (
    <section className="m-x-auto container flex flex-col items-start gap-20 py-32 md:flex-row md:items-center">
      <div className="w-full lg:w-[40%]">
        <h2 className="mb-8 text-2xl font-extrabold">
          Build any kind of Website with our Blocks
        </h2>
        <p className="mb-10 text-xl">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi
          laboriosam voluptatibus temporibus doloremque laudantium.
        </p>
        <ul className="mb-14 flex flex-col gap-4 text-muted-foreground">
          {checkedItems.map((item) => (
            <li className="flex items-center gap-2 text-xl" key={item}>
              <Check className="size-7" /> {item}
            </li>
          ))}
        </ul>
        <Button variant="outline">
          See all blocks
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="relative flex h-[430px] w-full pr-4 pt-4 before:absolute before:inset-0 before:bg-primary/10 before:[mask-image:url(/images/block/cross-pattern.svg)] before:[mask-repeat:repeat] before:[mask-size:_32px_32px]">
        <div className="z-1 absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-background opacity-70"></div>
        <div className="relative mr-auto mt-auto w-[80%]">
          <img
            src="https://shadcnblocks.com/images/block/placeholder-1.svg"
            alt="placeholder hero"
            className="z-40 max-h-[350px] w-full rounded-md object-cover"
          ></img>
        </div>
        <div className="absolute inset-0 z-50 bg-gradient-to-r from-background via-transparent via-15%"></div>
        <div className="absolute inset-0 z-50 bg-gradient-to-t from-background via-transparent via-15%"></div>
      </div>
    </section>
  );
};

export default Feature125;
