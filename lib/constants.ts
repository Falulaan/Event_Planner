// Centralized event data for the app
// These items are designed to be used directly with the EventCard component
// EventCard expects: title, image, slug, location, date, time

export type EventItem = {
  title: string;
  image: string; // Path under public/images
  slug: string;
  location: string;
  date: string; // Human-readable date string
  time: string; // Human-readable time string
};

// NOTE: Image assets must exist in public/images. Images below reference existing PNG files.

export const events: EventItem[] = [
  {
    title: "React Summit 2026",
    image: "/images/event1.png",
    slug: "react-summit-2026",
    location: "Amsterdam, NL",
    date: "June 12, 2026",
    time: "09:00 – 18:00 CEST",
  },
  {
    title: "JSConf EU 2026",
    image: "/images/event2.png",
    slug: "jsconf-eu-2026",
    location: "Berlin, DE",
    date: "May 22, 2026",
    time: "10:00 – 17:30 CEST",
  },
  {
    title: "Next.js Conf 2026",
    image: "/images/event3.png",
    slug: "nextjs-conf-2026",
    location: "San Francisco, CA, USA",
    date: "October 7, 2026",
    time: "09:30 – 17:00 PDT",
  },
  {
    title: "KubeCon + CloudNativeCon Europe 2026",
    image: "/images/event4.png",
    slug: "kubecon-cloudnativecon-eu-2026",
    location: "Vienna, AT",
    date: "March 18–20, 2026",
    time: "All-day (conference days)",
  },
  {
    title: "AWS re:Invent 2025",
    image: "/images/event5.png",
    slug: "aws-reinvent-2025",
    location: "Las Vegas, NV, USA",
    date: "December 1–5, 2025",
    time: "All-day (multi-track)",
  },
  {
    title: "Google Cloud Next 2026",
    image: "/images/event6.png",
    slug: "google-cloud-next-2026",
    location: "Las Vegas, NV, USA",
    date: "April 8–10, 2026",
    time: "All-day (conference days)",
  },
  {
    title: "HackMIT 2026",
    image: "/images/event1.png",
    slug: "hackmit-2026",
    location: "Cambridge, MA, USA",
    date: "September 19–20, 2026",
    time: "24-hour hackathon",
  },
  {
    title: "PyCon US 2026",
    image: "/images/event2.png",
    slug: "pycon-us-2026",
    location: "Pittsburgh, PA, USA",
    date: "May 1–9, 2026",
    time: "All-day (tutorials + talks)",
  },
];

export default events;
