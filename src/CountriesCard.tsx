import React from 'react';
import BaseCard, { BaseImageCard } from './BaseCard';

export const CountriesCard = ({
  countryCodes,
  title,
}: {
  countryCodes: string;
  title: string;
}) => {
  const src = `https://www.fla-shop.com/visited-countries/embed/?st=${countryCodes.replaceAll(
    ' ',
    '',
  )}&vc=1ca032&uc=b3c3ca&hc=40bfa6&bc=ffffff&ss=on`;
  return (
    <BaseCard extraClasses="col-span-3">
      <iframe title={title} src={src} />
    </BaseCard>
  );
};
