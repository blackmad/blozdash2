import React, { ReactNode } from 'react';
import { UntypedCommonProperties } from './data';
import hexToRgba from 'hex-to-rgba';

interface BaseCardProps {
  entry: UntypedCommonProperties;
  extraClasses?: string;
  colSpan?: number;
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
  colSpan,
  children,
  entry,
  extraClasses,
}) => {
  const { group, backgroundImage } = entry;
  const backgroundColorName = group?.color;
  const backgroundColor = getNotionLightBackgroundColor(
    backgroundColorName ?? 'gray',
  );

  console.log(backgroundColorName, backgroundColor);

  const backdropFilterColor = hexToRgba(backgroundColor, 0.7);

  return (
    <div
      className={`h-72 shadow-md rounded-md col-span-${colSpan ?? 1}`}
      style={{
        backgroundColor,
        // color: LightTextColorMap[backgroundColorName ?? 'default'],
        color: NotionLightTextColor,
        // backgroundImage: backgroundImage
        //   ? `linear-gradient(${backdropFilterColor}, ${backdropFilterColor}), url(${backgroundImage.url})`
        //   : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className={`h-full w-full flex flex-col align-middle items-center justify-center ${extraClasses}`}
        style={
          {
            // backdropFilter: backgroundImage
            //   ? 'saturate(120%) blur(10px) brightness(80%) '
            //   : undefined,
          }
        }
      >
        {children}
      </div>
    </div>
  );
};

export default BaseCard;

const _LightTextColorMap: Record<string, string> = {
  default: '#37352F',
  gray: '#787774',
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
  gray: '#F1F1EF',
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
