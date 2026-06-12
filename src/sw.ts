// v1.0.0 | 2026-06-09 MEZ
/// <reference lib="webworker" />
import { cleanupOutdatedCaches, matchPrecache, precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

cleanupOutdatedCaches();

self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.mode !== 'navigate') return;

  event.respondWith((async () => {
    try {
      return await fetch(event.request);
    } catch {
      return (await matchPrecache('index.html')) ?? Response.error();
    }
  })());
});

precacheAndRoute(self.__WB_MANIFEST);
