/* ================================================================
   GABBY'S BAKEHOUSE — APP LOGIC
   ----------------------------------------------------------------
   Structure, for anyone reading/learning from this later:
     1. DATA        — the "database" of cakes/categories/gallery.
                       Swap this for real content; nothing else
                       needs to change since everything renders
                       from these arrays.
     2. STATE        — the small bit of app memory: current filter,
                        cart contents, which cake is in quick view.
     3. RENDER       — pure-ish functions that turn state into DOM.
     4. CART LOGIC   — add/remove/update functions that mutate
                        state then call render again.
     5. EVENTS       — wiring DOM events to the functions above.
   This pattern (data -> state -> render loop) is the same basic
   idea behind frameworks like React, just done by hand.
   ================================================================ */

(function () {
  'use strict';

  /* ==============================================================
     1. DATA
     Replace image paths once real photos are supplied. Prices are
     placeholders — swap for real pricing later.
     ============================================================== */
  const CATEGORIES = [
    { id: 'all', label: 'All treats' },
    { id: 'cakes', label: 'Cakes' },
    { id: 'cupcakes', label: 'Cupcakes & bakes' },
    { id: 'macarons', label: 'Macarons' },
    { id: 'cheesecakes', label: 'Cheesecakes' },
  ];

  const CAKES = [
    /* ---------------- CAKES ---------------- */
    {
      id: 'hot-choc-mug-cake',
      name: 'Winter Hot Chocolate Cake',
      category: 'cakes',
      price: 48.00,
      desc: 'A hand-sculpted mug-shaped cake filled with "hot chocolate," topped with fondant penguin and snowman figures, mini marshmallows and gingerbread men. A festive showstopper, fully customisable for the season.',
      img: 'images/hot-choc-mug-cake.jpg',
      tag: 'Custom favourite',
    },
    {
      id: 'christmas-tree-cake',
      name: 'Christmas Tree & Gifts Cake',
      category: 'cakes',
      price: 44.00,
      desc: 'A smooth iced cake topped with a hand-painted sugar Christmas tree and a pile of tiny fondant gift boxes. Finished with a satin ribbon base.',
      img: 'images/christmas-tree-cake.jpg',
      tag: 'Seasonal',
    },
    {
      id: 'cinnamon-rolls',
      name: 'Fresh Baked Cinnamon Rolls (Tray of 7)',
      category: 'cakes',
      price: 18.00,
      desc: 'Soft, pillowy cinnamon rolls swirled with brown sugar and spice, finished with a sweet glaze. Baked fresh to order, best served warm.',
      img: 'images/cinnamon-rolls.jpg',
      tag: 'Bestseller',
    },
    {
      id: 'minecraft-bunny-cake',
      name: 'Minecraft Bunny Cake',
      category: 'cakes',
      price: 46.00,
      desc: 'A blocky, Minecraft-inspired bunny cake set on a hand-piped grass field with pastel sugar flowers. A fun, fully custom novelty design — great for kids\' birthdays.',
      img: 'images/minecraft-bunny-cake.jpg',
      tag: 'Novelty',
    },

    /* ---------------- CUPCAKES & BAKES ---------------- */
    {
      id: 'fathers-day-cupcakes',
      name: "Father's Day Cupcake Box",
      category: 'cupcakes',
      price: 22.00,
      desc: 'A dozen rich chocolate cupcakes finished with hand-piped buttercream, edible gold leaf and custom printed toppers. Designs can be adapted for any occasion.',
      img: 'images/fathers-day-cupcakes.jpg',
      tag: 'Customisable',
    },
    {
      id: 'baby-shower-cupcakes',
      name: 'Baby Shower Cupcake Box',
      category: 'cupcakes',
      price: 24.00,
      desc: 'Vanilla and chocolate cupcakes finished with swirled buttercream, edible flowers and custom "Baby Shower" toppers. Easily adapted for any theme or colour palette.',
      img: 'images/baby-shower-cupcakes.jpg',
      tag: 'Customisable',
    },
    {
      id: 'salted-caramel-choc-cupcakes',
      name: 'Salted Caramel & Chocolate Cupcakes',
      category: 'cupcakes',
      price: 21.00,
      desc: 'Rich chocolate cupcakes filled with salted caramel, finished with a swirl of salted caramel buttercream. A firm favourite for anyone with a sweet tooth.',
      img: 'images/salted-caramel-choc-cupcakes.jpg',
      tag: 'Bestseller',
    },
    {
      id: 'mini-egg-brownies',
      name: 'Mini Egg Brownies (Tray)',
      category: 'cupcakes',
      price: 20.00,
      desc: 'Fudgy chocolate brownies topped with a swirl of vanilla buttercream and crushed mini eggs. A seasonal favourite that never lasts long.',
      img: 'images/mini-egg-brownies.jpg',
      tag: 'Bestseller',
    },

    /* ---------------- MACARONS ---------------- */
    {
      id: 'pink-macarons',
      name: 'Strawberries & Cream Macarons (Box of 6)',
      category: 'macarons',
      price: 12.00,
      desc: 'Delicate almond macaron shells in soft pink, hand-piped and filled with a strawberry and white chocolate ganache. Made fresh in small batches.',
      img: 'images/pink-macarons-wide.jpg',
      tag: 'Bestseller',
    },
    {
      id: 'chocolate-macarons',
      name: 'Espresso Macarons (Box of 6)',
      category: 'macarons',
      price: 13.00,
      desc: 'Rich chocolate macaron shells filled with a coffee-flavoured buttercream. A firm favourite for coffee lovers.',
      img: 'images/chocolate-macarons.jpg',
      tag: null,
    },

    /* ---------------- CHEESECAKES ---------------- */
    {
      id: 'kinder-bueno-cheesecake',
      name: 'Kinder Bueno Cheesecake',
      category: 'cheesecakes',
      price: 26.00,
      desc: 'A creamy no-bake cheesecake loaded with crushed Kinder Bueno and finished with whole bars on top. Rich, indulgent, and always a crowd-pleaser.',
      img: 'images/kinder-bueno-cheesecake.jpg',
      tag: 'Bestseller',
    },
    {
      id: 'mint-aero-cheesecake',
      name: 'Mint Aero Cheesecake',
      category: 'cheesecakes',
      price: 26.00,
      desc: 'A light, minty no-bake cheesecake topped with mint Aero bubbles and chocolate malt balls. Cool, fresh and finished to look as good as it tastes.',
      img: 'images/lime-cheesecake-cups.jpg',
      tag: null,
    },
    {
      id: 'lime-cheesecake-cups',
      name: 'Lime Cheesecake Cups (Box of 6)',
      category: 'cheesecakes',
      price: 18.00,
      desc: 'Individual lime cheesecake cups topped with fresh zest and crushed meringue. Bright, zesty and perfectly portioned for sharing.',
      img: 'images/mint-aero-cheesecake.jpg',
      tag: null,
    },
  ];

  const GALLERY = [
    { img: 'images/christmas-tree-cake.jpg', alt: 'Christmas tree cake with sculpted fondant tree', tall: true },
    { img: 'images/hot-choc-mug-cake.jpg', alt: 'Hot chocolate mug-shaped novelty cake', tall: false },
    { img: 'images/minecraft-bunny-cake.jpg', alt: 'Minecraft-inspired bunny cake', tall: false },
    { img: 'images/mini-egg-brownies.jpg', alt: 'Mini egg brownies', tall: false },
    { img: 'images/fathers-day-cupcakes.jpg', alt: "Father's Day cupcake selection", tall: true },
    { img: 'images/baby-shower-cupcakes.jpg', alt: 'Baby shower themed cupcakes', tall: false },
    { img: 'images/pink-macarons-wide.jpg', alt: 'Pink macarons being filled', tall: false },
    { img: 'images/kinder-bueno-cheesecake.jpg', alt: 'Kinder Bueno cheesecake', tall: false },
  ];

  /* ==============================================================
     2. STATE
     ============================================================== */
  const state = {
    activeFilter: 'all',
    cart: [],          // [{ id, qty }]
    quickViewId: null, // id of cake currently shown in modal
  };

  const money = (n) => `£${n.toFixed(2)}`;
  const findCake = (id) => CAKES.find((c) => c.id === id);

  /* ==============================================================
     3. RENDER
     ============================================================== */
  function renderFilters() {
    const el = document.getElementById('menu-filters');
    el.innerHTML = CATEGORIES.map((cat) => `
      <button class="filter-chip" role="tab" data-filter="${cat.id}"
        aria-selected="${state.activeFilter === cat.id}">
        ${cat.label}
      </button>
    `).join('');
  }

  function renderMenu() {
    const el = document.getElementById('menu-grid');
    const cakes = state.activeFilter === 'all'
      ? CAKES
      : CAKES.filter((c) => c.category === state.activeFilter);

    el.innerHTML = cakes.map((cake) => `
      <article class="cake-card" data-reveal>
        <div class="cake-card-image">
          <img src="${cake.img}" alt="${cake.name}" loading="lazy" class="zoomable" data-zoom="${cake.img}">
          ${cake.tag ? `<span class="cake-card-tag">${cake.tag}</span>` : ''}
          <button class="cake-card-quickview" data-quickview="${cake.id}">Quick view</button>
        </div>
        <div class="cake-card-body">
          <h3>${cake.name}</h3>
          <p>${cake.desc}</p>
          <div class="cake-card-footer">
            <span class="cake-card-price">From ${money(cake.price)}</span>
            <button class="cake-card-add" data-add="${cake.id}" aria-label="Add ${cake.name} to order">+</button>
          </div>
          <a href="#order" class="cake-card-custom-link" data-customise="${cake.id}">Want this tailored to you? &rarr;</a>
        </div>
      </article>
    `).join('');

    observeReveals();
  }

  function renderGallery() {
    const el = document.getElementById('gallery-grid');
    el.innerHTML = GALLERY.map((item) => `
      <div class="gallery-item ${item.tall ? 'tall' : ''}" data-reveal>
        <img src="${item.img}" alt="${item.alt}" loading="lazy" class="zoomable" data-zoom="${item.img}">
      </div>
    `).join('');
    observeReveals();
  }

  function renderCart() {
    const itemsEl = document.getElementById('cart-items');
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');

    const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
    countEl.textContent = totalQty;
    countEl.setAttribute('data-empty', totalQty === 0 ? 'true' : 'false');

    if (state.cart.length === 0) {
      itemsEl.innerHTML = `<p class="cart-empty">Your order is empty — browse the menu and add something sweet.</p>`;
      totalEl.textContent = money(0);
      return;
    }

    let total = 0;
    itemsEl.innerHTML = state.cart.map((item) => {
      const cake = findCake(item.id);
      const lineTotal = cake.price * item.qty;
      total += lineTotal;
      return `
        <div class="cart-item" data-cart-item="${item.id}">
          <img src="${cake.img}" alt="${cake.name}">
          <div class="cart-item-body">
            <h4>${cake.name}</h4>
            <div class="cart-item-meta">${money(cake.price)} each</div>
            <div class="cart-item-row">
              <div class="qty-stepper">
                <button type="button" data-cart-minus="${item.id}" aria-label="Decrease quantity">&minus;</button>
                <input type="number" value="${item.qty}" min="1" max="20" data-cart-qty="${item.id}">
                <button type="button" data-cart-plus="${item.id}" aria-label="Increase quantity">+</button>
              </div>
              <span class="cart-item-price">${money(lineTotal)}</span>
            </div>
            <button class="cart-item-remove" data-cart-remove="${item.id}">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    totalEl.textContent = money(total);
  }

  function renderQuickView() {
    if (!state.quickViewId) return;
    const cake = findCake(state.quickViewId);
    const img = document.getElementById('qv-img');
    img.src = cake.img;
    img.alt = cake.name;
    img.dataset.zoom = cake.img;
    document.getElementById('qv-category').textContent = CATEGORIES.find((c) => c.id === cake.category)?.label || '';
    document.getElementById('qv-title').textContent = cake.name;
    document.getElementById('qv-desc').textContent = cake.desc;
    document.getElementById('qv-price').textContent = `From ${money(cake.price)}`;
    document.getElementById('qv-qty-input').value = 1;
  }

  /* Scroll-reveal observer — re-run after re-render since new nodes appear */
  let revealObserver;
  function observeReveals() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
    }
    document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => revealObserver.observe(el));
  }

  /* ==============================================================
     4. CART LOGIC
     ============================================================== */
  function addToCart(id, qty) {
    qty = Math.max(1, qty || 1);
    const existing = state.cart.find((item) => item.id === id);
    if (existing) {
      existing.qty += qty;
    } else {
      state.cart.push({ id, qty });
    }
    renderCart();
    showToast(`${findCake(id).name} added to your order`);
  }

  function setQty(id, qty) {
    qty = Math.max(1, Math.min(20, qty || 1));
    const item = state.cart.find((i) => i.id === id);
    if (item) item.qty = qty;
    renderCart();
  }

  function removeFromCart(id) {
    state.cart = state.cart.filter((i) => i.id !== id);
    renderCart();
  }

  /* ==============================================================
     Toast helper
     ============================================================== */
  let toastTimer;
  function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2600);
  }

  /* ==============================================================
     Cart drawer open/close
     ============================================================== */
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-backdrop');

  function openCart() {
    cartDrawer.classList.add('is-open');
    cartBackdrop.classList.add('is-visible');
    cartDrawer.setAttribute('aria-hidden', 'false');
  }
  function closeCart() {
    cartDrawer.classList.remove('is-open');
    cartBackdrop.classList.remove('is-visible');
    cartDrawer.setAttribute('aria-hidden', 'true');
  }

  /* ==============================================================
     Quick view modal open/close
     ============================================================== */
  const quickView = document.getElementById('quick-view');
  const modalBackdrop = document.getElementById('modal-backdrop');

  function openQuickView(id) {
    state.quickViewId = id;
    renderQuickView();
    quickView.classList.add('is-open');
    modalBackdrop.classList.add('is-visible');
    quickView.setAttribute('aria-hidden', 'false');
  }
  function closeQuickView() {
    quickView.classList.remove('is-open');
    modalBackdrop.classList.remove('is-visible');
    quickView.setAttribute('aria-hidden', 'true');
    state.quickViewId = null;
  }

  /* ==============================================================
     Lightbox (zoom) — works for any element with class="zoomable"
     and a data-zoom attribute holding the full-size image path.
     Event delegation on document.body means this works for images
     that don't exist yet at page load (cards re-rendered on filter).
     ============================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxImg = document.getElementById('lightbox-img');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    lightboxBackdrop.classList.add('is-visible');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightboxBackdrop.classList.remove('is-visible');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  /* ==============================================================
     5. EVENTS
     ============================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();

    renderFilters();
    renderMenu();
    renderGallery();
    renderCart();

    /* Mobile nav toggle */
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));

    /* Filter chips (event delegation) */
    document.getElementById('menu-filters').addEventListener('click', (e) => {
      const chip = e.target.closest('[data-filter]');
      if (!chip) return;
      state.activeFilter = chip.dataset.filter;
      renderFilters();
      renderMenu();
    });

    /* Menu grid: add-to-cart + quick view (event delegation, since
       cards are re-rendered whenever the filter changes) */
    document.getElementById('menu-grid').addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-add]');
      if (addBtn) { addToCart(addBtn.dataset.add, 1); return; }

      const qvBtn = e.target.closest('[data-quickview]');
      if (qvBtn) { openQuickView(qvBtn.dataset.quickview); return; }
    });

    /* Cart toggle / close */
    document.getElementById('cart-toggle').addEventListener('click', openCart);
    document.getElementById('cart-close').addEventListener('click', closeCart);
    cartBackdrop.addEventListener('click', closeCart);

    /* Cart item qty/remove (event delegation) */
    document.getElementById('cart-items').addEventListener('click', (e) => {
      const minus = e.target.closest('[data-cart-minus]');
      const plus = e.target.closest('[data-cart-plus]');
      const remove = e.target.closest('[data-cart-remove]');
      if (minus) {
        const item = state.cart.find((i) => i.id === minus.dataset.cartMinus);
        setQty(item.id, item.qty - 1 <= 0 ? (removeFromCart(item.id), null) : item.qty - 1);
      }
      if (plus) {
        const item = state.cart.find((i) => i.id === plus.dataset.cartPlus);
        setQty(item.id, item.qty + 1);
      }
      if (remove) removeFromCart(remove.dataset.cartRemove);
    });
    document.getElementById('cart-items').addEventListener('change', (e) => {
      const input = e.target.closest('[data-cart-qty]');
      if (input) setQty(input.dataset.cartQty, parseInt(input.value, 10));
    });

    /* Checkout placeholder — requires a pickup/delivery choice first */
    document.getElementById('cart-checkout').addEventListener('click', () => {
      const chosen = document.querySelector('input[name="cart-fulfilment"]:checked');
      const note = document.getElementById('checkout-note');
      if (!chosen) {
        const fNote = document.getElementById('cart-fulfilment-note');
        fNote.textContent = 'Please choose pickup or delivery before continuing.';
        fNote.hidden = false;
        fNote.style.color = 'var(--color-error)';
        return;
      }
      note.hidden = false;
    });

    /* Quick view modal */
    document.getElementById('qv-close').addEventListener('click', closeQuickView);
    modalBackdrop.addEventListener('click', closeQuickView);

    document.getElementById('qv-qty-minus').addEventListener('click', () => {
      const input = document.getElementById('qv-qty-input');
      input.value = Math.max(1, parseInt(input.value, 10) - 1);
    });
    document.getElementById('qv-qty-plus').addEventListener('click', () => {
      const input = document.getElementById('qv-qty-input');
      input.value = Math.min(20, parseInt(input.value, 10) + 1);
    });
    document.getElementById('qv-add').addEventListener('click', () => {
      const qty = parseInt(document.getElementById('qv-qty-input').value, 10);
      addToCart(state.quickViewId, qty);
      closeQuickView();
      openCart();
    });

    /* Pickup / delivery messaging — same rule set applies to both
       the custom order form and the cart checkout drawer:
       - Pickup: I'll share the address when I reply.
       - Delivery: £40 minimum order, free within 15 miles of Dundee.
         Further afield may be possible but could mean extra cost. */
    const FULFILMENT_COPY = {
      pickup: "Great — I'll share the pickup address when I confirm your order.",
      delivery: "Delivery has a £40 minimum order and covers within 15 miles of Dundee. Further away may be possible — just let me know in the details — but it may require extra costs, especially outside that radius.",
    };

    function wireFulfilmentGroup(formSelector, radioName, noteId, addressFieldId) {
      const form = document.querySelector(formSelector);
      if (!form) return;
      const note = document.getElementById(noteId);
      const addressField = addressFieldId ? document.getElementById(addressFieldId) : null;
      form.addEventListener('change', (e) => {
        if (e.target.name !== radioName) return;
        const val = e.target.value;
        note.textContent = FULFILMENT_COPY[val] || '';
        note.hidden = false;
        if (addressField) addressField.hidden = val !== 'delivery';
      });
    }
    wireFulfilmentGroup('#order-form', 'fulfilment', 'of-fulfilment-note', 'of-address-field');
    wireFulfilmentGroup('.cart-footer', 'cart-fulfilment', 'cart-fulfilment-note', null);

    /* "Want this tailored to you?" links on menu cards jump to the
       custom order form and pre-fill the details field so I know
       which design sparked the enquiry. */
    document.getElementById('menu-grid').addEventListener('click', (e) => {
      const link = e.target.closest('[data-customise]');
      if (!link) return;
      const cake = findCake(link.dataset.customise);
      const details = document.getElementById('of-details');
      if (cake && details && !details.value) {
        details.value = `I'd love something inspired by the "${cake.name}" — here's what I'm picturing: `;
      }
    });

    /* Escape key closes drawer/modal */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeCart(); closeQuickView(); closeLightbox(); }
    });

    /* Lightbox: works globally via event delegation, since zoomable
       images live inside menu cards, gallery items, and the quick
       view modal — all of which can re-render after page load. */
    document.body.addEventListener('click', (e) => {
      const zoomTarget = e.target.closest('.zoomable');
      if (zoomTarget && zoomTarget.tagName === 'IMG') {
        openLightbox(zoomTarget.dataset.zoom || zoomTarget.src, zoomTarget.alt);
      }
    });
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);

    /* Custom order form — placeholder submit handler.
       Replace with a real endpoint (Formspree / Netlify Forms / EmailJS)
       when the site goes live. This only validates + confirms client-side. */
    const orderForm = document.getElementById('order-form');
    const orderStatus = document.getElementById('order-status');
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fulfilment = document.querySelector('input[name="fulfilment"]:checked');
      const addressField = document.getElementById('of-address');

      if (!orderForm.checkValidity() || !fulfilment) {
        orderStatus.textContent = 'Please fill in all fields, including pickup or delivery.';
        orderStatus.setAttribute('data-state', 'error');
        return;
      }
      if (fulfilment.value === 'delivery' && !addressField.value.trim()) {
        orderStatus.textContent = 'Please add a delivery address.';
        orderStatus.setAttribute('data-state', 'error');
        return;
      }
      orderStatus.textContent = "Thanks! I'll be in touch about your cake soon.";
      orderStatus.setAttribute('data-state', 'success');
      orderForm.reset();
      document.getElementById('of-fulfilment-note').hidden = true;
      document.getElementById('of-address-field').hidden = true;
    });

    /* Sticky header shadow on scroll (small polish touch) */
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 8 ? '0 4px 20px rgba(107,63,63,0.08)' : 'none';
    }, { passive: true });

    observeReveals();
  });
})();
