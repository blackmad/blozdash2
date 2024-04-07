import React, { ReactNode } from 'react';
import { UntypedCommonProperties } from './data';
import { makeBorderString } from './neumorphism';
import { useWindowSize } from '@react-hook/window-size';
import { useMeasure } from 'react-use'; // or just 'react-use-measure'

export interface ExternalBaseCardProps {
  entry: UntypedCommonProperties;
  onClick: (id: string) => void;
  singleCard: boolean;
}

interface BaseCardProps extends ExternalBaseCardProps {
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

export const BaseCard = ({
  onClick,
  colSpan,
  children,
  entry,
  extraClasses,
  singleCard,
}: BaseCardProps & { children: ReactNode }) => {
  const [windowWidth, windowHeight] = useWindowSize();
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  console.log('Current width of element', width);

  const scale = Math.min(windowWidth / width, windowHeight / height);

  if (singleCard) {
    return (
      <div
        ref={ref}
        className="flex flex-col justify-center align-middle items-center max-h-72"
        style={{
          transform: `scale(${scale * 0.8})`,
        }}
      >
        {children}
      </div>
    );
  }

  const { group } = entry;
  const backgroundColorName = group?.color;
  const backgroundColor = getNotionLightBackgroundColor(
    backgroundColorName ?? 'gray',
  );

  console.log(backgroundColorName, backgroundColor);

  const { css: borderCss } = makeBorderString({
    color: backgroundColor,
    blur: 15,
    radius: 50,
    distance: 5,
    gradient: false,
    colorDifference: 0.25,
  });

  return (
    <div
      onClick={() => onClick(entry.id)}
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
