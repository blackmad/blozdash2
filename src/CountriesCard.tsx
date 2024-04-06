import React from 'react';
import BaseCard, { BaseImageCard } from './BaseCard';
import { CountryListDataEntry } from './data';

export const CountriesCard = ({ entry }: { entry: CountryListDataEntry }) => {
  const { title } = entry;
  const countryCodes = entry.data.countryCodes.join(',');

  const src = `https://www.fla-shop.com/visited-countries/embed/?st=${countryCodes}&vc=1ca032&uc=b3c3ca&hc=40bfa6&bc=ffffff&ss=on`;
  return (
    <BaseCard extraClasses="col-span-3 overflow-hidden" entry={entry}>
      <div
        style={{
          position: 'relative',
        }}
      >
        <div
          style={{
            zIndex: 1000,
            position: 'relative',
            textAlign: 'center',
          }}
        >
          Countries Visited
        </div>
        <div
          style={{
            position: 'relative',
            padding: '0 0 100% 0',
            height: 0,
            overflow: 'hidden',
            marginTop: '-25%',
          }}
        >
          <iframe
            title={title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            src={src}
          />
        </div>
      </div>
    </BaseCard>
  );
};
