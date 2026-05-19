import { lazy, Suspense } from "react";

import TopBar from "../components/layout/TopBar/TopBar";
import Hero from "../components/Hero/Hero";

// Lazy-loaded components
const TrustSection = lazy(() =>
  import("../components/TrustSection/TrustSection")
);

const Categories = lazy(() =>
  import("../components/Categories/Categories")
);

const Footer = lazy(() =>
  import("../components/layout/Footer/Footer")
);

export default function Home() {
  return (
    <>
      <TopBar />
      <Hero />
      <Suspense fallback={<div style={{ minHeight: "200px" }} />}>
        <TrustSection />
        <Categories />
        <Footer />
      </Suspense>
    </>
  );
}