import React from 'react';
import BaseCard from './BaseCard';

export const NumberCard = ({
  title,
  number,
  unit,
  extraClasses,
}: {
  title: string;
  number: number;
  unit: string | undefined;
  extraClasses?: string;
}) => {
  return (
    <BaseCard extraClasses={extraClasses}>
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-gray-700">{`${number} ${unit}`}</p>
    </BaseCard>
  );
};
