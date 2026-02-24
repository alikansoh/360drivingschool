import React, { useEffect } from "react";
import AreaPage from "../components/AreaCovered";

const AREA = "Greenford";
const SLUG = "greenford";
const POSTCODE = "UB6";
const PHONE = "+447789471859";

const META_DESCRIPTION =
  "Looking for driving lessons in Greenford, UB6? 360 Drive Academy offers DVSA-approved instructors, manual & automatic lessons, intensive courses and mock tests across Greenford. Book today.";

const INTRO_TEXT =
  "360 Drive Academy provides professional driving lessons in Greenford, UB6. Our fully qualified, DVSA-approved instructors live and teach locally — they know Greenford's roads, junctions and test routes inside out. Whether you’re a complete beginner or returning after a break, we’ll get you confident and test-ready.";

const BODY_TEXT =
  "From Oldfield Lane to the busy Hayes bypass and nearby A40 corridors, our lessons cover real-world scenarios you will face on test day. We offer beginner lessons, intensive courses, Pass Plus, motorway tuition and mock tests — all in modern dual-control vehicles. Lessons are available 7 days a week including evenings.";

const SERVICES = [
  "Beginner driving lessons in Greenford, UB6",
  "Manual & automatic car options",
  "Intensive & crash course driving programmes",
  "Mock driving test on local Greenford routes",
  "Pass Plus courses for newly qualified drivers",
  "Theory test guidance & hazard perception help",
  "Motorway & dual-carriageway confidence lessons",
  "Refresher lessons for drivers returning to the road",
];

const NEARBY_AREAS = [
  { name: "Perivale", href: "/areas/perivale" },
  { name: "Alperton", href: "/areas/alperton" },
  { name: "Southall", href: "/areas/southall" },
  { name: "Northolt", href: "/areas/northolt" },
  { name: "Ealing", href: "/areas/ealing" },
  { name: "Acton", href: "/areas/acton" },
  { name: "Sudbury", href: "/areas/sudbury" },
  { name: "Hayes", href: "/areas/hayes" },
  { name: "Wembley", href: "/areas/wembley" },
  { name: "Greenford Green", href: "/areas/greenford-green" },
];

// Simple Google Maps embed centred on Greenford (UB6)
const MAP_URL = "https://www.google.com/maps?q=Greenford+UB6&output=embed";

const GreenfordPage = () => {
  useEffect(() => {
    document.title = `Driving Lessons in Greenford UB6 | 360 Drive Academy`;

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
    setMeta("keywords", "driving lessons Greenford, driving instructor Greenford, automatic lessons Greenford, intensive course Greenford");
    setMeta("og:title", `Driving Lessons in Greenford UB6 | 360 Drive Academy`, "property");
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

export default GreenfordPage;