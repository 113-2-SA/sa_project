"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const integrations = [
  {
    id: "1",
    image: "https://shadcnblocks.com/images/block/block-1.svg",
    title: "Lorem ipsum dolor, sit amet consectetur",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas laboriosam, tempore amet esse adipisci accusamus laborum",
  },
  {
    id: "2",
    image: "https://shadcnblocks.com/images/block/block-2.svg",
    title: "Lorem ipsum dolor, sit amet consectetur",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas laboriosam, tempore amet esse adipisci accusamus laborum",
  },
  {
    id: "3",
    image: "https://shadcnblocks.com/images/block/block-3.svg",
    title: "Lorem ipsum dolor, sit amet consectetur",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas laboriosam, tempore amet esse adipisci accusamus laborum",
  },
];

const Feature156 = () => {
  const [cardNumber, setCardNumber] = useState(0);

  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-6 flex flex-col items-center gap-6">
          <Badge
            variant="outline"
            className="border-0 bg-muted-foreground/5 px-2 py-0 text-base font-normal"
          >
            Text
          </Badge>
          <h1 className="max-w-2xl text-center text-4xl md:text-[56px]">
            Lorem ipsum dolor sit amet consectetur
          </h1>
        </div>
        <Tabs defaultValue={cardNumber.toString()}>
          <div className="mb-10 flex h-96 items-center justify-center bg-muted-foreground/10">
            {integrations.map((item, index) => (
              <TabsContent
                value={index.toString()}
                key={index}
                className="h-full"
              >
                <img
                  src={item.image}
                  alt="logo"
                  className="h-full object-cover"
                />
              </TabsContent>
            ))}
          </div>
          <TabsList className="grid h-full w-full grid-cols-1 gap-8 bg-transparent lg:grid-cols-3 lg:gap-14">
            {integrations.map((item, index) => (
              <TabsTrigger
                value={index.toString()}
                key={index}
                className={`flex flex-col items-start ${cardNumber === index ? "opacity-100" : "opacity-50"}`}
                onClick={() => setCardNumber(index)}
              >
                <h3 className="mb-2">{item.title}</h3>
                <p className="text-wrap text-start text-muted-foreground">
                  {item.description}
                </p>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </section>
  );
};

export default Feature156;
