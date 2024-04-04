import React, { useEffect } from 'react';

import './app.css';
import { DateCard } from './DateCard';
import { ImageCard } from './ImageCard';
import BaseCard from './BaseCard';
import { AirportCard } from './AirportCard';
import { NumberCard } from './NumberCard';

// import { ThemeProvider } from 'styled-components';
// import defaultTheme from './styles/theme/defaultTheme';
// import GlobalStyles from './styles/GlobalStyles';
// import Home from './pages/Home';

export type DateData = {
  start: string;
  end: string | null;
  time_zone: string | null;
};

export type ImageData = { name: string; url: string };

type DataEntry = {
  id: string;
  title: string;
  properties: {
    Images: Array<ImageData>;
    Subtitle: string;
    Tags: string[];
    Number?: number;
    Unit?: string;
    Date?: DateData;
    AirportCodes?: string;
    CountryCodes?: string;
  };
};

const CardDispatcher = ({ data }: { data: DataEntry }) => {
  if (data.properties.Date) {
    return (
      <DateCard
        dateData={data.properties.Date}
        title={data.title}
        subtitle={data.properties.Subtitle}
      />
    );
  }
  if (data.properties.Images.length > 0) {
    return <ImageCard title={data.title} image={data.properties.Images[0]} />;
  }
  if (data.properties.Number) {
    return (
      <NumberCard
        title={data.title}
        number={data.properties.Number}
        unit={data.properties.Unit}
      />
    );
  }
  if (data.properties.AirportCodes) {
    return (
      <AirportCard
        title={data.title}
        airportCodes={data.properties.AirportCodes}
      />
    );
  }

  return null;
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      {data.map((entry) => (
        <CardDispatcher key={entry.id} data={entry} />
      ))}
    </div>
  );
};

export default App;
