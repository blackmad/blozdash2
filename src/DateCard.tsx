import React, { useEffect, useMemo, useState } from 'react';

import BaseCard, { ExternalBaseCardProps } from './BaseCard';
import { DateDataEntry } from './data';
import _ from 'lodash';

function DateDiff({ date1, date2 }: { date1: Date; date2: Date }): JSX.Element {
  let diff = Math.abs(date1.getTime() - date2.getTime());

  const fontSizes = ['text-5xl', 'text-4xl', 'text-3xl', 'text-3xl'];

  const timeIntervals = {
    mo: {
      interval: 1000 * 60 * 60 * 24 * 30,
      fontSize: 'text-5xl',
    },

    d: {
      interval: 1000 * 60 * 60 * 24,
      fontSize: 'text-4xl',
    },
    h: {
      interval: 1000 * 60 * 60,
      fontSize: 'text-3xl',
    },
    m: { interval: 1000 * 60, fontSize: 'text-3xl' },
    // s: 1000,
  } as const;

  return (
    <div>
      {_.map(timeIntervals, (intervalObj, timeString) => {
        const { interval } = intervalObj;
        if (diff >= interval) {
          const time = Math.floor(diff / interval);
          // result += `${time} ${key}${time !== 1 ? 's' : ''} `;
          // const result =
          //   timeString === 'm' || timeString === 'h'
          //     ? timeString === 'm'
          //       ? `${time}`
          //       : `${time}:`
          //     : `${time}${timeString} `;
          const result = `${time}${timeString} `;

          diff %= interval;
          return <span className={fontSizes.shift()}>{result}</span>;
        }
      })}
    </div>
  );
}

export const DateCard = (
  params: { entry: DateDataEntry } & ExternalBaseCardProps,
) => {
  const { entry } = params;
  const { title } = entry;
  const parsedStartDate = useMemo(() => new Date(entry.data.start), [entry]);

  // Calculate relative time since the event
  const [now, setNow] = useState<Date>(new Date());
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const now = new Date();
      const diff = parsedStartDate.getTime() - now.getTime();

      setNow(now);
      setIsPast(diff < 0);
    }, 1000);
  }, [parsedStartDate]);

  return (
    <BaseCard {...params} extraClasses="p-4 flex flex-col  items-center">
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

        <DateDiff date1={parsedStartDate} date2={now} />
      </div>

      <p className="text-gray-700 pt-4">
        <span className="text-2xl italic">
          {parsedStartDate.toDateString()}
        </span>
      </p>
    </BaseCard>
  );
};
