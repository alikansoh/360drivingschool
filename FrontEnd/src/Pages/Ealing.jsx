import React, { useEffect } from "react";
import AreaPage from "../Components/AreaCovered";

const AREA     = "Ealing";
const SLUG     = "ealing";
const POSTCODE = "W5";
const PHONE    = "+447789471859";

const META_DESCRIPTION =
  "Looking for driving lessons in Ealing, W5? 360 Drive Academy offers expert manual & automatic driving lessons in Ealing with DVSA-approved local instructors. 90% first-time pass rate. Book today.";

const INTRO_TEXT =
  "360 Drive Academy provides professional driving lessons in Ealing, W5, West London. Our fully qualified, DVSA-approved driving instructors live and work locally — they know every road, roundabout, and test route around Ealing inside out. Whether you're a complete beginner or returning after a break, we'll get you test-ready with confidence.";

const BODY_TEXT =
  "From Ealing Broadway to the busy junctions around the A40 and North Circular, we prepare every student for real-world driving. We offer beginner lessons, intensive crash courses, Pass Plus, and mock test preparation — all in a modern, dual-control vehicle. Lessons run 7 days a week including evenings, so we fit around your work, college, or family schedule.";

const SERVICES = [
  "Beginner driving lessons in Ealing, W5",
  "Manual & automatic car options",
  "Intensive & crash course driving programmes",
  "Mock driving test on local Ealing test routes",
  "Pass Plus courses for newly qualified drivers",
  "Theory test guidance & hazard perception help",
  "Motorway & dual-carriageway confidence lessons",
  "Refresher lessons for drivers returning to the road",
];

const NEARBY_AREAS = [
  { name: "Acton",           href: "/areas/acton" },
  { name: "Ealing Broadway", href: "/areas/ealing-broadway" },
  { name: "Southall",        href: "/areas/southall" },
  { name: "Hanwell",         href: "/areas/hanwell" },
  { name: "Northfields",     href: "/areas/northfields" },
  { name: "South Ealing",    href: "/areas/south-ealing" },
  { name: "Greenford",       href: "/areas/greenford" },
  { name: "Chiswick",        href: "/areas/chiswick" },
  { name: "Hounslow",        href: "/areas/hounslow" },
  { name: "Perivale",        href: "/areas/perivale" },
  { name: "Brentford",       href: "/areas/brentford" },
];

// Google Maps embed — centred on Ealing (simple embed)
const MAP_URL = "https://www.google.com/maps?q=Ealing+W5&output=embed";

const EalingPage = () => {
  useEffect(() => {
    document.title = `Driving Lessons in Ealing W5 | 360 Drive Academy`;

    const setMeta = (key, val, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };

    setMeta("description", META_DESCRIPTION);
    setMeta("robots", "index, follow");
    setMeta("keywords", "driving lessons Ealing, driving instructor Ealing, automatic lessons Ealing, intensive driving course Ealing");
    setMeta("og:title",       `Driving Lessons in Ealing W5 | 360 Drive Academy`, "property");
    setMeta("og:description", META_DESCRIPTION, "property");
    setMeta("og:url",         `https://360driveacademy.co.uk/areas/${SLUG}`, "property");
    setMeta("og:type",        "website", "property");

    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", `https://360driveacademy.co.uk/areas/${SLUG}`);

    return () => { document.title = "360 Drive Academy"; };
  }, []);

  return (
    <AreaPage
      areaName={AREA}
      areaSlug={SLUG}
      postcode={POSTCODE}
      metaDescription={META_DESCRIPTION}
      introText={INTRO_TEXT}
      bodyText={BODY_TEXT}
      services={SERVICES}
      nearbyAreas={NEARBY_AREAS}
      mapEmbedUrl={MAP_URL}
      phone={PHONE}
      ctaHref="/contact"
    />
  );
};

export default EalingPage;