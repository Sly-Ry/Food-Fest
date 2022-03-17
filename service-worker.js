const APP_PREFIX = 'FoodFest-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/events.bundle.js",
    "./dist/tickets.bundle.js",
    "./dist/schedule.bundle.js"
];
// service workers run before the window object has even been created. So instead we use the 'self' keyword to instantiate listeners on the service worker. 
// The context of 'self' here refers to the service worker object.
// Here, we listen for the fetch event, log the URL of the requested resource, and then begin to define how we will respond to the request.
self.addEventListener('fetch', function(e) {
    console.log('fetch request : ' + e.request.url)
    // we're using a method on the event object called respondWith to intercept the fetch request.
    e.respondWith(
        //  The following lines will check to see if the request is stored in the cache or not. 
        // If it is stored in the cache, e.respondWith will deliver the resource directly from the cache; otherwise the resource will be retrieved normally.
        
        // First, we use .match() to determine if the resource already exists in caches. 
        caches.match(e.request).then(function (request) {
            // If it does, we'll log the URL to the console with a message and then return the cached resource.
            if (request) {
                console.log('responding with cache : ' + e.request.url)
                return request
            }
            else {
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)
        })

    );
});

self.addEventListener('install', function(e) {
    // We use e.waitUntil to tell the browser to wait until the work is complete before terminating the service worker. 
    // This ensures that the service worker doesn't move on from the installing phase until it's finished executing all of its code.
    e.waitUntil( 
        // We use caches.open to find the specific cache by name
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            // Then add every file in the FILES_TO_CACHE array to the cache
            return cache.addAll(FILES_TO_CACHE)
        })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        // .keys() returns an array of all cache names, which we're calling keyList.
        // 'keyList' is a parameter that contains all cache names under <username>.github.io.
        caches.keys().then(function (keyList) {
            // We'll save caches that have the 'app_prefix' to an array called cacheKeeplist using the .filter() method.
            let cacheKeeplist = keyList.filter(function (key) {
                // We'll capture the ones that have that prefix, stored in APP_PREFIX
                return key.indexOf(APP_PREFIX);
            })
            
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function (key, i) {
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log('deleting cache : ' + keyList[i] );
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});
