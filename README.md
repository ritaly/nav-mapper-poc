# nav-mapper-poc

[![Netlify Status](https://api.netlify.com/api/v1/badges/2ae6dac3-f8c0-412f-ae31-2ab32520e5ff/deploy-status)](https://app.netlify.com/projects/nav-mapper-poc/deploys)


The project explores how to reliably map CMS-defined navigation links across multiple environments (`prod`, `stg`, `dev`, `draft`, `review`) and site types (`main`, `shop`).  

The core idea: **don’t trust CMS absolute URLs directly — remap them at runtime based on current env + site context.**

### Examples

- `https://example.com/about` → `https://stg.example.com/about` (Staging Main)  
- `https://shop.example.com/cart` → `https://shop-stg.example.com/cart` (Staging Shop)  
- External links (`https://partners.com`) stay untouched  
- Relative links (`/about`) work as-is  

This prevents broken links when previewing draft/review environments and ensures one single CMS config works everywhere.


```
nav-mapper-poc/
├─ index.html       
├─ main.ts             # demo logic (render dropdown + mapped nav)
├─ mapper.ts           # mapping (reads env-domains.json)
├─ env-domains.json    # config
├─ fake-cms-nav.json   # fake CMS nav data (prod links)
├─ tsconfig.json
└─ dist/               
```

