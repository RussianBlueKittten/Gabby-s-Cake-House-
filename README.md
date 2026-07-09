# Gabby's Bakehouse

A custom-order-first website — visitors are guided toward designing a cake together rather than just picking one off a shelf. The shop section doubles as ideas & pricing.

## Structure
- `index.html` — page structure and content
- `styles.css` — all styling (design tokens at the top of the file — autumn palette: burnt orange, burgundy, browns)
- `app.js` — product data, filtering, cart logic, quick view modal, lightbox zoom
- `images/` — product photos

## Editing the menu
All products live in the `CAKES` array near the top of `app.js`. Categories are defined just above it in `CATEGORIES`. Add, remove, or edit items there — the shop grid, filters, and cart all render from that array automatically.

## Delivery / pickup rules
Set in `app.js` under `FULFILMENT_COPY` — currently: £40 minimum for delivery, covers 15 miles of Dundee, further afield may be possible with extra cost.

## Notes
- Prices are placeholders — update in `app.js`.
- Checkout/payment isn't wired up yet — the cart has a placeholder note where real payment will go later.
- Deploy via GitHub Pages: Settings → Pages → Deploy from branch → main / root.
