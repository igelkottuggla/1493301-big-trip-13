const CACHE_PREF = `bigtrip-cache`;
const CACHE_VER = `v13`;
const CACHE_LABLEL = `${CACHE_PREF}-${CACHE_VER}`;

const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = `basic`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_LABLEL)
        .then((cache) => {
          return cache.addAll([
            `./`,
            `./index.html`,
            `./bundle.js`,
            `./css/style.css`,
            `./fonts/Montserrat-Bold.woff2`,
            `./fonts/Montserrat-ExtraBold.woff2`,
            `./fonts/Montserrat-Medium.woff2`,
            `./fonts/Montserrat-Regular.woff2`,
            `./fonts/Montserrat-SemiBold.woff2`,
            `./img/header-bg.png`,
            `./img/header-bg@2x.png`,
            `./img/logo.png`,
            `./img/icons/bus.png`,
            `./img/icons/check-in.png`,
            `./img/icons/drive.png`,
            `./img/icons/flight.png`,
            `./img/icons/restaurant.png`,
            `./img/icons/sightseeing.png`,
            `./img/icons/taxi.png`,
            `./img/icons/train.png`,
            `./img/icons/transport.png`,
          ]);
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      caches.keys()
        .then(
            (keys) => Promise.all(
                keys.map(
                    (key) => {
                      if (key.startsWith(CACHE_PREF) && key !== CACHE_LABLEL) {
                        return caches.delete(key);
                      }

                      return null;
                    })
                  .filter((key) => key !== null)
            )
        )
  );
});

const handleFetch = (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          }
          return fetch(request)
            .then((response) => {

              if (!response || response.status !== HTTP_STATUS_OK || response.type !== RESPONSE_SAFE_TYPE) {
                return response;
              }
              const clonedResponse = response.clone();

              caches.open(CACHE_LABLEL)
                .then((cache) => cache.put(request, clonedResponse));

              return response;
            });
        })
  );
};

self.addEventListener(`fetch`, handleFetch);