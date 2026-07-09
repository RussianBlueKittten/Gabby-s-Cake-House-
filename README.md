# Gabby's Bakehouse

A website for Gabby's cake and bake business — browse the menu, build an order in the cart, and send custom cake requests.

## Structure
- `index.html` — page structure and content
- `styles.css` — all styling (design tokens at the top of the file)
- `app.js` — cake/product data, filtering, cart logic, quick view modal
- `images/` — product photos

## Editing the menu
All products live in the `CAKES` array near the top of `app.js`. Add, remove, or edit items there — the shop grid, filters, and cart all render from that array automatically. Categories are defined just above it in `CATEGORIES`.

## Notes
- Prices are placeholders — update in `app.js`.
- Checkout/payment isn't wired up yet — the cart has a placeholder note where real payment will go later.
- Deploy via GitHub Pages: Settings → Pages → Deploy from branch → main / root.
