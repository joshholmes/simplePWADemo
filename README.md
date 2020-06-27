# simplePWADemo
Very simple PWA Demo

This simple PWA demo is to show how to start a PWA (Progressive Web App). You'll be able to see each step based on the releases. 

## Step 1 - build a simple HTML Page served up via a simple Node.js app. 

PWA is built on the web. The first thing that you need is a web page. I chose to build one using static HTML served from node.js as it's simple and runs on every platform.

## Step 2 - add SSL

PWAs only run on SSL. In order to build a PWA, we need to run our site with an SSL certificate. I deliberately left this out of the Github repo so be sure to create a certificate. 

For local development, we're going to self generate a cert. 

Open a commandline and run the following command. I used the Windows Subsystem for Linux with Ubuntu for my commandline. 
```
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

When you're doing this, you'll get privacy errors from Edge, Chrome and many other browsers. To fix this, you can then configure your local web server with localhost.crt and localhost.key, and install localhost.crt in your list of locally trusted roots.

[Windows instructions for adding a certificate](https://zeropointdevelopment.com/how-to-get-https-working-in-windows-10-localhost-dev-environment/)
[Mac instructions for adding a certificate](https://www.eduhk.hk/ocio/content/faq-how-add-root-certificate-mac-os-x)

When you go to production, you'll have to get a proper certificate and work with your site administrator to get it installed. 

## Step 3 - Add a manifest.json

In order to install a PWA, the browser needs to know what to call it, what the start url is, how to display it and so on.

```
{
    "name": "Simple PWA Demo",
    "short_name": "simplePWADemo",
    "lang": "en-US",
    "start_url": "/index.html",
    "display": "standalone",
    "background_color": "white",
    "theme_color": "white"
}
```

Check out the [MDN Docs for Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest) for a lot more detail to what you can do with the manifest.

The next thing to do is add a link to this manifest in your header in your index.html page. 

```
  <link rel="manifest" href="manifest.json">
```

At this point, we actually have a PWA that is installable as an application on a device. 

## Step 4 - Add a service worker

There are two steps to adding a service worker. 

### Creating the Service Worker itself

For this step, we will add a file called serviceworker.js to the project in our jabascript folder as follows. 

```
var cacheName = 'simple-pwa';
var filesToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
```

The second step is to load the service worker on load for your index.html. 

```
window.onload = () => {
    'use strict';
  
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
               .register('./serviceworker.js');
    }
  }
```

## Testing and extras... 

If you want, you can flesh out the onload event to give you updates as to whether you are online or offline. 

```
window.onload = () => {
    'use strict';
  
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
               .register('./serviceworker.js');
    }

    var status = document.getElementById("status");
  
    function updateOnlineStatus(event) {
      var condition = navigator.onLine ? "online" : "offline";
  
      status.className = condition;
      status.innerHTML = condition.toUpperCase();
    }
  
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}
```