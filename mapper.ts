export type Env = "prod" | "stg" | "dev" | "draft" | "review";
export type SiteType = "MAIN" | "SHOP" | "EXTERNAL" | "RELATIVE";
export type EnvDomains = Record<Env, { main: string; shop: string }>;

export function mapNavLinkToEnvUrl(
  navLink: string,
  envDomains: EnvDomains,
  env: Env,
  currentHostname: string
): string {
  const siteType = detectSiteType(navLink);

  if (siteType === "EXTERNAL" || siteType === "RELATIVE") return navLink;

  const parsedUrl = new URL(navLink);
  const targetBaseUrl = resolveBaseUrlForEnv(envDomains, env, siteType);
  const resolvedUrl = `${targetBaseUrl}${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  return normalizeSelfNav(resolvedUrl, currentHostname);
}

function detectSiteType(navLink: string): SiteType {
  try {
    const hostname = new URL(navLink).hostname.toLowerCase();

    if (hostname.startsWith("shop.")) return "SHOP";
    if (hostname === "example.com" || hostname.endsWith(".example.com")) return "MAIN";
    return "EXTERNAL";
  } catch {
    return "RELATIVE";
  }
}

function resolveBaseUrlForEnv(envDomains: EnvDomains, env: Env, siteType: SiteType): string {
  if (siteType === "MAIN") return envDomains[env].main;
  if (siteType === "SHOP") return envDomains[env].shop;
  throw new Error(`Unsupported siteType ${siteType}`);
}

function normalizeSelfNav(resolvedUrl: string, currentHostname: string): string {
  const parsedUrl = new URL(resolvedUrl);
  return parsedUrl.hostname === currentHostname
    ? `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
    : resolvedUrl;
}
