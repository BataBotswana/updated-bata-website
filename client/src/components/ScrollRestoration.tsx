/**
 * Botswana in Motion interaction utility: every route begins at the first editorial frame.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollRestoration() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}
