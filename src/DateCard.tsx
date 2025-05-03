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
  } as const;

  // Calculate total days
  const totalDays = Math.floor(diff / timeIntervals.d.interval);

  let dateString = _.map(timeIntervals, (intervalObj, timeString) => {
    const { interval } = intervalObj;

    // Skip hours and minutes if more than 14 days
    if (totalDays > 14 && (timeString === 'h' || timeString === 'm')) {
      return null;
    }

    // Show only days if less than 60 days
    if (totalDays < 60 && (timeString === 'h' || timeString === 'm')) {
      return null;
    }

    if (diff >= interval) {
      const time = Math.floor(diff / interval);
      const result = `${time}${timeString} `;
      diff %= interval;
      return (
        <span key={timeString} className={fontSizes.shift()}>
          {result}
        </span>
      );
    }
    return null;
  });

  if (totalDays <= 1 || dateString.length === 0) {
    dateString = [<span className={fontSizes[0]}>1d</span>];
  }

  return <div className="text-center">{dateString}</div>;
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

        {/* <SubTitle>
          {entry.data.preposition}
        </SubTitle> */}

        <DateDiff date1={parsedStartDate} date2={now} />

        {
          <SubTitle>
            {parsedEndDate ? 'total' : isPast ? 'ago' : 'from now'}
          </SubTitle>
        }
      </div>

      <FooterText>
        {parsedStartDate.toDateString()}
        {parsedEndDate && <span>- {parsedEndDate.toDateString()}</span>}
      </FooterText>
    </BaseCard>
  );
};
