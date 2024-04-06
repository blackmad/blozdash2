import React from 'react';
import BaseCard from './BaseCard';
import { NumberDataEntry } from './data';

export const NumberCard = ({ entry }: { entry: NumberDataEntry }) => {
  const { title, subtitle, data } = entry;
  const { number, unit } = data;
  return (
    <BaseCard
      entry={entry}
      extraClasses="p-4 flex flex-col justify-center items-center"
    >
      <h2 className="text-3xl font-bold pb-2 uppercase">{title}</h2>
      <p className="text-gray-700 pb-2">{subtitle}</p>

      <p className="text-gray-700 text-5xl">{`${number} ${unit}`}</p>
    </BaseCard>
  );
};
