import React, { ReactNode } from 'react';

interface BaseCardProps {
  children: ReactNode;
  backgroundColor: string;
}

const BaseCard: React.FC<BaseCardProps> = ({ children, backgroundColor }) => {
  return (
    <div
      className="m-4 p-4 border border-gray-300"
      style={{
        backgroundColor,
      }}
    >
      {children}
    </div>
  );
};

export default BaseCard;
