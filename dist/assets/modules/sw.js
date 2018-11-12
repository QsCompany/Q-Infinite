/// <reference path="./../../sys/Thread.ts" />

import { Workers } from "../../sys/Thread";

importScripts('./offlineMode/workbox-sw.js');
importScripts('./worker.js');
Workers.WebWorker.Server.Start();
var apiRouter = new workbox.routing.Route(
    (e) => {
        return e.url.pathname.indexOf('/_/') === 0 || e.url.pathname.indexOf('/~') === 0;
    },
    workbox.strategies.networkFirst(), "GET"
);
var assetsRouter = new workbox.routing.Route(
    (e) => { return e.url.pathname.indexOf('/_/') !== 0 || e.url.pathname.indexOf('/~') !== 0; },
    workbox.strategies.cacheFirst(), "GET"
);
var stat = true;
Workers.WebWorker.registerHandler('goOffline', (e) => {
    if (e.Msg.Data === stat) return stat;
    if (e.Msg.Data === true) {
        workbox.routing.registerRoute(apiRouter);
        workbox.routing.registerRoute(assetsRouter);
        stat = true;
        return true;
    } else if (e.Msg.Data === false) {
        workbox.routing.unregisterRoute(apiRouter);
        workbox.routing.unregisterRoute(assetsRouter);
        stat = false;
        return false;
    }
    return undefined;
});
Workers.WebWorker.registerHandler('OfflineState', (e) => {
    return stat;
});

workbox.routing.registerRoute(apiRouter);
workbox.routing.registerRoute(assetsRouter);
stat = true;