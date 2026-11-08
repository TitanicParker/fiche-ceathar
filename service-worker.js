/* Fiche Ceathar installable reading app: offline shell + visited-page cache. */
const VERSION='fiche-ceathar-pwa-v1';
const CORE=['./','./index.html','./handbook.html','./the_54_complete_table.html','./the_54_one_atlas.html','./the_54_white_deck.html','./THE_54_CONTROL.md','./app-icon.svg','./manifest.webmanifest','./offline.html'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(VERSION).then(async cache=>{await Promise.allSettled(CORE.map(url=>cache.add(url)));}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const names=await caches.keys();await Promise.all(names.filter(n=>n.startsWith('fiche-ceathar-pwa-')&&n!==VERSION).map(n=>caches.delete(n)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL('./',self.registration.scope).pathname))return;
event.respondWith((async()=>{const cache=await caches.open(VERSION);if(req.mode==='navigate'){try{const response=await fetch(req);if(response.ok)cache.put(req,response.clone());return response}catch(e){return await cache.match(req)||await cache.match('./offline.html')||Response.error()}}
const cached=await cache.match(req);if(cached)return cached;try{const response=await fetch(req);if(response.ok)cache.put(req,response.clone());return response}catch(e){return Response.error()}})())});
