# Vasavi Bhuvi React Frontend

React/Vite frontend based on the current public Vasavi Bhuvi website.

## Run

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Images

The project already contains local image assets under `public/images/` for hero, about, amenities, gallery, master plan, floor plans and location sections.

The live site's currently exposed amenity/hero assets are referenced in `LIVE_SITE_ASSET_URLS.md` and can be downloaded into `public/images/live-site/` with:

```powershell
powershell -ExecutionPolicy Bypass -File .\download-live-assets.ps1
```

The source website currently shows 10.65 acres, 8 towers, 17 floors per tower, 1,208 units, 65% open space, two clubhouses covering 50,000 sq. ft., 2/2.5/3 BHK configurations, RERA P02200007044, and phone +91 99968 99921. Source: https://vasavibhuvi.com/
