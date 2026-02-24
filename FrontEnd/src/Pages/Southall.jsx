import React, { useEffect } from "react";
import AreaPage from "../Components/AreaCovered";

const AREA = "Southall";
const SLUG = "southall";
const POSTCODE = "UB2";
const PHONE = "+447789471859";

const META_DESCRIPTION =
  "Looking for driving lessons in Southall (UB2)? 360 Drive Academy offers DVSA-approved instructors, manual & automatic lessons, intensive courses and mock tests across Southall. Book today.";

const INTRO_TEXT =
  "360 Drive Academy provides professional driving lessons in Southall, UB2. Our fully qualified, DVSA-approved instructors live and teach locally — they know Southall's roads, junctions and test routes inside out. Whether you’re a complete beginner or returning after a break, we’ll get you confident and test-ready.";

const BODY_TEXT =
  "From Southall Broadway to the A312 and nearby arterial routes, our lessons prepare students for the real driving situations they will meet on test day. We offer beginner lessons, intensive courses, Pass Plus, motorway tuition and mock tests — all in modern dual-control vehicles. Lessons are available 7 days a week including evenings.";

const SERVICES = [
  "Beginner driving lessons in Southall, UB2",
  "Manual & automatic car options",
  "Intensive & crash course driving programmes",
  "Mock driving test on local Southall routes",
  "Pass Plus courses for newly qualified drivers",
  "Theory test guidance & hazard perception help",
  "Motorway & dual-carriageway confidence lessons",
  "Refresher lessons for drivers returning to the road",
];

const NEARBY_AREAS = [
  { name: "Hayes", href: "/areas/hayes" },
  { name: "Hanwell", href: "/areas/hanwell" },
  { name: "Ealing", href: "/areas/ealing" },
  { name: "Northolt", href: "/areas/northolt" },
  { name: "Greenford", href: "/areas/greenford" },
  { name: "Hounslow", href: "/areas/hounslow" },
  { name: "Southall Broadway", href: "/areas/southall-broadway" },
];

// Map centred on Southall (UB2)
const MAP_URL = "https://www.google.com/maps?q=Southall+UB2&output=embed";

const SouthallPage = () => {
  useEffect(() => {
    document.title = `Driving Lessons in Southall UB2 | 360 Drive Academy`;
    const setMeta = (key, val, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };
    setMeta("description", META_DESCRIPTION);
    setMeta("robots", "index, follow");
    setMeta("keywords", "driving lessons southall, driving instructor southall, automatic lessons southall, intensive course southall");
    setMeta("og:title", `Driving Lessons in Southall UB2 | 360 Drive Academy`, "property");
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

export default SouthallPage;