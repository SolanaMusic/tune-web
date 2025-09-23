"use client";

import Flag from "react-world-flags";
import iso3to2 from "country-iso-3-to-2";

interface CountryFlagProps {
  code: string;
  size?: number;
}

export const CountryFlag = ({ code, size = 25 }: CountryFlagProps) => {
  if (!code) return null;

  const alpha2 = iso3to2(code) || code.toUpperCase();
  const isValidAlpha2 = /^[A-Z]{2}$/.test(alpha2);

  if (!isValidAlpha2) return null;

  return <Flag code={alpha2} style={{ width: size, height: (size * 3) / 4 }} />;
};
