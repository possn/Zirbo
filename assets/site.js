// Zirbo — site.js
// Cart (localStorage), search overlay, and PT/EN language toggle.
// No backend yet: cart persists locally; checkout leads to a placeholder page.
// Ready to be replaced by real Stripe Checkout + D1 once the business is registered.

(function () {
  "use strict";

  /* ---------------------------------------------------------- PRODUCTS */
  // Only items with a real indicative price are purchasable for now.
  var PRODUCTS = {
    "tin-500": {
      namePt: "Azeite Zirbo — Lata 500 ml",
      nameEn: "Zirbo Olive Oil — 500 ml Tin",
      price: 16.5,
      img: "assets/tin-lifestyle.jpg",
      url: "loja.html"
    }
  };

  /* ---------------------------------------------------------- SEARCH INDEX */
  var SEARCH_INDEX = [
    { pt: "Início", en: "Home", url: "index.html", kw: "zirbo hero brand marca" },
    { pt: "A História do Azeite", en: "The History of Olive Oil", url: "historia-do-azeite.html", kw: "neolítico grécia roma história olive oil history" },
    { pt: "Trás-os-Montes: a Terra Fria", en: "Trás-os-Montes: the Cold Land", url: "tras-os-montes.html", kw: "côa castros romanização mirandês" },
    { pt: "O Azeite na Região", en: "Olive Oil in the Region", url: "terroir.html", kw: "dop trás-os-montes variedades cobrançosa" },
    { pt: "O Azeite em Portugal", en: "Olive Oil in Portugal", url: "azeite-em-portugal.html", kw: "alentejo norte sul dop portugal olive oil" },
    { pt: "Produto & Características", en: "Product & Characteristics", url: "produto.html", kw: "ficha técnica lata acidez produto" },
    { pt: "Efeitos Benéficos", en: "Health Benefits", url: "beneficios.html", kw: "saúde polifenóis benefícios nutrição" },
    { pt: "Receitas Típicas Portuguesas", en: "Traditional Portuguese Recipes", url: "receitas.html", kw: "açorda bacalhau migas broa receitas recipes" },
    { pt: "A Loja", en: "The Shop", url: "loja.html", kw: "comprar lata galheteiro dosador vidro barro shop buy" },
    { pt: "Sobre Nós", en: "About Us", url: "sobre-nos.html", kw: "marca empresa about" },
    { pt: "Contacte-nos", en: "Contact Us", url: "contacto.html", kw: "email contacto contact" },
    { pt: "Azeite Zirbo — Lata 500 ml", en: "Zirbo Olive Oil — 500 ml Tin", url: "loja.html#produto-lata", kw: "lata azeite comprar buy tin oil" },
    { pt: "Dosador de Azeite Premium", en: "Premium Olive Oil Doser", url: "loja.html", kw: "dosador cortiça doser cork" },
    { pt: "Zirbo Edição Vidro", en: "Zirbo Glass Edition", url: "loja.html", kw: "vidro frasco glass bottle" },
    { pt: "Zirbo Edição Barro", en: "Zirbo Clay Edition", url: "loja.html", kw: "barro grés jarro clay jug" }
  ];

  /* ---------------------------------------------------------- I18N DICTIONARY */
  var I18N = {
    // nav
    nav_index: { pt: "Início", en: "Home" },
    nav_historia_do_azeite: { pt: "O Azeite", en: "The Olive Oil" },
    nav_tras_os_montes: { pt: "Trás-os-Montes", en: "Trás-os-Montes" },
    nav_terroir: { pt: "Terroir", en: "Terroir" },
    nav_azeite_em_portugal: { pt: "Portugal", en: "Portugal" },
    nav_produto: { pt: "Produto", en: "Product" },
    nav_beneficios: { pt: "Benefícios", en: "Benefits" },
    nav_receitas: { pt: "Receitas", en: "Recipes" },
    nav_loja: { pt: "Loja", en: "Shop" },
    nav_waitlist: { pt: "Lista de espera", en: "Waitlist" },
    // footer
    footer_tagline: { pt: "A força da terra, esculpida pelo vento.", en: "The strength of the land, carved by the wind." },
    footer_explore: { pt: "Explorar", en: "Explore" },
    footer_more: { pt: "Mais", en: "More" },
    footer_support: { pt: "Apoio ao Cliente", en: "Customer Support" },
    footer_about: { pt: "Sobre Nós", en: "About Us" },
    footer_contact: { pt: "Contacte-nos", en: "Contact Us" },
    footer_delivery: { pt: "Entrega & Devoluções", en: "Delivery & Returns" },
    footer_legal: { pt: "Legal", en: "Legal" },
    footer_privacy: { pt: "Privacidade & Cookies", en: "Privacy & Cookies" },
    footer_withdrawal: { pt: "Direito de Livre Resolução", en: "Right of Withdrawal" },
    footer_odr: { pt: "Resolução de Conflitos Online", en: "Online Dispute Resolution" },
    footer_contact_h: { pt: "Contacto", en: "Contact" },
    footer_region: { pt: "Trás-os-Montes, Portugal", en: "Trás-os-Montes, Portugal" },
    footer_legal_note: {
      pt: "© 2026 Zirbo. Produto de Portugal. Este é um projeto em fase de lançamento — menções de origem, denominação, acidez e efeitos nutricionais estão sujeitas a confirmação do lote e a validação legal antes da comercialização. Conteúdo histórico apresentado para fins editorial, compilado a partir de fontes públicas.",
      en: "© 2026 Zirbo. Product of Portugal. This is a pre-launch project — origin claims, designation, acidity and nutritional statements are subject to batch confirmation and legal validation before commercialisation. Historical content presented for editorial purposes, compiled from public sources."
    },
    // hero (index)
    hero_eyebrow: { pt: "Terra Fria Transmontana · Azeite Virgem Extra", en: "Terra Fria Transmontana · Extra Virgin Olive Oil" },
    hero_tag: { pt: "“A força da terra, esculpida pelo vento.”", en: "“The strength of the land, carved by the wind.”" },
    hero_scroll: { pt: "Descubra", en: "Discover" },
    // search / cart UI
    search_placeholder: { pt: "Procurar na Zirbo…", en: "Search Zirbo…" },
    search_empty: { pt: "Sem resultados.", en: "No results." },
    cart_title: { pt: "O seu carrinho", en: "Your cart" },
    cart_subtotal: { pt: "Subtotal", en: "Subtotal" },
    cart_note: { pt: "Portes calculados no checkout.", en: "Shipping calculated at checkout." },
    cart_checkout: { pt: "Finalizar compra", en: "Checkout" },
    cart_empty: { pt: "O seu carrinho está vazio.", en: "Your cart is empty." },
    add_to_cart: { pt: "Adicionar ao carrinho", en: "Add to cart" },
    added_to_cart: { pt: "Adicionado ao carrinho", en: "Added to cart" },
    remove: { pt: "Remover", en: "Remove" }
  };

  /* ---------------------------------------------------------- HELPERS */
  function getLang() {
    return localStorage.getItem("zirbo_lang") || "pt";
  }
  function setLang(lang) {
    localStorage.setItem("zirbo_lang", lang);
    document.documentElement.lang = lang === "en" ? "en" : "pt-PT";
    document.documentElement.setAttribute("data-lang", lang);
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (I18N[key]) el.innerHTML = I18N[key][lang] || I18N[key].pt;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-ph");
      if (I18N[key]) el.setAttribute("placeholder", I18N[key][lang] || I18N[key].pt);
    });
  }
  function t(key) {
    var lang = getLang();
    return (I18N[key] && (I18N[key][lang] || I18N[key].pt)) || key;
  }
  function fmtPrice(v) {
    var lang = getLang();
    if (lang === "en") return "€" + v.toFixed(2);
    return v.toFixed(2).replace(".", ",") + " €";
  }
  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  /* ---------------------------------------------------------- CART */
  function getCart() {
    try { return JSON.parse(localStorage.getItem("zirbo_cart") || "{}"); }
    catch (e) { return {}; }
  }
  function saveCart(cart) {
    localStorage.setItem("zirbo_cart", JSON.stringify(cart));
    renderCart();
  }
  function addToCart(id, qty) {
    var cart = getCart();
    cart[id] = (cart[id] || 0) + (qty || 1);
    saveCart(cart);
    showToast(t("added_to_cart"));
  }
  function setQty(id, qty) {
    var cart = getCart();
    if (qty <= 0) { delete cart[id]; }
    else { cart[id] = qty; }
    saveCart(cart);
  }
  function cartCount() {
    var cart = getCart(), n = 0;
    for (var id in cart) n += cart[id];
    return n;
  }
  function cartSubtotal() {
    var cart = getCart(), sum = 0;
    for (var id in cart) {
      var p = PRODUCTS[id];
      if (p) sum += p.price * cart[id];
    }
    return sum;
  }
  function renderCart() {
    var countEl = document.getElementById("cartCount");
    var n = cartCount();
    if (countEl) {
      countEl.textContent = n;
      countEl.hidden = n === 0;
    }
    var itemsEl = document.getElementById("cartItems");
    var subtotalEl = document.getElementById("cartSubtotal");
    if (!itemsEl) return;
    var cart = getCart();
    var lang = getLang();
    var ids = Object.keys(cart);
    if (ids.length === 0) {
      itemsEl.innerHTML = '<p class="cart-empty">' + t("cart_empty") + "</p>";
    } else {
      itemsEl.innerHTML = ids.map(function (id) {
        var p = PRODUCTS[id];
        if (!p) return "";
        var name = lang === "en" ? p.nameEn : p.namePt;
        var qty = cart[id];
        return (
          '<div class="cart-item" data-id="' + id + '">' +
            '<img src="' + p.img + '" alt="">' +
            '<div class="ci-info">' +
              '<div class="ci-name">' + name + "</div>" +
              '<div class="ci-price">' + fmtPrice(p.price) + "</div>" +
              '<div class="ci-qty">' +
                '<button data-act="dec" aria-label="-">-</button>' +
                '<span>' + qty + "</span>" +
                '<button data-act="inc" aria-label="+">+</button>' +
                '<button class="ci-remove" data-act="rm">' + t("remove") + "</button>" +
              "</div>" +
            "</div>" +
          "</div>"
        );
      }).join("");
    }
    if (subtotalEl) subtotalEl.textContent = fmtPrice(cartSubtotal());
  }

  function showToast(msg) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  /* ---------------------------------------------------------- SEARCH */
  function renderSearch(query) {
    var resultsEl = document.getElementById("searchResults");
    if (!resultsEl) return;
    var lang = getLang();
    var q = norm(query);
    if (!q) { resultsEl.innerHTML = ""; return; }
    var matches = SEARCH_INDEX.filter(function (item) {
      var hay = norm(item.pt + " " + item.en + " " + item.kw);
      return hay.indexOf(q) !== -1;
    });
    if (matches.length === 0) {
      resultsEl.innerHTML = '<p class="search-empty">' + t("search_empty") + "</p>";
      return;
    }
    resultsEl.innerHTML = matches.map(function (item) {
      var title = lang === "en" ? item.en : item.pt;
      return '<a href="' + item.url + '"><span class="rt">' + title + '</span><span class="rs">' + item.url + "</span></a>";
    }).join("");
  }

  /* ---------------------------------------------------------- INIT */
  document.addEventListener("DOMContentLoaded", function () {
    setLang(getLang());
    renderCart();

    // language toggle
    var langBtn = document.getElementById("langToggle");
    if (langBtn) {
      langBtn.addEventListener("click", function () {
        setLang(getLang() === "en" ? "pt" : "en");
        renderCart();
        var q = document.getElementById("searchInput");
        if (q && q.value) renderSearch(q.value);
      });
    }

    // search overlay
    var searchOverlay = document.getElementById("searchOverlay");
    var searchOpen = document.getElementById("searchOpen");
    var searchClose = document.getElementById("searchClose");
    var searchInput = document.getElementById("searchInput");
    if (searchOpen) searchOpen.addEventListener("click", function () {
      searchOverlay.classList.add("open");
      searchOverlay.setAttribute("aria-hidden", "false");
      setTimeout(function () { searchInput.focus(); }, 50);
    });
    if (searchClose) searchClose.addEventListener("click", closeSearch);
    if (searchOverlay) searchOverlay.addEventListener("click", function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
    function closeSearch() {
      searchOverlay.classList.remove("open");
      searchOverlay.setAttribute("aria-hidden", "true");
    }
    if (searchInput) searchInput.addEventListener("input", function () {
      renderSearch(searchInput.value);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeSearch(); closeCart(); }
    });

    // cart drawer
    var cartDrawer = document.getElementById("cartDrawer");
    var cartScrim = document.getElementById("cartScrim");
    var cartOpenBtn = document.getElementById("cartOpen");
    var cartCloseBtn = document.getElementById("cartClose");
    function openCart() {
      cartDrawer.classList.add("open");
      cartScrim.classList.add("open");
      cartDrawer.setAttribute("aria-hidden", "false");
    }
    function closeCart() {
      cartDrawer.classList.remove("open");
      cartScrim.classList.remove("open");
      cartDrawer.setAttribute("aria-hidden", "true");
    }
    if (cartOpenBtn) cartOpenBtn.addEventListener("click", openCart);
    if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
    if (cartScrim) cartScrim.addEventListener("click", closeCart);

    var cartItemsEl = document.getElementById("cartItems");
    if (cartItemsEl) cartItemsEl.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-act]");
      if (!btn) return;
      var row = e.target.closest(".cart-item");
      var id = row.getAttribute("data-id");
      var cart = getCart();
      var qty = cart[id] || 0;
      if (btn.dataset.act === "inc") setQty(id, qty + 1);
      else if (btn.dataset.act === "dec") setQty(id, qty - 1);
      else if (btn.dataset.act === "rm") setQty(id, 0);
    });

    // add-to-cart buttons
    document.querySelectorAll(".add-cart-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        addToCart(btn.getAttribute("data-product"), 1);
        openCart();
      });
    });

    // checkout — calls the Worker's /api/checkout to create a real Stripe
    // Checkout Session (test mode until the Stripe key is switched to live).
    var checkoutBtn = document.getElementById("cartCheckoutBtn");
    var checkoutError = document.getElementById("checkoutError");
    if (checkoutBtn) checkoutBtn.addEventListener("click", function () {
      var cart = getCart();
      var items = Object.keys(cart).map(function (id) { return { id: id, qty: cart[id] }; });
      if (items.length === 0) {
        showToast(t("cart_empty"));
        return;
      }
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = "…";
      if (checkoutError) checkoutError.style.display = "none";
      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items }),
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.url) {
            window.location.href = data.url;
          } else {
            throw new Error(data.error || "checkout error");
          }
        })
        .catch(function () {
          checkoutBtn.disabled = false;
          checkoutBtn.textContent = t("cart_checkout");
          if (checkoutError) {
            checkoutError.textContent = getLang() === "en"
              ? "Checkout isn't available yet — please try the waitlist instead."
              : "O checkout ainda não está disponível — use a lista de espera por agora.";
            checkoutError.style.display = "block";
          }
        });
    });
  });
})();
