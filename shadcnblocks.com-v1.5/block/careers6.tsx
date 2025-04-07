import { Clock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const jobs = [
  {
    title: "Senior Software Engineer",
    category: "Engineering",
    description:
      "You will be responsible for the development of new and existing software products.",
    location: "Remote",
    type: "Full-time",
    link: "#",
  },
  {
    title: "Product Manager",
    category: "Engineering",
    description: "Help us build the next generation of Acme products.",
    location: "Remote",
    type: "Full-time",
    link: "#",
  },
  {
    title: "QA Engineer",
    category: "Engineering",
    description:
      "Ensure the quality of our software products through testing and automation.",
    location: "Remote",
    type: "Full-time",
    link: "#",
  },
  {
    title: "Technical Support Specialist",
    category: "Engineering",
    description:
      "Provide technical support to our customers and internal teams.",
    location: "Remote",
    type: "Full-time",
    link: "#",
  },
  {
    title: "Content Writer",
    category: "Marketing",
    description:
      "Create engaging content for our blog, website, and social media channels.",
    location: "Remote",
    type: "Full-time",
    link: "#",
  },
  {
    title: "Social Media Manager",
    category: "Marketing",
    description:
      "Manage our social media presence and engage with our followers.",
    location: "Remote",
    type: "Full-time",
    link: "#",
  },
];

const Careers6 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto grid gap-10 lg:grid-cols-2">
          <div className="max-w-md">
            <Badge variant="outline" className="mb-4">
              Job openings
            </Badge>
            <h1 className="mb-4 text-4xl font-semibold">Open Positions</h1>
            <p className="text-lg text-muted-foreground">
              We are always looking for talented individuals to join our team.
              Below are some of the roles we are currently hiring for.
            </p>
          </div>
          <div>
            {jobs.map((job) => (
              <div key={job.title} className="border-t py-6">
                <div className="flex items-center gap-2">
                  <a
                    href={job.link}
                    className="mb-1 text-lg font-semibold hover:underline"
                  >
                    {job.title}
                  </a>
                  <Badge variant="outline">{job.category}</Badge>
                </div>
                <p className="text-muted-foreground">{job.description}</p>
                <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <Clock className="h-auto w-4" />
                    {job.type}
                  </div>
                  <div className="flex gap-2">
                    <MapPin className="h-auto w-4" />
                    {job.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Careers6;
