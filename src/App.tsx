import React, { useEffect } from 'react';

import './app.css';
import unreachable from 'ts-unreachable';
import _ from 'lodash';
import { DateCard } from './DateCard';
import { ImageCard } from './ImageCard';
import BaseCard from './BaseCard';
import { TripCard } from './TripCard';
import { NumberCard } from './NumberCard';
import { DataEntry } from './data';
import { CountriesCard } from './CountriesCard';

const CardDispatcher = ({ entry }: { entry: DataEntry }) => {
  const { cardType } = entry;
  if (cardType === 'trip') {
    return <TripCard entry={entry} />;
  }
  if (cardType === 'number') {
    return <NumberCard entry={entry} />;
  }
  if (cardType === 'date') {
    return <DateCard entry={entry} />;
  }
  if (cardType === 'countrylist') {
    return <CountriesCard entry={entry} />;
  }
  if (cardType === 'image') {
    return <ImageCard entry={entry} />;
  }

  return unreachable(cardType);
};

const App = () => {
  const [data, setData] = React.useState<DataEntry[]>([]);

  useEffect(() => {
    const file = window.location.search.substring(1) || 'data';
    fetch(
      `https://6631e610f0384c4c91ef678932b88097.s3.amazonaws.com/${file}.json`,
    )
      .then((res) => res.json())
      .then((newData) => {
        console.log({ newData });
        setData(newData);
      });
  }, []);

  console.log(data);

  const groups = _.groupBy(data, (entry) => entry.group);

  const sortedGroupKeys = _.sortBy(Object.keys(groups), (group) => {
    return group;
  });

  return (
    <>
      {_.map(sortedGroupKeys, (groupName) => {
        const entries = groups[groupName];
        const realGroupName = groupName.split('-')[1] || groupName;
        return (
          <>
            {sortedGroupKeys.length > 1 && (
              <div className="text-3xl">{realGroupName}: </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3">
              {_.sortBy(entries, (entry) => entry.sortOrder).map((entry) => (
                <CardDispatcher key={entry.id} entry={entry} />
              ))}
            </div>
          </>
        );
      })}
    </>
  );
};

export default App;
