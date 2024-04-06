import React, { ReactNode } from 'react';
import { UntypedCommonProperties } from './data';

interface BaseCardProps {
  entry: UntypedCommonProperties;
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

const NotionLightTextColor = 'rgb(28, 56, 41)';

export const BaseCard: React.FC<BaseCardProps & { children: ReactNode }> = ({
  children,
  entry,
  extraClasses,
}) => {
  const { group } = entry;
  const backgroundColorName = group?.color;
  const backgroundColor = getNotionLightBackgroundColor(
    backgroundColorName ?? 'grey',
  );

  return (
    <div
      className={`h-72 ${extraClasses} shadow-md rounded-md`}
      style={{
        backgroundColor,
        // color: LightTextColorMap[backgroundColorName ?? 'default'],
        color: NotionLightTextColor,
      }}
    >
      {children}
    </div>
  );
};

export default BaseCard;

const LightTextColorMap: Record<string, string> = {
  default: '#37352F',
  grey: '#787774',
  brown: '#9F6B53',
  orange: '#D9730D',
  yellow: '#CB912F',
  green: '#448361',
  blue: '#337EA9',
  purple: '#9065B0',
  pink: '#C14C8A',
  red: '#D44C47',
};

const LightModeBackgroundMap: Record<string, string> = {
  grey: '#F1F1EF',
  brown: '#F4EEEE',
  orange: '#FAEBDD',
  yellow: '#FBF3DB',
  green: '#EDF3EC',
  blue: '#E7F3F8',
  purple: '#F6F3F9',
  pink: '#FAF1F5',
  red: '#FDEBEC',
};

function getNotionLightBackgroundColor(name: string) {
  return LightModeBackgroundMap[name];
}
