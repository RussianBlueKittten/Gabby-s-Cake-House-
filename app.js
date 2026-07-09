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
     placeholders — swap for Gabby's real pricing later.
     ============================================================== */
  const CATEGORIES = [
    { id: 'all', label: 'All treats' },
    { id: 'cakes', label: 'Cakes' },
    { id: 'cupcakes', label: 'Cupcakes & bakes' },
    { id: 'macarons', label: 'Macarons' },
    { id: 'chocolates', label: 'Chocolates' },
    { id: 'plated', label: 'Plated desserts' },
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

    /* ---------------- MACARONS ---------------- */
    {
      id: 'pink-macarons',
      name: 'Classic Pink Macarons (Box of 6)',
      category: 'macarons',
      price: 12.00,
      desc: 'Delicate almond macaron shells in soft pink, hand-piped and filled with a smooth buttercream. Made fresh in small batches.',
      img: 'images/pink-macarons-wide.jpg',
      tag: 'Bestseller',
    },
    {
      id: 'chocolate-macarons',
      name: 'Salted Caramel Macarons (Box of 6)',
      category: 'macarons',
      price: 13.00,
      desc: 'Rich chocolate macaron shells sandwiched with a silky salted caramel filling. A firm favourite for chocolate lovers.',
      img: 'images/chocolate-macarons.jpg',
      tag: null,
    },
    {
      id: 'assorted-macarons',
      name: 'Assorted Macaron Selection (Box of 9)',
      category: 'macarons',
      price: 17.00,
      desc: "A mixed box featuring the season's flavours — a chance to try a little of everything from the macaron menu.",
      img: 'images/assorted-macarons.jpg',
      tag: 'Mixed box',
    },

    /* ---------------- CHOCOLATES ---------------- */
    {
      id: 'marbled-chocolates',
      name: 'Hand-Marbled Chocolate Domes (Box of 12)',
      category: 'chocolates',
      price: 16.00,
      desc: 'Hand-painted marbled chocolate shells in autumnal tones, individually piped and set. Each one is a little different.',
      img: 'images/marbled-chocolates.jpg',
      tag: null,
    },
    {
      id: 'gold-leaf-chocolates',
      name: 'Gold Leaf Chocolate Bites (Box of 12)',
      category: 'chocolates',
      price: 19.00,
      desc: 'Smooth milk chocolate bites finished with delicate edible gold leaf. A little indulgent, perfect for gifting.',
      img: 'images/gold-leaf-chocolates.jpg',
      tag: 'Gift box',
    },
    {
      id: 'chocolate-slabs',
      name: 'Dark Chocolate Fruit & Nut Slab',
      category: 'chocolates',
      price: 9.50,
      desc: 'Hand-tempered dark chocolate slabs, one finished with a cocoa-bean design, the other topped with dried cranberries and pistachio.',
      img: 'images/chocolate-slabs.jpg',
      tag: null,
    },

    /* ---------------- PLATED DESSERTS ---------------- */
    {
      id: 'banana-tart-plate',
      name: 'Banana Tart & Chocolate Fondant Plate',
      category: 'plated',
      price: 8.00,
      desc: 'A caramelised banana tart with a brandy-snap tuile alongside a rich chocolate fondant dome over chocolate soil. Restaurant-style plating, made to order.',
      img: 'images/banana-tart-plate.jpg',
      tag: 'Signature plate',
    },
    {
      id: 'chocolate-mousse-fig',
      name: 'Chocolate Mousse with Fig & Orange',
      category: 'plated',
      price: 7.50,
      desc: 'Silky chocolate mousse piped into a coupe glass, topped with fresh fig, candied orange zest and chantilly cream, served with a choux bun.',
      img: 'images/chocolate-mousse-fig.jpg',
      tag: null,
    },
    {
      id: 'creme-caramel-orange',
      name: 'Crème Caramel with Candied Orange',
      category: 'plated',
      price: 7.00,
      desc: 'A classic silky crème caramel finished with a caramelised orange disc and its own caramel sauce.',
      img: 'images/creme-caramel-orange.jpg',
      tag: null,
    },
    {
      id: 'fruit-trifle-cup',
      name: 'Fresh Fruit & Custard Trifle Cup',
      category: 'plated',
      price: 6.50,
      desc: 'Layers of sponge and custard in a glass, topped with fresh fig, blueberries and grape. Light and bright, great for events.',
      img: 'images/fruit-trifle-cup.jpg',
      tag: null,
    },
    {
      id: 'chocolate-tart-snowflake',
      name: 'Dark Chocolate Tart, Winter Edition',
      category: 'plated',
      price: 7.50,
      desc: 'A rich dark chocolate tart served with vanilla ice cream, freeze-dried raspberry and a hand-piped snowflake chocolate tuile.',
      img: 'images/chocolate-tart-snowflake.jpg',
      tag: 'Seasonal',
    },
    {
      id: 'lemon-posset-meringue',
      name: 'Baked Lemon Posset with Berries',
      category: 'plated',
      price: 7.00,
      desc: 'A baked lemon-set dessert with a lattice pastry lid, served with mini meringue kisses, blackberries and a berry coulis.',
      img: 'images/lemon-posset-meringue.jpg',
      tag: null,
    },
    {
      id: 'creme-brulee-duo',
      name: 'Crème Brûlée Duo',
      category: 'plated',
      price: 8.50,
      desc: 'A classic torched crème brûlée served alongside a set vanilla panna cotta with a shortbread crumb.',
      img: 'images/creme-brulee-duo.jpg',
      tag: null,
    },
    {
      id: 'fried-pastry-icecream',
      name: 'Fried Pastry Parcels with Vanilla Ice Cream',
      category: 'plated',
      price: 6.50,
      desc: 'Crisp fried pastry parcels dusted with icing sugar, served warm with a scoop of vanilla ice cream.',
      img: 'images/fried-pastry-icecream.jpg',
      tag: null,
    },
    {
      id: 'sticky-toffee-pudding',
      name: 'Sticky Toffee Pudding',
      category: 'plated',
      price: 7.00,
      desc: 'A warm, rich sticky toffee sponge drenched in toffee sauce, served with a scoop of vanilla ice cream. A comfort-food classic, done properly.',
      img: 'images/sticky-toffee-pudding.jpg',
      tag: 'Bestseller',
    },
  ];

  const GALLERY = [
    { img: 'images/christmas-tree-cake.jpg', alt: 'Christmas tree cake with sculpted fondant tree', tall: true },
    { img: 'images/hot-choc-mug-cake.jpg', alt: 'Hot chocolate mug-shaped novelty cake', tall: false },
    { img: 'images/chocolate-tart-snowflake.jpg', alt: 'Dark chocolate tart with snowflake tuile', tall: false },
    { img: 'images/gold-leaf-chocolates.jpg', alt: 'Gold leaf chocolate bites', tall: false },
    { img: 'images/fathers-day-cupcakes.jpg', alt: "Father's Day cupcake selection", tall: true },
    { img: 'images/sticky-toffee-pudding.jpg', alt: 'Sticky toffee pudding with ice cream', tall: false },
    { img: 'images/pink-macarons-wide.jpg', alt: 'Pink macarons being filled', tall: false },
    { img: 'images/chocolate-mousse-fig.jpg', alt: 'Chocolate mousse with fresh fig', tall: false },
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
          <img src="${cake.img}" alt="${cake.name}" loading="lazy">
          ${cake.tag ? `<span class="cake-card-tag">${cake.tag}</span>` : ''}
          <button class="cake-card-quickview" data-quickview="${cake.id}">Quick view</button>
        </div>
        <div class="cake-card-body">
          <h3>${cake.name}</h3>
          <p>${cake.desc}</p>
          <div class="cake-card-footer">
            <span class="cake-card-price">${money(cake.price)}</span>
            <button class="cake-card-add" data-add="${cake.id}" aria-label="Add ${cake.name} to order">+</button>
          </div>
        </div>
      </article>
    `).join('');

    observeReveals();
  }

  function renderGallery() {
    const el = document.getElementById('gallery-grid');
    el.innerHTML = GALLERY.map((item) => `
      <div class="gallery-item ${item.tall ? 'tall' : ''}" data-reveal>
        <img src="${item.img}" alt="${item.alt}" loading="lazy">
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
    document.getElementById('qv-img').src = cake.img;
    document.getElementById('qv-img').alt = cake.name;
    document.getElementById('qv-category').textContent = CATEGORIES.find((c) => c.id === cake.category)?.label || '';
    document.getElementById('qv-title').textContent = cake.name;
    document.getElementById('qv-desc').textContent = cake.desc;
    document.getElementById('qv-price').textContent = money(cake.price);
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

    /* Checkout placeholder */
    document.getElementById('cart-checkout').addEventListener('click', () => {
      const note = document.getElementById('checkout-note');
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

    /* Escape key closes drawer/modal */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeCart(); closeQuickView(); }
    });

    /* Custom order form — placeholder submit handler.
       Replace with a real endpoint (Formspree / Netlify Forms / EmailJS)
       when the site goes live. This only validates + confirms client-side. */
    const orderForm = document.getElementById('order-form');
    const orderStatus = document.getElementById('order-status');
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!orderForm.checkValidity()) {
        orderStatus.textContent = 'Please fill in all fields.';
        orderStatus.setAttribute('data-state', 'error');
        return;
      }
      orderStatus.textContent = "Thanks! Gabby will be in touch about your cake soon.";
      orderStatus.setAttribute('data-state', 'success');
      orderForm.reset();
    });

    /* Sticky header shadow on scroll (small polish touch) */
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 8 ? '0 4px 20px rgba(107,63,63,0.08)' : 'none';
    }, { passive: true });

    observeReveals();
  });
})();
