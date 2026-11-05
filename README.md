# Dr. Eitan Morris

An English-first, static Astro website. No server, database, form provider, or API keys are required. Fonts and the portrait are served locally.

## Develop

Use Node.js 24 LTS (the project was verified with 24.22.1) and npm.

```sh
npm ci
npm run dev
```

The local development server defaults to port 4321. Astro 7 can run it in the background; use `npx astro dev status`, `npx astro dev logs`, and `npx astro dev stop` to manage it.

## Validate

```sh
npm run check
npm test
```

`npm test` builds the production output, serves it locally on port 4322, and runs Playwright browser checks. It covers all page links and assets, desktop/mobile navigation, six viewport sizes, keyboard controls, email links, JavaScript-disabled navigation, and automated accessibility checks on desktop and mobile.

The tests use `/usr/bin/chromium` when available. On other machines, install the test browser once with `npx playwright install chromium` (or `npx playwright install --with-deps chromium` on Linux). You can also select a browser using `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Pages and content

- `/`: homepage and approach overview.
- `/about/`: short biography and a Get in touch link to `dreitanmorris@gmail.com`. The longer biography is awaiting Dr. Morris's content.
- `/clinics/`: Clinics & Appointments, currently a Coming soon placeholder. Location maps and booking details are intentionally not implemented until clinic information is supplied.

Contact uses a standard `mailto:` link and opens the visitor's configured email app. There is no contact form or email sending backend. The email address is also visible so visitors can copy it.

The shared header and footer live in `src/components/`. Common copy is in `src/content/site.ts`; page-specific content is in `src/pages/`. All pages share the layout and CSS. No Hebrew toggle is shown yet; Hebrew is planned for a later iteration.

The current portrait is an AI-assisted background-removal derivative made for the approved design mockup. The original uploaded portrait was not available as a file when this asset was created.

## Deploy

```sh
npm run build
```

Publish the generated `dist/` directory. On Vercel, import the GitHub repository, select Astro, use `npm run build` as the build command and `dist` as the output directory. Select Node.js 24. Other static hosts can publish the same directory; no Vercel-specific runtime is used.

The canonical website URL is configured in `astro.config.mjs`. Update it if the production domain changes. Directory index files support direct visits and reloads on `/about/` and `/clinics/`; keep normal static-directory routing enabled rather than rewriting every path to the homepage.

Before launch, replace the About placeholder with the final supplied biography. Clinics may remain Coming soon until locations and booking information are ready. Real email delivery and external mail applications are outside the automated browser tests; they verify the exact `mailto:` destination.
