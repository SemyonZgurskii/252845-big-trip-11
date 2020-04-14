const EVENT_TYPES = {
  transfer: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  activity: [`check-in`, `sightseeing`, `restaurant`],
};

const CITIES = [`Boston`, `Bolonga`, `Geneva`, `Prague`, `London`, `Wellington`, `Paris`, `San Francisco`];

const MonthNumberToString = {
  [1]: `JAN`,
  [2]: `FEB`,
  [3]: `MAR`,
  [4]: `APR`,
  [5]: `MAY`,
  [6]: `JUN`,
  [7]: `JUL`,
  [8]: `AUG`,
  [9]: `SEP`,
  [10]: `OCT`,
  [11]: `NOV`,
  [12]: `DEC`,
};

export {EVENT_TYPES, CITIES, MonthNumberToString};
