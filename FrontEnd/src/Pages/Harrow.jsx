import React, { useEffect } from "react";
import AreaPage from "../components/AreaCovered";

const AREA = "Harrow";
const SLUG = "harrow";
const POSTCODE = "HA1";
const PHONE = "+447789471859";

const META_DESCRIPTION =
  "Looking for driving lessons in Harrow (HA1)? 360 Drive Academy offers DVSA-approved instructors across Harrow—manual & automatic lessons, intensive courses, mock tests and motorway training. Book today.";

const INTRO_TEXT =
  "360 Drive Academy provides expert driving lessons in Harrow (HA1). Our DVSA‑approved instructors live locally and know Harrow's roads and test routes inside out. Whether you're a beginner, taking an intensive course, or preparing for a mock test, we'll get you ready for test day.";

const BODY_TEXT =
  "From Harrow town centre to the A404 corridors, our lessons prepare you for real driving conditions. We offer beginner lessons, intensive crash courses, Pass Plus, motorway tuition and mock tests in modern dual-control cars. Lessons run 7 days a week including evenings to suit your schedule.";

const SERVICES = [
  "Beginner driving lessons in Harrow, HA1",
  "Manual & automatic car options",
  "Intensive & crash course driving programmes",
  "Mock driving test on local Harrow routes",
  "Pass Plus courses for newly qualified drivers",
  "Theory test guidance & hazard perception help",
  "Motorway & dual-carriageway confidence lessons",
  "Refresher lessons for drivers returning to the road",
];

const NEARBY_AREAS = [
  { name: "Wealdstone", href: "/areas/wealdstone" },
  { name: "Kenton", href: "/areas/kenton" },
  { name: "Pinner", href: "/areas/pinner" },
  { name: "North Harrow", href: "/areas/north-harrow" },
  { name: "South Harrow", href: "/areas/south-harrow" },
  { name: "Rayners Lane", href: "/areas/rayners-lane" },
  { name: "Stanmore", href: "/areas/stanmore" },
  { name: "Wembley", href: "/areas/wembley" },
  { name: "Ruislip", href: "/areas/ruislip" },
];

// Google Maps embed — centred on Harrow (HA1)
const MAP_URL = "https://www.google.com/maps?q=Harrow+HA1&output=embed";

const HarrowPage = () => {
  useEffect(() => {
    document.title = `Driving Lessons in Harrow HA1 | 360 Drive Academy`;

    const setMeta = (key, val, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    setMeta("description", META_DESCRIPTION);
    setMeta("robots", "index, follow");
    setMeta("keywords", "driving lessons harrow, driving instructor harrow, automatic lessons harrow, intensive course harrow");
    setMeta("og:title", `Driving Lessons in Harrow HA1 | 360 Drive Academy`, "property");
    setMeta("og:description", META_DESCRIPTION, "property");
    setMeta("og:url", `https://360driveacademy.co.uk/areas/${SLUG}`, "property");
    setMeta("og:type", "website", "property");

    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://360driveacademy.co.uk/areas/${SLUG}`);

    return () => {
      document.title = "360 Drive Academy";
    };
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

export default HarrowPage;