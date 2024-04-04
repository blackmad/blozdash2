import React, { useEffect } from 'react';

import './app.css';
import BaseCard from './BaseCard';

// import { ThemeProvider } from 'styled-components';
// import defaultTheme from './styles/theme/defaultTheme';
// import GlobalStyles from './styles/GlobalStyles';
// import Home from './pages/Home';

type DataEntry = {
  id: string;
  title: string;
  properties: {
    Images: string[];
    Subtitle: string;
    Tags: string[];
    Number: number;
    Unit: string;
  };
};

const App = () => {
  const [data, setData] = React.useState<DataEntry[]>([]);

  useEffect(() => {
    fetch('https://6631e610f0384c4c91ef678932b88097.s3.amazonaws.com/data.json')
      .then((res) => res.text())
      .then((newData) => {
        console.log({ newData });
        // setData(newData);
      });
  }, []);

  console.log(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <BaseCard title="hi" content="woo" />
      <BaseCard title="hi" content="woo" />
      <BaseCard title="hi" content="woo" />
    </div>
  );
};

export default App;
