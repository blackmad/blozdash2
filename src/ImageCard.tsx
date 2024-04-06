import React from 'react';
import BaseCard, { BaseImageCard } from './BaseCard';
import { ImageDataEntry } from './data';

export const ImageCard = ({ entry }: { entry: ImageDataEntry }) => {
  const { data, title } = entry;
  const { url } = data;
  return <BaseImageCard imgSrc={url} alt={title} entry={entry} />;
};
