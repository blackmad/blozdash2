import React from 'react';

export const NumberCard = ({
  title,
  number,
  unit,
}: {
  title: string;
  number: number;
  unit: string | undefined;
}) => {
  return (
    <div className="m-4 p-4 border border-gray-300">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-gray-700">{`${number} ${unit}`}</p>
    </div>
  );
};
