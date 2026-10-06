# azizam.dev

Source for [azizam.dev](https://azizam.dev), the website for Azizam, a self-hosted
AI gateway. Astro static site, deployed to GitHub Pages on every push to `main`
by `.github/workflows/deploy.yml`.

```sh
npm ci
npm run dev      # http://127.0.0.1:4321
npm run build    # static output in dist/
npm run verify   # site checks
```

The site is unlisted (`noindex`, `robots.txt` disallows all) until launch.

All rights reserved; see [LICENSE](LICENSE).
