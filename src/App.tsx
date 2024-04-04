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
    fetch('https://6631e610f0384c4c91ef678932b88097.s3.amazonaws.com/data.json')
      .then((res) => res.json())
      .then((newData) => {
        console.log({ newData });
        setData(newData);
      });
  }, []);

  console.log(data);

  const groups = _.groupBy(data, (entry) => entry.group);
  const sortedGroups = _.sortBy(groups, (entries) =>
    _.min(entries.map((entry) => entry.sortOrder)),
  );

  return (
    <>
      {_.map(sortedGroups, (entries, groupName) => {
        return (
          <>
            <div className="text-3xl">{entries[0].group}: </div>
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
