import React from 'react';
import BaseCard, { BaseImageCard } from './BaseCard';
import { ImageData } from './App';

export const ImageCard = ({
  image,
  title,
}: {
  title: string;
  image: ImageData;
}) => {
  return <BaseImageCard imgSrc={image.url} alt={title} />;
};
