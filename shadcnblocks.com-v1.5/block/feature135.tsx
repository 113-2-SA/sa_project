import {
  BarChart,
  Calendar,
  Infinity,
  Layout,
  ListChecks,
  MessagesSquare,
  Shield,
  Star,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const Feature135 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="relative grid gap-10 lg:grid-cols-2">
          <div className="top-10 mx-auto flex h-fit max-w-screen-md flex-col items-center gap-4 lg:sticky lg:items-start">
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-2.5 py-1.5 text-sm"
            >
              <Star className="h-auto w-4" />
              Key Highlights
            </Badge>
            <h2 className="text-center text-3xl font-semibold lg:text-left lg:text-4xl">
              Empower Your Workflow with Core Features
            </h2>
            <p className="text-center text-muted-foreground lg:text-left lg:text-lg">
              Maximize your productivity with essential features designed for
              seamless operations.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <div className="mx-auto flex w-fit items-center gap-2 rounded-full border px-3 py-2.5 lg:mx-0">
                <Star className="h-auto w-4" />
                User-Friendly Interface for Easy Navigation
              </div>
              <div className="mx-auto flex w-fit items-center gap-2 rounded-full border px-3 py-2.5 lg:mx-0">
                <Layout className="h-auto w-4" />
                Real-time Collaboration for Smooth Teamwork
              </div>
              <div className="mx-auto flex w-fit items-center gap-2 rounded-full border px-3 py-2.5 lg:mx-0">
                <BarChart className="h-auto w-4" />
                Powerful Insights for Informed Decisions
              </div>
              <div className="mx-auto flex w-fit items-center gap-2 rounded-full border px-3 py-2.5 lg:mx-0">
                <Shield className="h-auto w-4" />
                Strong Data Protection for Secure Operations
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="gap flex flex-col gap-3 rounded-lg border p-7">
              <div className="flex flex-col items-center gap-2.5 lg:flex-row">
                <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                  <Calendar className="h-auto w-6" />
                </span>
                <h3 className="text-lg font-medium">
                  Task Management Simplified
                </h3>
              </div>
              <p className="text-center text-sm text-muted-foreground md:text-base lg:text-left">
                Keep track of tasks, assign priorities, and monitor progress
                easily to stay organized and on schedule.
              </p>
            </div>
            <div className="gap flex flex-col gap-3 rounded-lg border p-7">
              <div className="flex flex-col items-center gap-2.5 lg:flex-row">
                <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                  <MessagesSquare className="h-auto w-6" />
                </span>
                <h3 className="text-lg font-medium">
                  Unified Messaging System
                </h3>
              </div>
              <p className="text-center text-sm text-muted-foreground md:text-base lg:text-left">
                Communicate efficiently with an intuitive messaging system that
                supports teams of all sizes and locations.
              </p>
            </div>
            <div className="gap flex flex-col gap-3 rounded-lg border p-7">
              <div className="flex flex-col items-center gap-2.5 lg:flex-row">
                <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                  <Infinity className="h-auto w-6" />
                </span>
                <h3 className="text-lg font-medium">Effortless Data Sync</h3>
              </div>
              <p className="text-center text-sm text-muted-foreground md:text-base lg:text-left">
                Synchronize data across multiple devices and platforms for a
                smooth workflow experience for all users.
              </p>
            </div>
            <div className="gap flex flex-col gap-3 rounded-lg border p-7">
              <div className="flex flex-col items-center gap-2.5 lg:flex-row">
                <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                  <Users className="h-auto w-6" />
                </span>
                <h3 className="text-lg font-medium">Team Member Management</h3>
              </div>
              <p className="text-center text-sm text-muted-foreground md:text-base lg:text-left">
                Add and manage team members with ease, ensuring smooth
                onboarding and collaboration processes.
              </p>
            </div>
            <div className="gap flex flex-col gap-3 rounded-lg border p-7">
              <div className="flex flex-col items-center gap-2.5 lg:flex-row">
                <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                  <ListChecks className="h-auto w-6" />
                </span>
                <h3 className="text-lg font-medium">
                  Stay on Track with Deadlines
                </h3>
              </div>
              <p className="text-center text-sm text-muted-foreground md:text-base lg:text-left">
                Set reminders and deadlines to keep your team aligned and
                focused on key goals and objectives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature135;
