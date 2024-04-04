import React from 'react';
import BaseCard from './BaseCard';
import { DateData } from './App';

export const DateCard = ({
  dateData,
  title,
  subtitle,
}: {
  dateData: DateData;
  title: string;
  subtitle: string;
}) => {
  const parsedStartDate = new Date(dateData.start);

  // Calculate relative time since the event
  const now = new Date();
  const diff = parsedStartDate.getTime() - now.getTime();
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const stringDiff = formatter.format(Math.round(diff / 86400000), 'day');

  return (
    <BaseCard backgroundColor="#dc5945">
      <h2 className="text-3xl font-bold ">{title}</h2>
      <p className="text-gray-700">{subtitle}</p>
      <p className="text-gray-700">{stringDiff}</p>
      <p className="text-gray-700">{parsedStartDate.toDateString()}</p>
    </BaseCard>
  );
};
