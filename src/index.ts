import onHeaders from "on-headers";

import type { IncomingMessage, ServerResponse } from "http";

import type { CacheControlOptions } from "../index";

const isNumber = (input: any) => typeof input === "number" || !isNaN(+input);

export default function (options: CacheControlOptions = {}): (req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => void {
  return function (req, res, next) {
    res.cacheControl = options;

    onHeaders(res, function () {
      let options = this?.cacheControl || {};
      let cacheControl = [];

      if (options.private) {
        cacheControl.push('private');
      } else if (options.public) {
        cacheControl.push('public');
      };

      if (options.immutable) {
        cacheControl.push("immutable");
      };

      if (options.noStore) {
        options.noCache = true;
        cacheControl.push('no-store');
      };

      if (options.noCache) {
        options.maxAge = 0;
        delete options.sMaxAge;
        cacheControl.push('no-cache');
      };

      if (options.noTransform) {
        cacheControl.push('no-transform');
      };

      if (options.proxyRevalidate) {
        cacheControl.push('proxy-revalidate');
      };

      if (options.mustRevalidate) {
        cacheControl.push('must-revalidate');
      } else if (!options.noCache) {
        if (options.staleIfError) {
          cacheControl.push('stale-if-error=' + options.staleIfError);
        };

        if (options.staleWhileRevalidate) {
          cacheControl.push('stale-while-revalidate=' + options.staleWhileRevalidate);
        };
      };

      if (isNumber(options.maxAge)) {
        cacheControl.push("max-age=" + options.maxAge);
      };

      if (isNumber(options.sMaxAge)) {
        cacheControl.push("s-maxage=" + options.sMaxAge);
      };

      const isPreappliedHeadersPresented = typeof res !== "undefined" && "hasHeader" in res && res?.hasHeader?.("Cache-Control");
      if (cacheControl.length && !isPreappliedHeadersPresented) {
        this.setHeader('Cache-Control', cacheControl.join(','));
      };
    });

    next();
  };
};