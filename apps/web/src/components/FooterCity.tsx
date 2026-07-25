"use client";

import React, { useState, useEffect } from "react";

const CITIES = [
  { name: "Bali, Indonesia 🌴", stamp: "DPS" },
  { name: "Tokyo, Japan 🗼", stamp: "NRT" },
  { name: "Lisbon, Portugal 🇵🇹", stamp: "LIS" },
  { name: "San Francisco, USA 🌁", stamp: "SFO" },
  { name: "London, UK 🎡", stamp: "LHR" },
  { name: "Berlin, Germany 🇩🇪", stamp: "BER" },
  { name: "Cape Town, South Africa 🏔️", stamp: "CPT" }
];

export default function FooterCity() {
  const [currentCityIdx, setCurrentCityIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCityIdx((prev) => (prev + 1) % CITIES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const city = CITIES[currentCityIdx];

  return (
    <span className="inline-flex items-center gap-1.5 transition-all duration-500 font-mono text-[10px] text-zinc-400">
      Currently building from{" "}
      <span className="font-bold text-[#E8823A] transition-colors">{city.name}</span>
      <span className="px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-[8px] font-bold tracking-wider text-zinc-300">
        {city.stamp}
      </span>
    </span>
  );
}
