/*
----------------------------------------------------
 Gestor de Trimado Naval
 Service Worker
 Versión 1.0.0
----------------------------------------------------

Funciones:

✓ Caché de recursos estáticos
✓ Funcionamiento offline
✓ Actualización automática
✓ Limpieza de versiones antiguas
✓ Preparado para futuras mejoras

*/

const CACHE_NAME = "trimado-cache-v1";

const STATIC_FILES = [

    "/",
    "/index.html",
    "/offline.html",

    "/manifest.json",

    "/css/styles.css",

    "/js/app.js",
    "/js/database.js",
    "/js/ui.js",
    "/js/share.js",
    "/js/export.js",
    "/js/utils.js",
    "/js/pwa.js",

    "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"

];

/*--------------------------------------------------
INSTALL
--------------------------------------------------*/

self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(STATIC_FILES);

            })

    );

});

/*--------------------------------------------------
ACTIVATE
--------------------------------------------------*/

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (key !== CACHE_NAME) {

                            return caches.delete(key);

                        }

                    })

                );

            })

    );

    self.clients.claim();

});

/*--------------------------------------------------
FETCH
--------------------------------------------------*/

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {

        return;

    }

    event.respondWith(

        caches.match(event.request)

            .then(cacheResponse => {

                if (cacheResponse) {

                    return cacheResponse;

                }

                return fetch(event.request)

                    .then(networkResponse => {

                        if (

                            !networkResponse ||

                            networkResponse.status !== 200 ||

                            networkResponse.type !== "basic"

                        ) {

                            return networkResponse;

                        }

                        const responseClone = networkResponse.clone();

                        caches.open(CACHE_NAME)

                            .then(cache => {

                                cache.put(

                                    event.request,

                                    responseClone

                                );

                            });

                        return networkResponse;

                    });

            })

            .catch(() => {

                if (

                    event.request.mode === "navigate"

                ) {

                    return caches.match("/offline.html");

                }

            })

    );

});