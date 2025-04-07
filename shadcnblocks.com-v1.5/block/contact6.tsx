import { Mail, MapPin, MessagesSquare, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Contact6 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-14">
          <span className="text-sm font-semibold">Reach Us</span>
          <h1 className="mb-3 mt-1 text-balance text-3xl font-semibold md:text-4xl">
            Speak with Our Friendly Team
          </h1>
          <p className="text-lg text-muted-foreground">
            We&apos;d love to assist you. Fill out the form or drop us an email.
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <Mail className="mb-3 h-6 w-auto" />
              <p className="mb-2 text-lg font-semibold">Email Us</p>
              <p className="mb-3 text-muted-foreground">
                Our team is ready to assist.
              </p>
              <a href="#" className="font-semibold hover:underline">
                abc@example.com
              </a>
            </div>
            <div>
              <MessagesSquare className="mb-3 h-6 w-auto" />
              <p className="mb-2 text-lg font-semibold">Live Chat Support</p>
              <p className="mb-3 text-muted-foreground">
                Reach out for quick help.
              </p>
              <a href="#" className="font-semibold hover:underline">
                Start a new chat
              </a>
            </div>
            <div>
              <MapPin className="mb-3 h-6 w-auto" />
              <p className="mb-2 text-lg font-semibold">Visit Us</p>
              <p className="mb-3 text-muted-foreground">
                Drop by our office for a chat.
              </p>
              <a href="#" className="font-semibold hover:underline">
                1234 Street Name, City Name
              </a>
            </div>
            <div>
              <Phone className="mb-3 h-6 w-auto" />
              <p className="mb-2 text-lg font-semibold">Call Us</p>
              <p className="mb-3 text-muted-foreground">
                We&apos;re available Mon-Fri, 9am-5pm.
              </p>
              <a href="#" className="font-semibold hover:underline">
                +123 456 7890
              </a>
            </div>
          </div>
          <div className="mx-auto flex w-full flex-col gap-6 rounded-lg bg-muted p-10 md:max-w-[464px]">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstname">
                  First Name<sup className="ml-0.5">*</sup>
                </Label>
                <Input
                  type="text"
                  id="firstname"
                  placeholder="Your First Name"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastname">
                  Last Name<sup className="ml-0.5">*</sup>
                </Label>
                <Input type="text" id="lastname" placeholder="Your Last Name" />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">
                Email Address<sup className="ml-0.5">*</sup>
              </Label>
              <Input type="email" id="email" placeholder="Your Email" />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">
                Your Message<sup className="ml-0.5">*</sup>
              </Label>
              <Textarea placeholder="How can we help you?" id="message" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the
                <span className="ml-1 underline">privacy policy</span>
              </label>
            </div>
            <Button className="w-full">Submit</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact6;
