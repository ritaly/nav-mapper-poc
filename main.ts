import { resolveNavHref, Env } from "./mapper.js";

const envSelect = document.getElementById("env-select") as HTMLSelectElement;
const navContainer = document.getElementById("nav") as HTMLTableSectionElement;

async function renderNav(env: Env) {
  navContainer.innerHTML = "";

  try {
    const domains = await fetch("/env-domains.json").then(r => r.json());
    const cmsNav = await fetch("/fake-cms-nav.json").then(r => r.json());

    console.log("Loaded domains:", domains);
    console.log("Loaded cmsNav:", cmsNav);

    const currentHost = new URL(domains[env].main).hostname;

    if (!cmsNav.items || !Array.isArray(cmsNav.items)) {
      console.error("cmsNav has no items array!", cmsNav);
      return;
    }

    cmsNav.items.forEach((link: any) => {
      const mapped = resolveNavHref(link.href, env, currentHost);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${link.label}</td>
        <td><code>${link.href}</code></td>
        <td>${env}</td>
        <td><code>${mapped}</code></td>
      `;
      navContainer.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading JSON:", err);
  }
}

envSelect.addEventListener("change", () => {
  renderNav(envSelect.value as Env);
});

// default render
renderNav("prod");
