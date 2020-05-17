const EVENT_TYPES = {
  transfer: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  activity: [`check-in`, `sightseeing`, `restaurant`],
};

const TypeToIcon = {
  "TAXI": `🚕`,
  "BUS": `🚌`,
  "TRAIN": `🚂`,
  "SHIP": `🚢`,
  "TRANSPORT": `🚆`,
  "DRIVE": `🚗`,
  "FLIGHT": `✈️`,
  "CHECK-IN": `🏨`,
  "SIGHTSEEING": `🏛`,
  "RESTAURANT": `🍴`,
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

const HIDDEN_CLASS = `visually-hidden`;

export {
  HIDDEN_CLASS,
  EVENT_TYPES,
  FilterType,
  TypeToIcon,
};
