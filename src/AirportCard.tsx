import React from 'react';
import { airports } from '@nwpr/airport-codes';
import { BaseImageCard } from './BaseCard';
import { NumberCard } from './NumberCard';

export const AirportCard = ({
  title,
  airportCodes: _airportCodes,
}: {
  title: string;
  airportCodes: string;
}) => {
  const airportCodes = _airportCodes.split('-');
  if (airportCodes.length !== 2) {
    return <div>Invalid airport codes - should have 2, got{airportCodes}</div>;
  }

  const airport1Data = airports.find(
    (airport) => airport.iata?.toLowerCase() === airportCodes[0].toLowerCase(),
  );
  const airport2Data = airports.find(
    (airport) => airport.iata?.toLowerCase() === airportCodes[1].toLowerCase(),
  );

  if (!airport1Data) {
    return (
      <div>
        Could not find airport data for
        {airportCodes[0]}
      </div>
    );
  }
  if (!airport2Data) {
    return (
      <div>
        Could not find airport data for
        {airportCodes[1]}
      </div>
    );
  }

  // calculate distance in km between airports
  const lat1 = airport1Data.latitude ?? 0;
  const lon1 = airport1Data.longitude ?? 0;
  const lat2 = airport2Data.latitude ?? 0;
  const lon2 = airport2Data.longitude ?? 0;
  const R = 6371; // Radius of the earth in km
  const deg2rad = (deg: number) => deg * (Math.PI / 180);
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const distance = Math.round(
    2 *
      R *
      Math.asin(
        Math.sqrt(
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
              Math.cos(deg2rad(lat2)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2),
        ),
      ),
  );

  const src = `https://corsproxy.io/?http%3A%2F%2Fwww.gcmap.com%2Fmap%3FP%3D${airportCodes.join(
    '-',
  )}%26MS%3Dwls%26MR%3D600%26MX%3D720x360%26PM%3D*`;
  return (
    <>
      <NumberCard title={title} number={distance} unit="km" />
      <BaseImageCard imgSrc={src} extraClasses="col-span-2" />
    </>
  );
};
