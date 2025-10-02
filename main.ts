import { mapNavLinkToEnvUrl, Env, EnvDomains } from "./mapper.js";

type NavItem = { label: string; href: string };

const environmentSelector = document.getElementById("env-select") as HTMLSelectElement;
const siteSelector = document.getElementById("site-select") as HTMLSelectElement;
const navigationTableBody = document.getElementById("nav") as HTMLTableSectionElement;
const currentContext = document.getElementById("current-context") as HTMLParagraphElement;

async function renderNavigation(env: Env, site: "main" | "shop") {
  navigationTableBody.innerHTML = "";

  try {
    const envDomains: EnvDomains = await fetch("/env-domains.json").then(r => r.json());
    const cmsNavigation = await fetch("/fake-cms-nav.json").then(r => r.json());

    const baseUrl = site === "main" ? envDomains[env].main : envDomains[env].shop;
    const currentHostname = new URL(baseUrl).hostname;

    currentContext.textContent = `You are on: 🔴 🔗 ${baseUrl}`;

    // if (!Array.isArray(cmsNavigation.items)) {
    //   console.error("Invalid CMS navigation JSON:", cmsNavigation);
    //   return;
    // }

    cmsNavigation.items.forEach((navItem: NavItem) => {
      const resolvedUrl = mapNavLinkToEnvUrl(navItem.href, envDomains, env, currentHostname);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${navItem.label}</td>
        <td><code>${navItem.href}</code></td>
        <td><code>${resolvedUrl}</code></td>
      `;
      navigationTableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to render navigation:", err);
  }
}

function refresh() {
  renderNavigation(environmentSelector.value as Env, siteSelector.value as "main" | "shop");
}

environmentSelector.addEventListener("change", refresh);
siteSelector.addEventListener("change", refresh);

// default
refresh();
