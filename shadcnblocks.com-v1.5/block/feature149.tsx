"use client";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const Feature149 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:gap-0">
          <img
            src="https://images.unsplash.com/photo-1653288973812-81d1951b8127?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="img"
            className="absolute left-0 top-0 z-[-1] h-full w-full rounded-2xl object-cover md:block"
          />
          <div
            className="group relative flex h-[600px] w-full cursor-pointer flex-col items-start gap-8 p-10 transition-all duration-300 md:w-1/2 hover:md:w-2/3"
            onClick={() => {
              window.scrollTo({ top: 0 });
            }}
          >
            <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-2xl bg-transparent transition-all duration-300 group-hover:bg-black/10" />
            <Button
              variant="outline"
              className="rounded-full border-0 bg-white bg-opacity-30 text-white"
            >
              CRM Software
            </Button>
            <h1 className="text-5xl text-white">Streamline Sales</h1>
            <p className="max-w-80 text-left text-white">
              Streamline your sales process with our innovative CRM software.
              Manage leads, track interactions, and boost your sales efficiency.
            </p>
            <Button
              variant="outline"
              className="rounded-full bg-transparent text-white outline-none transition-all duration-300"
            >
              Preview <ArrowUpRight strokeWidth="1" />
            </Button>
          </div>
          <div className="relative hidden h-[600px] w-5 bg-white md:block">
            <div className="absolute left-[-40px] top-0 h-[40px] w-[40px] rounded-[1rem] shadow-[10px_-10px_0_0_#fff]" />
            <div className="absolute right-[-40px] top-0 h-[40px] w-[40px] rounded-[1rem] shadow-[-10px_-10px_0_0_#fff]" />
            <div className="absolute bottom-0 left-[-40px] h-[40px] w-[40px] rounded-[1rem] shadow-[10px_10px_0_0_#fff]" />
            <div className="absolute bottom-0 right-[-40px] h-[40px] w-[40px] rounded-[1rem] shadow-[-10px_10px_0_0_#fff]" />
          </div>
          <div
            className="group relative flex h-[600px] w-full cursor-pointer flex-col items-end gap-8 p-10 transition-all duration-300 md:w-1/2 hover:md:w-2/3"
            onClick={() => {
              console.log("click");
            }}
          >
            <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-2xl bg-transparent transition-all duration-300 group-hover:bg-black/10" />
            <Button
              variant="outline"
              className="rounded-full border-0 bg-white bg-opacity-30 text-white"
            >
              Analytics Suite
            </Button>
            <h1 className="text-right text-5xl text-white md:text-left">
              Measure Success
            </h1>
            <p className="max-w-80 text-right text-white md:text-left">
              Enhance customer satisfaction and retention with our powerful CRM
              tools. Analyze data and make informed decisions to drive growth.
            </p>
            <Button
              variant="outline"
              className="rounded-full bg-transparent text-white outline-none transition-all duration-300"
            >
              Preview <ArrowUpRight strokeWidth="1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature149;
