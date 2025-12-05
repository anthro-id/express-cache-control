import onHeaders from "on-headers";
import isNumber from "is-number";

import type { IncomingMessage, ServerResponse } from "http";

import type { CacheControlOptions } from "../index";

export default function cacheControl(options: CacheControlOptions = {}): (req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => void {
  return function (req, res, next) {
    res.cacheControl = options;

    onHeaders(res, function () {
      const options = this?.cacheControl || {};
      const directives = [];

      if (options.private) {
        directives.push('private');
      } else if (options.public) {
        directives.push('public');
      };

      if (options.immutable) {
        directives.push("immutable");
      };

      if (options.noStore) {
        options.noCache = true;
        directives.push('no-store');
      };

      if (options.noCache) {
        options.maxAge = 0;
        delete options.sMaxAge;
        directives.push('no-cache');
      } else {
        if (options.staleIfError) {
          directives.push('stale-if-error=' + options.staleIfError);
        };

        if (options.staleWhileRevalidate) {
          directives.push('stale-while-revalidate=' + options.staleWhileRevalidate);
        };
      };

      if (options.noTransform) {
        directives.push('no-transform');
      };

      if (options.proxyRevalidate) {
        directives.push('proxy-revalidate');
      };

      if (options.mustUnderstand) {
        directives.push("must-understand");
      };

      if (options.mustRevalidate) {
        directives.push('must-revalidate');
      };

      if (isNumber(options.maxAge)) {
        directives.push("max-age=" + options.maxAge);
      };

      if (isNumber(options.sMaxAge)) {
        directives.push("s-maxage=" + options.sMaxAge);
      };

      const hasCacheControlHeader = res?.hasHeader?.("Cache-Control");
      if (directives.length > 0 && !hasCacheControlHeader) {
        this.setHeader("Cache-Control", directives.join(", "));
      };
    });

    next();
  };
};