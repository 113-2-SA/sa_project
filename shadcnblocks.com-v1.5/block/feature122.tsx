"use client";

import {
  ArrowRight,
  Blocks,
  Fingerprint,
  LayoutPanelTop,
  MessageCircleMore,
  Users,
} from "lucide-react";
import { FC, useState } from "react";

import { Button } from "@/components/ui/button";

interface DataBlockProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Feature122 = () => {
  return (
    <section className="container py-32">
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-3">
        <DataBlock
          title="Communication"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          icon={
            <MessageCircleMore
              className="size-12 text-primary md:size-16"
              strokeWidth={1}
            />
          }
        />
        <DataBlock
          title="Integrations"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          icon={
            <Blocks
              className="size-12 text-primary md:size-16"
              strokeWidth={1}
            />
          }
        />
        <DataBlock
          title="Collaboration"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          icon={
            <Users
              className="size-12 text-primary md:size-16"
              strokeWidth={1}
            />
          }
        />
        <DataBlock
          title="Customization"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          icon={
            <LayoutPanelTop
              className="size-12 text-primary md:size-16"
              strokeWidth={1}
            />
          }
        />
        <DataBlock
          title="Security"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          icon={
            <Fingerprint
              className="size-12 text-primary md:size-16"
              strokeWidth={1}
            />
          }
        />
        <div className="flex w-full flex-grow flex-col gap-4 rounded-lg bg-accent p-5 md:col-span-2 md:col-start-2 md:row-span-2 md:row-start-2 lg:p-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-2">
            <h3 className="max-w-[80%] text-2xl font-extrabold md:max-w-[60%] lg:text-4xl">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit
            </h3>
            <Button className="w-full sm:w-auto" size="lg">
              Get Started
            </Button>
          </div>
          <img
            src="https://shadcnblocks.com/images/block/placeholder-dark-1.svg"
            alt="placeholder"
            className="aspect-square h-full w-full rounded-lg object-cover md:aspect-[3]"
          />
        </div>
      </div>
    </section>
  );
};

export default Feature122;

const DataBlock: FC<DataBlockProps> = ({ title, description, icon }) => {
  const [isBlockHover, setBlockHover] = useState<boolean>(false);

  return (
    <a
      href="#"
      className="flex w-full cursor-pointer flex-col rounded-lg bg-accent p-5 lg:p-8"
      onMouseOver={() => setBlockHover(true)}
      onMouseOut={() => setBlockHover(false)}
    >
      <h3
        className={`mb-2 w-fit border-b-2 border-solid border-transparent text-xl font-extrabold transition lg:text-3xl ${isBlockHover && "!border-primary/90"}`}
      >
        {title}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground lg:text-base">
        {description}
      </p>
      <div className="mt-auto flex items-end justify-between">
        <div>{icon}</div>
        <ArrowRight
          className={`size-7 h-fit transition ${isBlockHover && "size-7 translate-x-2 transform"}`}
          strokeWidth={2}
        />
      </div>
    </a>
  );
};
