import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Contact5 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold">Reach Out to Us</span>
          <h1 className="mb-3 mt-1 text-3xl font-semibold md:text-4xl">
            We&apos;re Here to Help
          </h1>
          <p className="text-lg text-muted-foreground">
            Please fill out the form below, and we will get back to you soon.
          </p>
        </div>
        <div className="mx-auto flex max-w-[464px] flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="firstname">
                First Name<sup className="ml-0.5">*</sup>
              </Label>
              <Input type="text" id="firstname" placeholder="Your First Name" />
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
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="phone">
              Contact Number<sup className="ml-0.5">*</sup>
            </Label>
            <Input type="text" id="phone" placeholder="+123 456 7890" />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">
              Your Message<sup className="ml-0.5">*</sup>
            </Label>
            <Textarea
              placeholder="Let us know how we can assist you"
              id="message"
            />
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
    </section>
  );
};

export default Contact5;
