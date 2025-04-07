"use client";

import { Card } from "@/components/ui/card";

const utilities = [
  {
    title: "Pass deals to Customer Success",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://shadcnblocks.com/images/block/placeholder-1.svg",
  },
  {
    title: "Closed-won deal notification",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://shadcnblocks.com/images/block/placeholder-2.svg",
  },
  {
    title: "Closed won deal Slack message",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://shadcnblocks.com/images/block/placeholder-3.svg",
  },
  {
    title: "Won and lost deal summary",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://shadcnblocks.com/images/block/placeholder-4.svg",
  },
  {
    title: "Customer renewal date autofill",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://shadcnblocks.com/images/block/placeholder-5.svg",
  },
  {
    title: "Stay on top of customer churn",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://shadcnblocks.com/images/block/placeholder-6.svg",
  },
];

const Feature148 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="m-auto mb-24 max-w-xl">
          <h2 className="mb-6 text-center text-3xl font-semibold lg:text-5xl">
            <span className="text-muted-foreground">Build</span> faster to go
            further.
          </h2>
          <p className="m-auto max-w-3xl text-center text-lg lg:text-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <a
            className="mx-auto mt-8 block w-fit rounded-full border-2 border-muted bg-white px-6 py-4 text-sm font-semibold transition hover:border-muted-foreground"
            href="#"
          >
            See templates library
          </a>
        </div>
        <div className="mt-11 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {utilities.map((utility, index) => (
            <Card key={index} className="border-0">
              <img
                src={utility.image}
                alt={utility.title}
                className="aspect-video w-full rounded-xl object-cover"
              />
              <div className="p-5">
                <p className="mb-1 font-medium">{utility.title}</p>
                <p className="text-muted-foreground">{utility.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature148;
