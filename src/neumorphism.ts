import { CSSProperties } from 'react';

export function colorLuminance(hex: string, lum: number) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  let rgb = '#',
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ('00' + c).substr(c.length);
  }

  return rgb;
}

export function getContrast(hex: string) {
  const r = parseInt(hex.substr(1, 2), 16),
    g = parseInt(hex.substr(3, 2), 16),
    b = parseInt(hex.substr(5, 2), 16),
    yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#001f3f' : '#F6F5F7';
}

export const isValidColor = (hex: string) => /^#[0-9A-F]{6}$/i.test(hex);

export const camelize = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

export function makeBorderString({
  color,
  colorDifference = 0.15,
  gradient = false,
  shape = 0,
  activeLightSource = 1,
  distance = 20,
  maxRadius = 150,
  size = 300,
  radius = 50,
  blur = 60,
}: {
  color: string;
  colorDifference?: number;
  gradient?: boolean;
  shape?: 0 | 1 | 2 | 3;
  activeLightSource?: 1 | 2 | 3 | 4;
  distance?: number;
  maxRadius?: number;
  size?: number;
  radius?: number;
  blur?: number;
}): { css: CSSProperties } {
  let angle, positionX, positionY;
  const darkColor = colorLuminance(color, colorDifference * -1);
  const lightColor = colorLuminance(color, colorDifference);

  const firstGradientColor =
    gradient && shape !== 1
      ? colorLuminance(color, shape === 3 ? 0.07 : -0.1)
      : color;
  const secondGradientColor =
    gradient && shape !== 1
      ? colorLuminance(color, shape === 2 ? 0.07 : -0.1)
      : color;

  // TODO: replace with a map
  switch (activeLightSource) {
    case 1:
      positionX = distance;
      positionY = distance;
      angle = 145;
      break;
    case 2:
      positionX = distance * -1;
      positionY = distance;
      angle = 225;
      break;
    case 3:
      positionX = distance * -1;
      positionY = distance * -1;
      angle = 315;
      break;
    case 4:
      positionX = distance;
      positionY = distance * -1;
      angle = 45;
      break;
    default:
      positionX = distance;
      positionY = distance;
      angle = 145;
      break;
  }

  //   document.documentElement.style.cssText = `
  //       --positionX: ${positionX}px;
  //       --positionXOpposite: ${positionX * -1}px;
  //       --positionY: ${positionY}px;
  //       --positionYOpposite: ${positionY * -1}px;
  //       --angle: ${angle}deg;
  //       --blur: ${blur}px;
  //       --textColor: ${getContrast(color)};
  //       --textColorOpposite: ${color};
  //       --baseColor: ${color};
  //       --darkColor: ${darkColor};
  //       --lightColor: ${lightColor};
  //       --firstGradientColor: ${firstGradientColor};
  //       --secondGradientColor: ${secondGradientColor};
  //       --size: ${size}px;
  //       --radius: ${radius}px;
  //     `;

  const borderRadius = radius === maxRadius ? '50%' : radius + 'px';
  const background =
    gradient && shape !== 1
      ? `linear-gradient(${angle}deg, ${firstGradientColor}, ${secondGradientColor})`
      : `${color}`;
  const boxShadowPosition = shape === 1 ? 'inset' : '';
  const firstBoxShadow = `${boxShadowPosition} ${positionX}px ${positionY}px ${blur}px ${darkColor}`;
  const secondBoxShadow = `${boxShadowPosition} ${positionX * -1}px ${
    positionY * -1
  }px ${blur}px ${lightColor}`;

  const borderCss: CSSProperties = {
    borderRadius: borderRadius,
    background: background,
    boxShadow: `${firstBoxShadow}, ${secondBoxShadow}`,
  };

  return {
    css: borderCss,
  };
}
