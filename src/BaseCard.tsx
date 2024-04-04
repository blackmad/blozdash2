import React, { ReactNode } from 'react';

interface BaseCardProps {
  backgroundColor?: string;
  extraClasses?: string;
}

export const BaseImageCard: React.FC<
  BaseCardProps & { imgSrc: string; alt?: string }
> = (params) => {
  return (
    <BaseCard {...params} extraClasses={`${params.extraClasses}`}>
      <img
        src={params.imgSrc}
        alt={params.alt}
        className="h-full w-full object-contain"
      />
    </BaseCard>
  );
};

export const BaseCard: React.FC<BaseCardProps & { children: ReactNode }> = ({
  children,
  backgroundColor,
  extraClasses,
}) => {
  return (
    <div
      className={`m-4 border border-gray-300 h-72 ${extraClasses}`}
      style={{
        backgroundColor,
      }}
    >
      {children}
    </div>
  );
};

export default BaseCard;
