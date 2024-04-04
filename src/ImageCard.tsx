import React from 'react';
import BaseCard from './BaseCard';
import { ImageData } from './App';

export const ImageCard = ({
  image,
  title,
}: {
  title: string;
  image: ImageData;
}) => {
  return (
    <BaseCard backgroundColor="black">
      <img src={image.url} alt={title} />
    </BaseCard>
  );
};
