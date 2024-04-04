import React from 'react';
import { BaseImageCard } from './BaseCard';

export const AirportCard = ({ airportCodes }: { airportCodes: string }) => {
  const src = `https://corsproxy.io/?http%3A%2F%2Fwww.gcmap.com%2Fmap%3FP%3D${airportCodes.replaceAll(
    ',',
    '-',
  )}%26MS%3Dwls%26MR%3D600%26MX%3D720x360%26PM%3D*`;
  return <BaseImageCard imgSrc={src} extraClasses="col-span-2" />;
};
