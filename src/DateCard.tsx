import React, { useEffect, useMemo, useState } from 'react';

import BaseCard, {
  ExternalBaseCardProps,
  FooterText,
  SubTitle,
  Title,
} from './BaseCard';
import { DateDataEntry } from './data';
import _ from 'lodash';

function DateDiff({ date1, date2 }: { date1: Date; date2: Date }): JSX.Element {
  let diff = Math.abs(date1.getTime() - date2.getTime());

  const fontSizes = [
    'text-3xl md:text-5xl',
    'text-2xl md:text-4xl',
    'text-xl md:text-3xl',
    'text-xl md:text-3xl',
  ];

  const timeIntervals = {
    mo: {
      interval: 1000 * 60 * 60 * 24 * 30,
    },

    d: {
      interval: 1000 * 60 * 60 * 24,
    },
    h: {
      interval: 1000 * 60 * 60,
    },
    m: { interval: 1000 * 60 },
    // s: 1000,
  } as const;

  return (
    <div className="text-center">
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
  const parsedStartDate = useMemo(
    () => new Date(entry.data.start),
    [entry.data.start],
  );
  const parsedEndDate = useMemo(
    () => (entry.data.end ? new Date(entry.data.end) : undefined),
    [entry.data.end],
  );

  // Calculate relative time since the event
  const [now, setNow] = useState<Date>(new Date());
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const now = parsedEndDate ?? new Date();
      const diff = parsedStartDate.getTime() - now.getTime();

      setNow(now);
      setIsPast(diff < 0);
    }, 1000);
  }, [parsedStartDate, parsedEndDate, now, isPast]);

  return (
    <BaseCard {...params} extraClasses="p-4 flex flex-col  items-center">
      <div
        style={{ flexGrow: 0 }}
        className="flex flex-col h-full items-center justify-center"
      >
        <Title>{title}</Title>
        {/* <p className="text-gray-700">{subtitle}</p> */}

        <SubTitle>
          {entry.data.preposition || (!isPast ? 'in' : 'for')}
        </SubTitle>

        <DateDiff date1={parsedStartDate} date2={now} />
      </div>

      <FooterText>
        {parsedStartDate.toDateString()}
        {parsedEndDate && <span>- {parsedEndDate.toDateString()}</span>}
      </FooterText>
    </BaseCard>
  );
};
