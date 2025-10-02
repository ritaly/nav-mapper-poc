export type Env = "prod" | "stg" | "dev" | "draft" | "review";
export type SiteType = "MAIN" | "SHOP" | "EXTERNAL" | "RELATIVE";

export function classifySite(urlFromCms: string): SiteType {
  try {
    const u = new URL(urlFromCms);
    const host = u.hostname.toLowerCase();

    if (host === "example.com" || host.endsWith(".example.com")) {
      if (host.startsWith("shop.")) return "SHOP";
      return "MAIN";
    }
    return "EXTERNAL";
  } catch {
    return "RELATIVE";
  }
}

function mapHostForSite(domains: any, env: Env, site: SiteType): string | null {
  if (site === "MAIN") return domains[env].main;
  if (site === "SHOP") return domains[env].shop || null;
  return null;
}

function normalizeSelfLink(resolvedUrl: string, currentHost: string): string {
  try {
    const u = new URL(resolvedUrl);
    if (u.hostname === currentHost) {
      return `${u.pathname}${u.search}${u.hash}`;
    }
    return resolvedUrl;
  } catch {
    return resolvedUrl;
  }
}

export function resolveNavHref(
  cmsHref: string,
  domains: any,
  env: Env,
  currentHost: string
): string | null {
  const site = classifySite(cmsHref);

  if (site === "EXTERNAL") return cmsHref;
  if (site === "RELATIVE") return cmsHref;

  const src = new URL(cmsHref);
  const targetOrigin = mapHostForSite(domains, env, site);
  if (!targetOrigin) return null;

  const candidate = `${targetOrigin}${src.pathname}${src.search}${src.hash}`;
  return normalizeSelfLink(candidate, currentHost);
}
