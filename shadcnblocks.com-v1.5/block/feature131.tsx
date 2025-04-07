"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ITabData {
  id: number;
  title: string;
  imageSrc: string;
  description: string;
}

const tabsData: ITabData[] = [
  {
    id: 1,
    title: "Performance",
    imageSrc: "https://shadcnblocks.com/images/block/placeholder-dark-1.svg",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt, accusantium quam. Temporibus quae quos deserunt!",
  },
  {
    id: 2,
    title: "Innovation",
    imageSrc: "https://shadcnblocks.com/images/block/placeholder-dark-2.svg",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt, accusantium quam. Temporibus quae quos deserunt!",
  },
  {
    id: 3,
    title: "Quality",
    imageSrc: "https://shadcnblocks.com/images/block/placeholder-dark-3.svg",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt, accusantium quam. Temporibus quae quos deserunt!",
  },
];

const Feature131 = () => {
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState<string>(tabsData[0].imageSrc);

  return (
    <section className="py-32">
      <div className="container">
        <div className="flex w-full items-start justify-between gap-16">
          <div className="w-full md:max-w-[400px]">
            <h2 className="mb-12 text-4xl font-semibold">Our Core Features</h2>
            <Accordion type="single" defaultValue="item-1" className="w-full">
              {tabsData.map((tab) => (
                <AccordionItem
                  key={tab.id}
                  value={`item-${tab.id}`}
                  className={`border-b-0 border-t-2 px-2 transition hover:bg-accent ${tab.id === activeTabId && "border-foreground"}`}
                >
                  <AccordionTrigger
                    onClick={() => {
                      setActiveImage(tab.imageSrc);
                      setActiveTabId(tab.id);
                    }}
                    className="cursor-pointer py-5 !no-underline transition"
                  >
                    <h6
                      className={`text-xl font-semibold text-muted-foreground ${tab.id === activeTabId ? "text-black" : "text-muted-foreground"}`}
                    >
                      {tab.title}
                    </h6>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mt-3 text-muted-foreground">
                      {tab.description}
                    </p>
                    <div className="mt-4 md:hidden">
                      <img
                        src={tab.imageSrc}
                        alt="placeholder"
                        className="h-full max-h-80 w-full rounded-md object-cover"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="relative hidden w-full overflow-hidden rounded-md bg-accent pl-12 pt-12 md:block lg:m-auto">
            <img
              src={activeImage}
              alt="placeholder"
              className="max-h-[490px] w-full rounded-tl-md object-cover transition-opacity duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature131;
