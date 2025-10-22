const CACHE_NAME = 'cocktail-pwa-v2';

const appShellAssets = [
    './',
    './index.html',
    './main.js',
    './styles/main.css',
    './scripts/app.js'
];

const OFFLINE_COCKTAIL_JSON = {
    drinks: [{
        idDrink: "00000",
        strDrink: "No hay conexion ni datos",
        strTags: "FALLBACK",
        strCategory: "Desconectado",
        strInstructions: "No pudimos obtener resultados. Este es un resultado genérico. Intenta conectarte de nuevo.",
        strDrinkThumb: "https://via.placeholder.com/200x300?text=OFFLINE",
        strIngredient1: "Service Worker",
        strIngredient2: "Fallback JSON"
    }]
};

self.addEventListener('install', event => {
    console.log('Instalando y precacheando el App Shell...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            //aqui es donde se hace el precacheo
            return cache.addAll(appShellAssets);
        })
            .then(() => self.skipWaiting()) //se fuerza, si no es cuando esta cosa quiera, si no cuando yo -.-
    );
});
self.addEventListener('activate', event => {
    console.log('Service Worker Activado.');
    event.waitUntil(self.clients.claim());
});


self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    // ESTRATEGIA CACHE ONLY:;
    const isAppShellRequest = appShellAssets.some(asset =>
        requestUrl.pathname === asset || requestUrl.pathname === asset.substring(1)
    );
    if (isAppShellRequest) {
        console.log(`[SW] App Shell: CACHE ONLY para ${requestUrl.pathname}`);
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    // Devolvemos la respuesta de caché o un error 500 si falta el archivo
                    return response || new Response('App Shell Asset Missing', { status: 500 });
                })
        );
        return;
    }
    // ESTRATEGIA NETWORK FIRST CON FALLBACK A JSON GENÉRICO PARA LA API DE CÓCTELES
    if (requestUrl.host === 'www.thecocktaildb.com' && requestUrl.pathname.includes('/search.php')) {
        console.log('[SW] API NETWORK-FIRST con Fallback a JSON Genérico.');
        event.respondWith(
            fetch(event.request) // Intentamos ir a la red primero
                .catch(() => {
                    // Si la RED FALLA, devolvemos el JSON de Fallback.
                    console.log('[SW] ❌ Fallo de red. Devolviendo JSON de Fallback.');
                    return new Response(JSON.stringify(OFFLINE_COCKTAIL_JSON), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
        );
        return;
    }
    // Para todos los demás recursos (imágenes de la API, otros scripts),
    // se utiliza el comportamiento por defecto (ir a la red).
});