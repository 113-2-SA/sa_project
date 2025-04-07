import { Badge } from "@/components/ui/badge";

const Feature115 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Badge variant="outline">Exceptional Software</Badge>
          <h1 className="text-3xl font-semibold md:text-5xl">Key Features</h1>
          <p className="max-w-2xl text-muted-foreground md:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quaerat
            odit sunt eaque ex, natus vel maxime tenetur odio? Nemo.
          </p>
        </div>
        <div className="mx-auto mt-20 grid max-w-screen-xl gap-7 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-muted/60 p-7 text-center">
            <h2 className="mb-2.5 text-lg font-semibold md:text-2xl">
              Interface
            </h2>
            <p className="text-muted-foreground md:text-lg">Category</p>
            <img
              src="https://shadcnblocks.com/images/block/placeholder-1.svg"
              alt="User-Friendly Interface"
              className="mt-7 w-full rounded-xl object-cover shadow-md md:max-h-80"
            />
          </div>
          <div className="rounded-xl bg-muted/60 p-7 text-center">
            <h2 className="mb-2.5 text-lg font-semibold md:text-2xl">
              Analytics
            </h2>
            <p className="text-muted-foreground md:text-lg">Category</p>
            <img
              src="https://shadcnblocks.com/images/block/placeholder-2.svg"
              alt="Advanced Analytics"
              className="mt-7 w-full rounded-xl object-cover shadow-md md:max-h-80"
            />
          </div>
          <div className="rounded-xl bg-muted/60 p-7 text-center">
            <h2 className="mb-2.5 text-lg font-semibold md:text-2xl">
              Integration
            </h2>
            <p className="text-muted-foreground md:text-lg">Category</p>
            <img
              src="https://shadcnblocks.com/images/block/placeholder-3.svg"
              alt="Seamless Integration"
              className="mt-7 w-full rounded-xl object-cover shadow-md md:max-h-80"
            />
          </div>
          <div className="rounded-xl bg-muted/60 p-7 text-center">
            <h2 className="mb-2.5 text-lg font-semibold md:text-2xl">
              Customizable
            </h2>
            <p className="text-muted-foreground md:text-lg">Category</p>
            <img
              src="https://shadcnblocks.com/images/block/placeholder-4.svg"
              alt="Customizable Features"
              className="mt-7 w-full rounded-xl object-cover shadow-md md:max-h-80"
            />
          </div>
          <div className="rounded-xl bg-muted/60 p-7 text-center">
            <h2 className="mb-2.5 text-lg font-semibold md:text-2xl">
              Support
            </h2>
            <p className="text-muted-foreground md:text-lg">Category</p>
            <img
              src="https://shadcnblocks.com/images/block/placeholder-5.svg"
              alt="Reliable Support"
              className="mt-7 w-full rounded-xl object-cover shadow-md md:max-h-80"
            />
          </div>
          <div className="rounded-xl bg-muted/60 p-7 text-center">
            <h2 className="mb-2.5 text-lg font-semibold md:text-2xl">
              Security
            </h2>
            <p className="text-muted-foreground md:text-lg">Category</p>
            <img
              src="https://shadcnblocks.com/images/block/placeholder-6.svg"
              alt="Secure Data Management"
              className="mt-7 w-full rounded-xl object-cover shadow-md md:max-h-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature115;
