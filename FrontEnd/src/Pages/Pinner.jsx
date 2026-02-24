import React, { useEffect } from "react";
import AreaPage from "../Components/AreaCovered";

const AREA     = "Pinner";
const SLUG     = "pinner";
const POSTCODE = "HA5";
const PHONE    = "+447789471859";

const META_DESCRIPTION =
  "Looking for driving lessons in Pinner, HA5? 360 Drive Academy offers expert manual & automatic driving lessons in Pinner with DVSA-approved local instructors. 90% first-time pass rate. Book today.";

const INTRO_TEXT =
  "360 Drive Academy provides professional driving lessons in Pinner, HA5, West London. Our fully qualified, DVSA-approved driving instructors live and work locally — so they know every road, roundabout, and test route around Pinner inside out. Whether you're a complete beginner or returning after a break, we'll get you test-ready with confidence.";

const BODY_TEXT =
  "From the Pinner High Street to the dual carriageways of the A40, we prepare every student for real-world driving. We offer beginner lessons, intensive crash courses, Pass Plus, and mock test preparation — all in a modern, dual-control vehicle. Lessons run 7 days a week including evenings, so we fit around your work, college, or family schedule.";

const SERVICES = [
  "Beginner driving lessons in Pinner, HA5",
  "Manual & automatic car options",
  "Intensive & crash course driving programmes",
  "Mock driving test on local Pinner test routes",
  "Pass Plus courses for newly qualified drivers",
  "Theory test guidance & hazard perception help",
  "Motorway & dual-carriageway confidence lessons",
  "Refresher lessons for drivers returning to the road",
];

const NEARBY_AREAS = [
  { name: "Harrow",           href: "/areas/harrow" },
  { name: "North Harrow",     href: "/areas/north-harrow" },
  { name: "Rayners Lane",     href: "/areas/rayners-lane" },
  { name: "Eastcote",         href: "/areas/eastcote" },
  { name: "Ruislip",          href: "/areas/ruislip" },
  { name: "Northwood Hills",  href: "/areas/northwood-hills" },
  { name: "Hatch End",        href: "/areas/hatch-end" },
  { name: "Kenton",           href: "/areas/kenton" },
  { name: "Wealdstone",       href: "/areas/wealdstone" },
  { name: "Stanmore",         href: "/areas/stanmore" },
  { name: "Wembley",          href: "/areas/wembley" },
  { name: "Uxbridge",         href: "/areas/uxbridge" },
];

// Google Maps embed — centred on Pinner, HA5
const MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19826.6!2d-0.3793!3d51.5935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760e2d19bd0f2f%3A0x3e3c63f7c5c4e6b!2sPinner%2C%20Harrow%20HA5!5e0!3m2!1sen!2suk!4v1700000000000";

const PinnerPage = () => {
  useEffect(() => {
    document.title = `Driving Lessons in Pinner HA5 | 360 Drive Academy`;

    const setMeta = (key, val, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };

    setMeta("description", META_DESCRIPTION);
    setMeta("robots", "index, follow");
    setMeta("og:title",       `Driving Lessons in Pinner HA5 | 360 Drive Academy`, "property");
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

export default PinnerPage;