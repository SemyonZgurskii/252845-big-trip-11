const generateOffersMarkup = () => {
  return (
    `<li class="event__offer">
    <span class="event__offer-title">Order Uber</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">20</span>
   </li>`
  );
};

export const createEventTemplate = () => {
  const type = `Taxi`;
  const city = `San Francisko`;
  const startDateTime = `2019-03-18T10:30`;
  const startTime = `10:30`;
  const endDateTime = `2019-03-18T11:00`;
  const endTime = `11:00`;
  const duration = `30M`;
  const price = `20`;
  const offersMarkup = generateOffersMarkup();

  return (
    `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} to ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startDateTime}">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${endDateTime}">${endTime}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersMarkup}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
};
