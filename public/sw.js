const CACHE_PREFIX = `bigtrip-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll([
        `/`,
        `/index.html`,
        `/sw.js`,
        `/bundle.js`,
        `/css/style.css`,
        `/img/icons/bus.png`,
        `/img/icons/check-in.png`,
        `/img/icons/drive.png`,
        `/img/icons/flight.png`,
        `/img/icons/restaurant.png`,
        `/img/icons/ship.png`,
        `/img/icons/sightseeing.png`,
        `/img/icons/taxi.png`,
        `/img/icons/train.png`,
        `/img/icons/transport.png`,
        `/img/photos/1.jpg`,
        `/img/photos/2.jpg`,
        `/img/photos/3.jpg`,
        `/img/photos/4.jpg`,
        `/img/photos/5.jpg`,
        `/img/header-bg.png`,
        `/img/header-bg@2x.png`,
        `/img/logo.png`,
      ])
    }).catch(err => console.log(err.message)))
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
    caches.keys()
      .then(
        (keys) => Promise.all(
          keys.map(
            (key) => {
              if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
                return caches.delete(key);
              }

              return null;
            })
            .filter((key) => key !== null)
        )
      )
      .catch(err => console.log(err.message))
  );
});

self.addEventListener(`fetch`, (evt) => {
  // debugger;
  const {request} = evt;


  evt.respondWith(
    caches.match(request)
      .then((cacheResponse) => {
        if (cacheResponse) {
          return cacheResponse;
        }

        return fetch(request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== `basic`) {
              return response;
            }

            const clonedResponse = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, clonedResponse));

            return response;
          })
          .catch(err => console.log(err.message))
      })
  );
});
