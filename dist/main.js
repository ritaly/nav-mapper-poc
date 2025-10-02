var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { resolveNavHref } from "./mapper";
const envSelect = document.getElementById("env-select");
const navContainer = document.getElementById("nav");
function renderNav(env) {
    return __awaiter(this, void 0, void 0, function* () {
        navContainer.innerHTML = "";
        // fetch config + CMS links
        const domains = yield fetch("./env-domains.json").then(r => r.json());
        const cmsNav = yield fetch("./fake-cms-nav.json").then(r => r.json());
        const currentHost = new URL(domains[env].main).hostname;
        cmsNav.items.forEach((link) => {
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
    });
}
envSelect.addEventListener("change", () => {
    renderNav(envSelect.value);
});
// default render
renderNav("prod");
