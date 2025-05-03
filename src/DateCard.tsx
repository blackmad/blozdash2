import React, { useEffect, useMemo, useState } from 'react';
// import { MdCalendarToday } from 'react-icons/md';

import BaseCard, {
  ExternalBaseCardProps,
  FooterText,
  // SubTitle,
  Title,
} from './BaseCard';
import { DateDataEntry } from './data';
import _ from 'lodash';

function DateDiff({ date1, date2 }: { date1: Date; date2: Date }): JSX.Element {
  let diff = Math.abs(date1.getTime() - date2.getTime());

  const dayInterval = 1000 * 60 * 60 * 24;

  const timeIntervals = {
    month: {
      interval: 1000 * 60 * 60 * 24 * 30,
    },
    day: {
      interval: dayInterval,
    },
    h: {
      interval: 1000 * 60 * 60,
    },
    m: { interval: 1000 * 60 },
  } as const;

  // Calculate total days
  const totalDays = Math.floor(diff / dayInterval);

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
      diff %= interval;
      // Render number bold/large, unit normal/smaller
      return (
        <span key={timeString} className="inline-flex items-end mr-1">
          <span className="font-bold text-3xl md:text-5xl leading-none">
            {time}
          </span>
          <span className="text-lg md:text-2xl font-normal ml-0.5 mb-0.5">
            {timeString}
            {diff === 0 ? '' : 's'}
          </span>
        </span>
      );
    }
    return null;
  });

  if (totalDays < 60) {
    dateString = [
      <span key="d" className="inline-flex items-end">
        <span className="font-bold text-3xl md:text-5xl leading-none">
          {totalDays}
        </span>
        <span className="text-lg md:text-2xl font-normal ml-0.5 mb-0.5">
          day{totalDays === 1 ? '' : 's'}
        </span>
      </span>,
    ];
  }

  if (totalDays <= 1 || dateString.length === 0) {
    dateString = [
      <span key="d" className="inline-flex items-end">
        <span className="font-bold text-3xl md:text-5xl leading-none">1</span>
        <span className="text-lg md:text-2xl font-normal ml-0.5 mb-0.5">d</span>
      </span>,
    ];
  }

  return (
    <div className="flex flex-col items-center justify-center mb-2">
      <span className="bg-white/80 rounded-full shadow-md flex items-center justify-center min-w-[5.5rem] px-6 py-4 mb-1">
        {/* <MdCalendarToday className="text-gray-400 mr-2" size={28} /> */}
        <span className="flex items-center justify-center w-full h-full">
          {dateString}
        </span>
      </span>
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
  const [now, setNow] = useState<Date>(parsedEndDate ?? new Date());
  const diff = parsedStartDate.getTime() - now.getTime();
  const [isPast, setIsPast] = useState(diff < 0);

  useEffect(() => {
    setTimeout(() => {
      const now = parsedEndDate ?? new Date();
      const diff = parsedStartDate.getTime() - now.getTime();
      setNow(now);
      setIsPast(diff < 0);
    }, 1000);
  }, [parsedStartDate, parsedEndDate, now, isPast]);

  return (
    <BaseCard {...params} extraClasses="p-4 flex flex-col items-center">
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

        <span className="text-gray-500 text-base italic mt-0.5 mb-2">
          {parsedEndDate ? 'total' : isPast ? 'ago' : 'from now'}
        </span>
      </div>
      <div className="w-full flex justify-center items-center mt-2 mb-1">
        <div className="border-t border-gray-200 w-2/3 mx-2" />
      </div>
      <FooterText>
        <span className="text-sm text-gray-500">
          {parsedStartDate.toDateString()}
        </span>
        {parsedEndDate && (
          <span className="text-sm text-gray-500">
            {' '}
            - {parsedEndDate.toDateString()}
          </span>
        )}
      </FooterText>
    </BaseCard>
  );
};
