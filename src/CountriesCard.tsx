import React from 'react';
import BaseCard, { BaseImageCard } from './BaseCard';
import { CountryListDataEntry } from './data';

export const CountriesCard = ({ entry }: { entry: CountryListDataEntry }) => {
  const { title } = entry;
  const countryCodes = entry.data.countryCodes.join(',');

  const src = `https://www.fla-shop.com/visited-countries/embed/?st=${countryCodes}&vc=1ca032&uc=b3c3ca&hc=40bfa6&bc=ffffff&ss=on`;
  return (
    <BaseCard extraClasses="col-span-3" entry={entry}>
      <iframe
        title={title}
        src={src}
        className="w-full"
        style={{
          height: '-webkit-fill-available',
        }}
      />
    </BaseCard>
  );
};
