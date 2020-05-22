import {FilterType} from "../const.js";

const getFutureEvents = (events) => {
  return events.filter(({start}) => start.getTime() >= Date.now());
};

const getPastEvents = (events) => {
  return events.filter(({end}) => end.getTime() < Date.now());
};

const getByDateEvents = (events) => {
  return events.slice().sort((a, b) => a.start.getTime() - b.start.getTime());
};

const getFilteredEvents = (events, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return getByDateEvents(events);
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
