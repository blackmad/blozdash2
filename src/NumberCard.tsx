import React from 'react';
import BaseCard from './BaseCard';
import { NumberDataEntry } from './data';

export const NumberCard = ({
  entry,
  extraClasses,
}: {
  entry: NumberDataEntry;
  extraClasses?: string;
}) => {
  const { title, data } = entry;
  const { number, unit } = data;
  return (
    <BaseCard extraClasses={extraClasses} entry={entry}>
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-gray-700">{`${number} ${unit}`}</p>
    </BaseCard>
  );
};
