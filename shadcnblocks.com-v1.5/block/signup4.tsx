import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Signup4 = () => {
  return (
    <section className="relative py-32">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6">
            <div className="mb-6 flex flex-col items-center text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="400px"
                height="400px"
                viewBox="0 0 800 800"
                className="absolute -top-8 -z-10 mx-auto text-muted-foreground/30"
              >
                <rect fill="transparent" width="800" height="800" />
                <g fillOpacity="1">
                  <circle
                    fill="transparent"
                    cx="400"
                    cy="400"
                    r="400"
                    strokeWidth="1"
                    stroke="currentColor"
                    opacity={0.5}
                  />
                  <circle
                    fill="transparent"
                    cx="400"
                    cy="400"
                    r="300"
                    strokeWidth="1"
                    stroke="currentColor"
                    opacity={0.6}
                  />
                  <circle
                    fill="transparent"
                    cx="400"
                    cy="400"
                    r="200"
                    strokeWidth="1"
                    stroke="currentColor"
                    opacity={0.7}
                  />
                  <circle
                    fill="transparent"
                    cx="400"
                    cy="400"
                    r="100"
                    strokeWidth="1"
                    stroke="currentColor"
                    opacity={0.8}
                  />
                </g>
              </svg>

              <img
                src="https://shadcnblocks.com/images/block/block-1.svg"
                alt="logo"
                className="mb-7 h-10 w-auto"
              />
              <p className="mb-2 text-2xl font-bold">Create an account</p>
              <p className="text-muted-foreground">
                Start your 30-day free trial.
              </p>
            </div>
            <div>
              <div className="grid gap-4">
                <Input type="email" placeholder="Enter your email" required />

                <Button type="submit" className="mt-2 w-full">
                  Get Started
                </Button>

                <div className="flex items-center gap-4">
                  <span className="h-px w-full bg-input"></span>
                  <span className="text-xs text-muted-foreground">OR</span>
                  <span className="h-px w-full bg-input"></span>
                </div>
                <Button variant="outline" className="w-full">
                  <FcGoogle className="mr-2 size-5" />
                  Sign up with Google
                </Button>
                <Button variant="outline" className="w-full">
                  <FaFacebook className="mr-2 size-5" />
                  Sign up with Facebook
                </Button>
                <Button variant="outline" className="w-full">
                  <FaApple className="mr-2 size-5" />
                  Sign up with Apple
                </Button>
              </div>
              <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
                <p>Already have an account?</p>
                <a href="#" className="font-medium text-primary">
                  Log in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup4;
