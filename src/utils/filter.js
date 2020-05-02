import {FilterType} from "../const.js";

const getFutureEvents = (events) => {
  return events.filter(({start}) => start.getTime() >= Date.now());
};

const getPastEvents = (events) => {
  return events.filter(({start}) => start.getTime() < Date.now());
};

const getFilteredEvents = (events, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return events;
    case FilterType.FUTURE:
      return getFutureEvents(events);
    case FilterType.PAST:
      return getPastEvents(events);
  }

  return events;
};

export {
  getFilteredEvents
};
