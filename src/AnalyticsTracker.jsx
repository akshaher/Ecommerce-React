import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

export default function AnalyticsTracker() {
  const location = useLocation();

  console.log("Tracker rendered:", location.pathname);

  useEffect(() => {
    console.log("GA effect fired:", location.pathname);

    ReactGA.send({
      hitType: "pageview",
      page: location.pathname,
    });
  }, [location.pathname]);

  return null;
}