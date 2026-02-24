import React, { useEffect } from "react";
import AreaPage from "../components/AreaCovered";

const AREA = "Hendon";
const SLUG = "hendon";
const POSTCODE = "NW4";
const PHONE = "+447789471859";

const META_DESCRIPTION =
  "Looking for driving lessons in Hendon (NW4)? 360 Drive Academy offers DVSA-approved instructors in Hendon — manual & automatic lessons, intensive courses, mock tests and motorway tuition. Book today.";

const INTRO_TEXT =
  "360 Drive Academy provides professional driving lessons in Hendon, NW4. Our fully qualified, DVSA-approved instructors live and teach locally — they know Hendon's roads, junctions and test routes inside out. Whether you’re a complete beginner or returning after a break, we’ll get you confident and test-ready.";

const BODY_TEXT =
  "From Church End to the A41 corridors, our lessons prepare students for the real driving situations they will meet on test day. We offer beginner lessons, intensive courses, Pass Plus, motorway tuition and mock tests — all in modern dual-control vehicles. Lessons are available 7 days a week including evenings.";

const SERVICES = [
  "Beginner driving lessons in Hendon, NW4",
  "Manual & automatic car options",
  "Intensive & crash course driving programmes",
  "Mock driving test on local Hendon routes",
  "Pass Plus courses for newly qualified drivers",
  "Theory test guidance & hazard perception help",
  "Motorway & dual-carriageway confidence lessons",
  "Refresher lessons for drivers returning to the road",
];

const NEARBY_AREAS = [
  { name: "Colindale", href: "/areas/colindale" },
  { name: "Brent Cross", href: "/areas/brent-cross" },
  { name: "Mill Hill", href: "/areas/mill-hill" },
  { name: "Golders Green", href: "/areas/golders-green" },
  { name: "Cricklewood", href: "/areas/cricklewood" },
  { name: "Temple Fortune", href: "/areas/temple-fortune" },
  { name: "Barnet", href: "/areas/barnet" },
  { name: "Kingsbury", href: "/areas/kingsbury" },
];

// Google Maps embed — centred on Hendon (NW4)
const MAP_URL = "https://www.google.com/maps?q=Hendon+NW4&output=embed";

const HendonPage = () => {
  useEffect(() => {
    document.title = `Driving Lessons in Hendon NW4 | 360 Drive Academy`;

    const setMeta = (key, val, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };

    setMeta("description", META_DESCRIPTION);
    setMeta("robots", "index, follow");
    setMeta("keywords", "driving lessons hendon, driving instructor hendon, automatic lessons hendon, intensive course hendon");
    setMeta("og:title", `Driving Lessons in Hendon NW4 | 360 Drive Academy`, "property");
    setMeta("og:description", META_DESCRIPTION, "property");
    setMeta("og:url", `https://360driveacademy.co.uk/areas/${SLUG}`, "property");
    setMeta("og:type", "website", "property");

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

export default HendonPage;