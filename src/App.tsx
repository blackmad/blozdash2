import React, { useCallback, useEffect } from 'react';

import './app.css';
import unreachable from 'ts-unreachable';
import _ from 'lodash';
import { DateCard } from './DateCard';
import { ImageCard } from './ImageCard';
import { TripCard } from './TripCard';
import { NumberCard } from './NumberCard';
import { DataEntry } from './data';
import { CountriesCard } from './CountriesCard';
import { getNotionLightBackgroundColor } from './BaseCard';

const CardDispatcher = ({
  entry,
  onClick,
}: {
  entry: DataEntry;
  onClick: (id: string) => void;
}) => {
  const { cardType } = entry;
  if (cardType === 'trip' || cardType === 'trip-with-distance') {
    return <TripCard entry={entry} onClick={onClick} />;
  }
  if (cardType === 'number') {
    return <NumberCard entry={entry} onClick={onClick} />;
  }
  if (cardType === 'date') {
    return <DateCard entry={entry} onClick={onClick} />;
  }
  if (cardType === 'countrylist') {
    return <CountriesCard entry={entry} onClick={onClick} />;
  }
  if (cardType === 'image') {
    return <ImageCard entry={entry} onClick={onClick} />;
  }

  return unreachable(cardType);
};

const App = () => {
  const [data, setData] = React.useState<DataEntry[]>([]);
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);
  const [id, setId] = React.useState<string | null>(null);

  const setIdUrl = useCallback(
    (id: string) => {
      const params = {
        url: dataUrl ?? '',
        id,
      };

      console.log({ params });

      window.open(`?${new URLSearchParams(params).toString()}`);
    },
    [dataUrl],
  );

  useEffect(() => {
    const searchString = window.location.search.substring(1);

    const searchParams = new URLSearchParams(searchString);
    const dataUrl = searchParams.get('url') || searchString;

    setDataUrl(dataUrl);
    setId(searchParams.get('id'));

    fetch(dataUrl)
      .then((res) => res.json())
      .then((newData) => {
        console.log({ newData });
        setData(newData);
      });
  }, []);

  console.log(data);

  const filteredEntries = data.filter((entry) => {
    return !id || entry.id === id;
  });

  const groups = _.groupBy(filteredEntries, (entry) => entry.group?.name);
  console.log({ groups });

  const sortedGroupKeys = _.sortBy(Object.keys(groups), (group) => {
    return group;
  });

  return (
    <div className="flex justify-center align-middle">
      <div className="w-full">
        {_.map(sortedGroupKeys, (groupName, i) => {
          const entries = groups[groupName];
          const realGroupName = groupName.split('-')[1] || groupName;

          const nextColor = groups[sortedGroupKeys[i + 1]]?.[0]?.group?.color;

          return (
            <>
              <div
                className="p-8"
                style={{
                  backgroundColor: getNotionLightBackgroundColor(
                    entries[0].group?.color ?? 'gray',
                  ),
                }}
              >
                {sortedGroupKeys.length > 1 && (
                  <div className="text-5xl" style={{ paddingBottom: 30 }}>
                    {realGroupName}
                  </div>
                )}
                <div
                  className={
                    id ? 'h-full' : `grid grid-cols-1 md:grid-cols-3 gap-4`
                  }
                >
                  {_.sortBy(entries, (entry) => entry.sortOrder).map(
                    (entry) => (
                      <CardDispatcher
                        key={entry.id}
                        entry={entry}
                        onClick={setIdUrl}
                      />
                    ),
                  )}
                </div>
              </div>
              {nextColor && (
                <div
                  style={{
                    height: 40,
                    background: `linear-gradient(180deg, 
                    ${getNotionLightBackgroundColor(
                      entries[0].group?.color ?? 'gray',
                    )}, 
                    ${getNotionLightBackgroundColor(nextColor)})`,
                  }}
                ></div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default App;
