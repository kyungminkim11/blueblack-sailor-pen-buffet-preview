# BlueBlack Digital Guide — Final Release Checklist

## Automated checks

Before publishing, confirm that the latest `main` commit passes:

- `Validate static site`
- `Validate extra public locales`
- `Audit public responsive UI`
- `Validate platform`

The responsive audit covers the nine public routes on desktop and mobile, core interactions, internal links, console errors, horizontal overflow, required metadata, and direct-access locks on internal routes.

## Public pages

- [ ] Home: all eight customer cards open the correct page.
- [ ] News: official Instagram, Naver, X, and blog links open correctly.
- [ ] Review event: review button and event conditions are visible.
- [ ] Pen Buffet: six parts, color swatches, 3D rotation/zoom, reset, code, and shared URL work.
- [ ] Store guide: floor tabs, brand search, map selection, and 360 panorama controls work.
- [ ] Official guide: brand search and official links work.
- [ ] Engraving guide: twelve fonts, preview input, and warnings work.
- [ ] A/S guide: all 25 brands resolve to one correct service center and no obsolete verification badge appears.
- [ ] Ink guide: brand → series → color flow, capacity/price display, and mobile controls work.
- [ ] Unknown URL: the custom 404 page provides useful return links.

## Languages

Test the public navigation and key dynamic controls in:

- Korean
- English
- Japanese
- Simplified Chinese
- Traditional Chinese
- Vietnamese
- Indonesian
- Thai

## Internal tools

- [ ] Direct access to every `/admin/` route shows the password gate.
- [ ] Password matching is case-insensitive.
- [ ] “Remember this device” is optional and persists only when selected.
- [ ] Product, inventory, price, location, and nib RPCs reject requests without a valid admin session.
- [ ] Product finder, nib finder, inventory audit, catalog update, and 360 tour manager work after login.

## Real-device checks

Run once on a store PC, an Android phone, and an iPhone/iPad if available:

- [ ] Touch scrolling and buttons do not overlap the browser UI.
- [ ] Barcode camera permission and rear-camera selection work.
- [ ] 360 panorama drag, direction buttons, and scene loading work.
- [ ] 3D Pen Buffet drag, pinch zoom, and share link work.
- [ ] Korean text does not wrap one character per line.
- [ ] No horizontal page scrolling appears.

## Content limitations

- The application currently supports the procedural 3D pen fallback. Add `public/models/sailor-pen-buffet.glb` only after all six required mesh names and independent materials are verified.
- The public 360 tour shows only viewpoints with a real bundled or uploaded image. Viewpoints 10 and 11 appear automatically after their original images are uploaded in the admin tool.
- Final A/S, price, stock, event, and opening-hours information should be compared with the current official source immediately before a major release.

## Release decision

Publish only when all automated workflows are green and the real-device checks above have no release-blocking issue.
