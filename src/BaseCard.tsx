import React, { ReactNode } from 'react';
import { UntypedCommonProperties } from './data';
import hexToRgba from 'hex-to-rgba';
import chroma from 'chroma-js';
import { makeBorderString } from './neumorphism';

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
        className="h-full w-full object-cover"
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
  const shadowColor = chroma(backgroundColor).darken().saturate(2).hex();

  const { css: borderCss } = makeBorderString({
    color: backgroundColor,
    blur: 80,
    size: 250,
    radius: 50,
    distance: 25,
    gradient: false,
    colorDifference: 0.25,
  });

  console.log({ borderCss });

  return (
    <div
      className={`h-72 col-span-${colSpan ?? 1}`}
      style={{
        ...borderCss,
        // boxShadow: `0.4em 0.4em calc(0.4em * 2) ${shadowColor}, calc(0.4em * -1) calc(
        //   0.4em * -1
        // )
        // calc(0.4em * 2) ${shadowColor}`,
        // backgroundColor,
        // color: LightTextColorMap[backgroundColorName ?? 'default'],
        color: NotionLightTextColor,
        // backgroundImage: backgroundImage
        //   ? `linear-gradient(${backdropFilterColor}, ${backdropFilterColor}), url(${backgroundImage.url})`
        //   : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
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

export function getNotionLightBackgroundColor(name: string) {
  return LightModeBackgroundMap[name];
}
