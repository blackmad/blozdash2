import React, { useEffect, useState } from 'react';
import { D } from '@mobily/ts-belt';

import BaseCard from './BaseCard';
import { DateDataEntry } from './data';

function dateDiffToString(date1: Date, date2: Date) {
  let diff = Math.abs(date1.getTime() - date2.getTime());

  const timeIntervals = {
    month: 1000 * 60 * 60 * 24 * 30,
    day: 1000 * 60 * 60 * 24,
    hour: 1000 * 60 * 60,
    minute: 1000 * 60,
    second: 1000,
  } as const;

  let result = '';

  const keys = D.keys(timeIntervals);
  for (const key of keys) {
    if (diff >= timeIntervals[key]) {
      const time = Math.floor(diff / timeIntervals[key]);
      result += `${time} ${key}${time !== 1 ? 's' : ''} `;
      diff %= timeIntervals[key];
    }
  }

  return result.trim();
}

export const DateCard = ({ entry }: { entry: DateDataEntry }) => {
  const { title, subtitle } = entry;
  const parsedStartDate = new Date(entry.data.start);

  // Calculate relative time since the event
  const [stringDiff, setStringDiff] = useState('');

  useEffect(() => {
    setTimeout(() => {
      console.log('DateCard rendered');
      const now = new Date();
      const diff = parsedStartDate.getTime() - now.getTime();
      const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

      // build a string of months days hours minutes

      // const newStringDiff = formatter.format(
      //   Math.round(diff / 86400000),
      //   'day',
      // );
      const newStringDiff = dateDiffToString(now, parsedStartDate);
      setStringDiff(newStringDiff);
    }, 1000);
  });

  return (
    <BaseCard backgroundColor="#dc5945">
      <h2 className="text-3xl font-bold ">{title}</h2>
      <p className="text-gray-700">{subtitle}</p>
      <p className="text-gray-700">{stringDiff}</p>

      <p className="text-gray-700">{parsedStartDate.toDateString()}</p>
    </BaseCard>
  );
};
