"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const integrations = [
  {
    title: "Lorem ipsum dolor sit",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image:
      "https://images.unsplash.com/photo-1653288973812-81d1951b8127?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Lorem ipsum dolor sit",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image:
      "https://images.unsplash.com/photo-1647715360138-33fb6fe68539?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Lorem ipsum dolor sit",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image:
      "https://images.unsplash.com/photo-1563952532949-3d1a874ad614?q=80&w=1951&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Lorem ipsum dolor sit",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image:
      "https://images.unsplash.com/photo-1647715360138-33fb6fe68539?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const Feature151 = () => {
  const [activeTabId, setActiveTabId] = useState<number>(0);

  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-16 max-w-xl">
          <Badge
            variant="outline"
            className="mb-6 bg-muted text-sm font-normal"
          >
            Get started today
          </Badge>
          <h1 className="mb-3 text-4xl font-medium">
            Build your revenue collection stack in days
          </h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
        <Tabs defaultValue="0">
          <TabsList className="mb-10 grid h-full grid-cols-1 gap-8 bg-transparent md:grid-cols-4">
            {integrations.map((item, index) => (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className="block cursor-pointer whitespace-normal rounded-lg p-4 md:hover:bg-muted-foreground/5"
                onClick={() => setActiveTabId(index)}
              >
                <div className="flex flex-row items-start gap-6 md:flex-col md:items-stretch">
                  <div className="relative flex items-center justify-start">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-solid border-muted-foreground/10 ${activeTabId === index && "md:bg-indigo-600 md:text-white md:shadow-[0px_0px_10px_rgba(0,0,255,0.3),_0px_0px_25px_rgba(0,0,255,0.1)]"}`}
                    >
                      {index + 1}
                    </div>
                    <div className="absolute left-7 hidden h-[2px] w-[calc(100%_+_32px)] bg-muted-foreground/5 md:block" />
                    <div className="absolute left-[13px] top-[26px] block h-full w-[2px] bg-muted-foreground/5 md:hidden" />
                  </div>
                  <div className="text-left">
                    <div
                      className={`text-base font-medium ${activeTabId === index ? "md:text-indigo-600" : "md:text-black"}`}
                    >
                      {item.title}
                    </div>
                    <div className="text-sm">{item.description}</div>
                  </div>
                </div>
                <div className="mt-6 block aspect-[1.5] w-full rounded-lg border border-solid border-muted-foreground/25 bg-muted-foreground/20 p-10 md:hidden">
                  <img
                    src={integrations[index].image}
                    alt={integrations[index].title}
                    className="h-full w-full rounded-lg border border-solid border-muted-foreground/25 object-cover"
                  />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent
            value={activeTabId.toString()}
            className="hidden aspect-[1.5] w-full rounded-lg border border-solid border-muted-foreground/15 bg-muted-foreground/10 p-10 md:block"
          >
            <img
              src={integrations[activeTabId].image}
              alt={integrations[activeTabId].title}
              className="h-full w-full rounded-lg border border-solid border-muted-foreground/25 object-cover"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Feature151;
