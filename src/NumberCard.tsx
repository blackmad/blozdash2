import React from 'react';
import BaseCard, {
  BigText,
  ExternalBaseCardProps,
  SubTitle,
  Title,
} from './BaseCard';
import { NumberDataEntry } from './data';

export const NumberCard = (
  params: { entry: NumberDataEntry } & ExternalBaseCardProps,
) => {
  const { entry } = params;
  const { title, subtitle, data } = entry;
  const { number, unit } = data;
  return (
    <BaseCard
      {...params}
      extraClasses="p-4 flex flex-col justify-center items-center"
    >
      <Title>{title}</Title>
      <SubTitle>{subtitle}</SubTitle>

      <BigText>{`${number} ${unit}`}</BigText>
    </BaseCard>
  );
};
