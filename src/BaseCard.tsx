import React from 'react';

interface BaseCardProps {
  title: string;
  content: string;
}

const BaseCard: React.FC<BaseCardProps> = ({ title, content }) => {
  return (
    <div className="m-4 p-4 border border-gray-300">
      <h2 className="text-3xl font-bold underline">{title}</h2>
      <p className="text-gray-700">{content}</p>
    </div>
  );
};

export default BaseCard;
