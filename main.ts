import { mapNavLinkToEnvUrl, Env, EnvDomains } from "./mapper.js";

type NavItem = { label: string; href: string };

const envSelector = document.getElementById("env-select") as HTMLSelectElement;
const navPreviewTable = document.getElementById("nav") as HTMLTableSectionElement;

async function renderNavigation(env: Env) {
  navPreviewTable.innerHTML = "";

  try {
    const envDomains: EnvDomains = await fetch("/env-domains.json").then(r => r.json());
    const cmsNav = await fetch("/fake-cms-nav.json").then(r => r.json());

    const currentHost = new URL(envDomains[env].main).hostname;

    // if (!Array.isArray(cmsNav.items)) {
    //   console.error("Invalid nav JSON:", cmsNav);
    //   return;
    // }

    cmsNav.items.forEach((navItem: NavItem) => {
      const resolvedUrl = mapNavLinkToEnvUrl(navItem.href, envDomains, env, currentHost);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${navItem.label}</td>
        <td><code>${navItem.href}</code></td>
        <td>${env}</td>
        <td><code>${resolvedUrl}</code></td>
      `;
      navPreviewTable.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to render navigation:", err);
  }
}

// fake environment switch
envSelector.addEventListener("change", () => {
  renderNavigation(envSelector.value as Env);
});

// default
renderNavigation("prod");
