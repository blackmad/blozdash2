import React from 'react';
import { BaseImageCard, ExternalBaseCardProps } from './BaseCard';
import { ImageDataEntry } from './data';

export const ImageCard = (
  params: {
    entry: ImageDataEntry;
  } & ExternalBaseCardProps,
) => {
  const { entry } = params;
  const { data, title } = entry;
  const { url } = data;
  return <BaseImageCard imgSrc={url} alt={title} {...params} />;
};
