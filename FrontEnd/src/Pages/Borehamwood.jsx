import React, { useEffect } from "react";
import AreaPage from "../Components/AreaCovered";

const AREA = "Borehamwood";
const SLUG = "borehamwood";
const POSTCODE = "WD6";
const PHONE = "+447789471859";

const META_DESCRIPTION =
  "Looking for driving lessons in Borehamwood (WD6)? 360 Drive Academy offers DVSA-approved instructors, manual & automatic lessons, intensive courses and mock tests across Borehamwood. Book today.";

const INTRO_TEXT =
  "360 Drive Academy provides professional driving lessons in Borehamwood, WD6. Our fully qualified, DVSA-approved instructors live and teach locally — they know Borehamwood's roads, junctions and test routes inside out. Whether you’re a complete beginner or returning after a break, we’ll get you confident and test-ready.";

const BODY_TEXT =
  "From Shenley Road to the A1 and surrounding roads, our lessons prepare students for the real driving situations they will meet on test day. We offer beginner lessons, intensive courses, Pass Plus, motorway tuition and mock tests — all in modern dual-control vehicles. Lessons are available 7 days a week including evenings.";

const SERVICES = [
  "Beginner driving lessons in Borehamwood, WD6",
  "Manual & automatic car options",
  "Intensive & crash course driving programmes",
  "Mock driving test on local Borehamwood routes",
  "Pass Plus courses for newly qualified drivers",
  "Theory test guidance & hazard perception help",
  "Motorway & dual-carriageway confidence lessons",
  "Refresher lessons for drivers returning to the road",
];

const NEARBY_AREAS = [
  { name: "Elstree", href: "/areas/elstree" },
  { name: "Radlett", href: "/areas/radlett" },
  { name: "Shenley", href: "/areas/shenley" },
  { name: "Watford", href: "/areas/watford" },
  { name: "Bushey", href: "/areas/bushey" },
  { name: "Stanmore", href: "/areas/stanmore" },
  { name: "Edgware", href: "/areas/edgware" },
];

// Map centred on Borehamwood (WD6)
const MAP_URL = "https://www.google.com/maps?q=Borehamwood+WD6&output=embed";

const BorehamwoodPage = () => {
  useEffect(() => {
    document.title = `Driving Lessons in Borehamwood WD6 | 360 Drive Academy`;
    const setMeta = (key, val, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };
    setMeta("description", META_DESCRIPTION);
    setMeta("robots", "index, follow");
    setMeta("keywords", "driving lessons borehamwood, driving instructor borehamwood, automatic lessons borehamwood, intensive course borehamwood");
    setMeta("og:title", `Driving Lessons in Borehamwood WD6 | 360 Drive Academy`, "property");
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

export default BorehamwoodPage;