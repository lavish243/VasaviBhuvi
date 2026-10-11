# Vasavi Bhuvi - Corrected Project

## What was corrected
- Reconciled all image references with the images actually present in `public/images`.
- Fixed Amenities, Floor Plans, Gallery, Location and project-image paths.
- Fixed missing React `useState` import in the Floor Plans page.
- Changed Gallery route to use the full page implementation.
- Removed duplicate Footer rendering on the Home page.
- Centralized the real project phone/email/WhatsApp values in `src/config/siteConfig.js`.
- Fixed Navbar, Footer, Contact and floating action buttons to use the centralized contact details.
- Enquiry and Contact forms now open a pre-filled WhatsApp enquiry instead of only logging data to the console.
- Removed the fake `YOUR_VIDEO_ID` walkthrough and added a safe fallback image until a real YouTube ID is supplied.
- Removed broken brochure links; the site now shows `Request Brochure` until the real PDF is added.
- Added working Privacy Policy and Terms & Conditions routes.
- Fixed Google Maps links to use the Vasavi Bhuvi address.

## Before running
The uploaded `node_modules` directory is intentionally not included in this package. Run:

```bash
npm install
npm run build
```

If you want a real brochure, add:

`public/brochure/vasavi-bhuvi-brochure.pdf`

and set `brochure` in `src/config/siteConfig.js` to:

`/brochure/vasavi-bhuvi-brochure.pdf`

If you have the official walkthrough YouTube video, put only its video ID in `walkthroughVideoId` in `src/config/siteConfig.js`.
