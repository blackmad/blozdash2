import React, { useEffect, useState } from 'react';
import { D } from '@mobily/ts-belt';

import BaseCard from './BaseCard';
import { DateDataEntry } from './data';

function dateDiffToString(date1: Date, date2: Date) {
  let diff = Math.abs(date1.getTime() - date2.getTime());

  const timeIntervals = {
    mo: 1000 * 60 * 60 * 24 * 30,
    d: 1000 * 60 * 60 * 24,
    h: 1000 * 60 * 60,
    m: 1000 * 60,
    // s: 1000,
  } as const;

  let result = '';

  const keys = D.keys(timeIntervals);
  for (const key of keys) {
    if (diff >= timeIntervals[key]) {
      const time = Math.floor(diff / timeIntervals[key]);
      // result += `${time} ${key}${time !== 1 ? 's' : ''} `;
      result += `${time}${key} `;
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
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const now = new Date();
      const diff = parsedStartDate.getTime() - now.getTime();
      // const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

      // build a string of months days hours minutes

      // const newStringDiff = formatter.format(
      //   Math.round(diff / 86400000),
      //   'day',
      // );
      const newStringDiff = dateDiffToString(now, parsedStartDate);
      setStringDiff(newStringDiff);
      setIsPast(diff < 0);
    }, 1000);
  });

  return (
    <BaseCard entry={entry} extraClasses="p-4 flex flex-col  items-center">
      <div
        style={{ flexGrow: 0 }}
        className="flex flex-col h-full items-center justify-center"
      >
        <h2 className="text-3xl font-bold uppercase text-center pb-2">
          {title}
        </h2>
        {/* <p className="text-gray-700">{subtitle}</p> */}

        <p className="text-2xl pb-2">
          {entry.data.preposition || (!isPast ? 'in' : 'for')}
        </p>

        <p className="text-5xl">{stringDiff}</p>
      </div>

      <p className="text-gray-700 pt-4">
        <span className="text-2xl italic">
          {parsedStartDate.toDateString()}
        </span>
      </p>
    </BaseCard>
  );
};
