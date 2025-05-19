export interface CacheControlOptions extends
  Partial<Record<"private" | "public" | "immutable" | `no${"Cache" | "Store" | "Transform"}` | `${"proxy" | "must"}Revalidate`, boolean>>,
  Partial<Record<"sMaxAge" | "maxAge" | `stale${"IfError" | "WhileRevalidate"}`, number>> { }

declare namespace Express {
  interface Response {
    cacheControl?: CacheControlOptions;
  }
}

declare module "http" {
  interface ServerResponse {
    cacheControl?: CacheControlOptions;
  }
}