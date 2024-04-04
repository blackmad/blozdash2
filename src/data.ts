import { Type, Static, TSchema } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

export const UntypedCommonProperties = Type.Object({
  id: Type.String(),
  title: Type.String(),
  sortOrder: Type.Number(),
  tag: Type.Union([Type.String(), Type.Undefined()]),
  subtitle: Type.Union([Type.String(), Type.Undefined()]),
  group: Type.Union([Type.String(), Type.Undefined()]),
});
export type UntypedCommonProperties = Static<typeof UntypedCommonProperties>;

export const CommonProperties = <T extends TSchema, CardTypeT extends TSchema>(
  T: T,
  cardType: CardTypeT,
) =>
  Type.Intersect([
    UntypedCommonProperties,
    Type.Object({
      data: T,
      cardType,
    }),
  ]);

/** ***** DATE CARD ****** */

export type DateData = Static<typeof DateData>;
export const DateData = Type.Object({
  start: Type.String(),
  end: Type.Union([Type.String(), Type.Null()]),
  time_zone: Type.Union([Type.String(), Type.Null()]),
});

export type DateDataEntry = Static<typeof DateDataEntry>;
export const DateDataEntry = CommonProperties(DateData, Type.Literal('date'));

/** ***** IMAGE CARD ****** */

export type ImageData = Static<typeof ImageData>;
export const ImageData = Type.Object({
  name: Type.String(),
  url: Type.String(),
});

export type ImageDataEntry = Static<typeof ImageDataEntry>;
export const ImageDataEntry = CommonProperties(
  ImageData,
  Type.Literal('image'),
);

/** ***** NUMBER CARD ****** */

export type NumberData = Static<typeof NumberData>;
export const NumberData = Type.Object({
  number: Type.Number(),
  unit: Type.Union([Type.String(), Type.Undefined()]),
});

export type NumberDataEntry = Static<typeof NumberDataEntry>;
export const NumberDataEntry = CommonProperties(
  NumberData,
  Type.Literal('number'),
);

/** ***** TRIP CARD ****** */

export type TripData = Static<typeof TripData>;
export const TripData = Type.Object({
  airportCodes: Type.Array(Type.String()),
});

export type TripDataEntry = Static<typeof TripDataEntry>;
export const TripDataEntry = CommonProperties(TripData, Type.Literal('trip'));

/** ***** TRIP CARD ****** */

export type CountryListData = Static<typeof CountryListData>;
export const CountryListData = Type.Object({
  countryCodes: Type.Array(Type.String()),
});

export type CountryListDataEntry = Static<typeof CountryListDataEntry>;
export const CountryListDataEntry = CommonProperties(
  CountryListData,
  Type.Literal('countrylist'),
);

/** ***** ALL CARDS ****** */

export type DataEntry = Static<typeof DataEntry>;
export const DataEntry = Type.Union([
  DateDataEntry,
  ImageDataEntry,
  TripDataEntry,
  CountryListDataEntry,
  NumberDataEntry,
]);

export const CardTypes = Type.Index(DataEntry, ['cardType']);
export type CardType = Static<typeof CardTypes>;

export function isValidCardType(str: string): str is CardType {
  return Value.Check(Type.Index(DataEntry, ['cardType']), str);
}
