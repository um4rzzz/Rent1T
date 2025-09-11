import React from "react";
import { ThemeSync } from "@/components/ThemeSync";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import HeroSearch from "./home page/herosearch";
import CategoryGrid from "./home page/categoryGrid";
import FeaturedListings from "./home page/FeaturedListings";

export default function LandingPage() {
  return (
    <div id="top" className="min-h-screen">
      <ThemeSync />
      <Header />
      <main>
        <HeroSearch />
        <CategoryGrid />
        <FeaturedListings />
      </main>
      <Footer />
    </div>
  );
}
