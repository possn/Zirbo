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
    // manifesto (index — "O Nome Zirbo")
    nome_eyebrow: { pt: "A origem do nome", en: "The origin of the name" },
    nome_lede: {
      pt: "Zirbo é o vento gélido<br>e <em>cortante</em> que sopra<br>sobre a Terra Fria.",
      en: "Zirbo is the icy,<br><em>cutting</em> wind that blows<br>over the Terra Fria."
    },
    nome_p1: {
      pt: "Nas terras altas de Trás-os-Montes, onde o inverno esculpe a paisagem com rigor e silêncio, nasce o Zirbo — o vento frio e cortante que desafia as oliveiras. É sob este clima da Terra Fria que a azeitona amadurece lentamente, concentrando aromas e caráter.",
      en: "In the highlands of Trás-os-Montes, where winter carves the landscape with rigour and silence, the Zirbo is born — the cold, cutting wind that challenges the olive trees. It's under this Terra Fria climate that the olive ripens slowly, concentrating aroma and character."
    },
    nome_p2: {
      pt: "Este azeite virgem extra nasce do encontro entre a dureza da terra e o ouro líquido do lagar. Um tributo à persistência transmontana, enlatado na sua forma mais pura.",
      en: "This extra virgin olive oil is born from the meeting between the harshness of the land and the liquid gold of the mill. A tribute to Trás-os-Montes' persistence, tinned in its purest form."
    },
    nome_sign: { pt: "Zirbo — a força da terra, esculpida pelo vento.", en: "Zirbo — the strength of the land, carved by the wind." },
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
    remove: { pt: "Remover", en: "Remove" },
    back_home: { pt: "Voltar ao início", en: "Back to home" },
    price_tbd: { pt: "A definir", en: "TBD" },
    badge_soon: { pt: "Em breve", en: "Coming soon" },
    badge_study: { pt: "Em estudo", en: "Under study" },
    badge_live: { pt: "Lote piloto", en: "Pilot batch" },
    spec_height: { pt: "Altura", en: "Height" },
    spec_weight: { pt: "Peso (vazio)", en: "Weight (empty)" },
    spec_closure: { pt: "Fecho", en: "Closure" },
    spec_cork: { pt: "Rolha de cortiça", en: "Cork stopper" },
    spec_nozzle: { pt: "Bico", en: "Nozzle" },
    spec_steel: { pt: "Aço inoxidável", en: "Stainless steel" },
    spec_seal: { pt: "Vedante", en: "Seal" },
    spec_cork_nat: { pt: "Cortiça natural", en: "Natural cork" },
    spec_flow: { pt: "Fluxo", en: "Flow" },
    spec_flow_v: { pt: "Controlado, gota a gota", en: "Controlled, drop by drop" },
    // shop page
    shop_hero_eyebrow: { pt: "A coleção Zirbo", en: "The Zirbo collection" },
    shop_hero_title: { pt: "A Loja", en: "The Shop" },
    shop_hero_dek: {
      pt: "O azeite é o primeiro produto. À sua volta, estamos a desenhar uma coleção pequena e bem escolhida de acessórios para a mesa.",
      en: "The olive oil is the first product. Around it, we're designing a small, carefully chosen collection of tableware accessories."
    },
    shop_intro_p: {
      pt: "A loja Zirbo abre com o essencial: o azeite. Os restantes produtos estão em desenvolvimento e serão lançados por fases, à medida que a marca cresce — todos pensados para prolongar a experiência do azeite, da cozinha à mesa.",
      en: "The Zirbo shop opens with the essential: the olive oil. The remaining products are in development and will launch in phases as the brand grows — all designed to extend the olive oil experience, from kitchen to table."
    },
    shop_avail_h: { pt: "Disponível no lançamento", en: "Available at launch" },
    shop_avail_cnt: { pt: "1 produto", en: "1 product" },
    shop_tin_name: { pt: "Azeite Zirbo — Lata 500 ml", en: "Zirbo Olive Oil — 500 ml Tin" },
    shop_tin_desc: {
      pt: "Virgem extra da Terra Fria Transmontana, em lata de alumínio que protege da luz e conserva o azeite. Produção limitada e numerada.",
      en: "Extra virgin from the Terra Fria Transmontana, in an aluminium tin that protects it from light and keeps it fresh. Limited, numbered production."
    },
    shop_tin_pricenote: { pt: "(PVP indicativo — pode ir até 19,00 €)", en: "(indicative retail price — may reach €19.00)" },
    shop_tin_waitlist: { pt: "Ou entrar na lista de espera →", en: "Or join the waitlist →" },
    shop_special_h: { pt: "Edições especiais", en: "Special editions" },
    shop_vidro_name: { pt: "Zirbo Edição Vidro", en: "Zirbo Glass Edition" },
    shop_vidro_desc: {
      pt: "Frasco “Farmácia”, vidro verde antigo, 500 ml, boca de cortiça. O verde do vidro filtra a luz como a lata, mas com o toque nostálgico de um frasco de boticário — fabrico alemão, forma clássica.",
      en: "“Farmácia”-style bottle, antique green glass, 500 ml, cork stopper. The green glass filters light like the tin, with the nostalgic touch of an apothecary jar — German-made, classic shape."
    },
    shop_barro_name: { pt: "Zirbo Edição Barro", en: "Zirbo Clay Edition" },
    shop_barro_desc: {
      pt: "Jarro de grés preto, opaco, 500 ml, boca de cortiça. O barro cozido a alta temperatura bloqueia toda a luz e mantém o azeite fresco — a opção com o carácter mais rústico e mais próximo do lagar.",
      en: "Black stoneware jug, opaque, 500 ml, cork stopper. High-fired clay blocks all light and keeps the oil fresh — the most rustic option, closest to the mill itself."
    },
    shop_special_note: {
      pt: "Estas duas edições estão a ser avaliadas como alternativas premium à lata, para ocasiões de oferta ou coleção. Frascos de fornecedor especializado; ficha técnica sujeita a confirmação final. A lata continua a ser o formato principal do lote piloto.",
      en: "These two editions are being evaluated as premium alternatives to the tin, for gifting or collecting. Vessels from a specialised supplier; specs subject to final confirmation. The tin remains the main format for the pilot batch."
    },
    shop_acc_h: { pt: "Acessórios de mesa", en: "Tableware accessories" },
    shop_dosador_name: { pt: "Dosador de Azeite Premium", en: "Premium Olive Oil Doser" },
    shop_dosador_desc: {
      pt: "Rolha de cortiça natural com bico doseador em aço inoxidável embutido — transforma qualquer garrafa Zirbo num dosador de precisão. Fluxo controlado, sem pingos nem desperdício. Vem em caixa de oferta própria.",
      en: "Natural cork stopper with an embedded stainless-steel dosing spout — turns any Zirbo bottle into a precision doser. Controlled flow, no drips, no waste. Comes in its own gift box."
    },
    shop_galheteiro_name: { pt: "Galheteiro Zirbo", en: "Zirbo Cruet" },
    shop_galheteiro_desc: {
      pt: "Vidro e aço inoxidável, com bico doseador anti-pingo para servir com precisão à mesa — sem desperdício, sem escorrências.",
      en: "Glass and stainless steel, with a drip-free dosing spout for precise pouring at the table — no waste, no mess."
    },
    shop_bandeja_name: { pt: "Bandeja de Degustação", en: "Tasting Tray" },
    shop_bandeja_desc: {
      pt: "Madeira de castanho transmontano, com dois encaixes — um para azeite Zirbo e outro para um segundo azeite ou vinagre, lado a lado, para comparar em cada prova.",
      en: "Trás-os-Montes chestnut wood, with two slots — one for Zirbo olive oil, one for a second oil or vinegar, side by side for tasting comparisons."
    },
    shop_tasting_h: { pt: "Prova & oferta", en: "Tasting & gifting" },
    shop_kit_name: { pt: "Kit de Prova — 3 x 100 ml", en: "Tasting Kit — 3 x 100 ml" },
    shop_kit_desc: {
      pt: "Três miniaturas do mesmo lote ou de colheitas diferentes, para descobrir o Zirbo antes do formato completo.",
      en: "Three miniatures from the same batch or different harvests, to discover Zirbo before committing to the full size."
    },
    shop_gift_name: { pt: "Caixa de Oferta Numerada", en: "Numbered Gift Box" },
    shop_gift_desc: {
      pt: "Uma lata Zirbo em caixa rígida, com o número do lote gravado — pensada para prendas de assinalar.",
      en: "A Zirbo tin in a rigid box, with the batch number engraved — designed for gifts worth marking."
    },
    shop_cards_name: { pt: "Cartão de Receitas Zirbo", en: "Zirbo Recipe Cards" },
    shop_cards_desc: {
      pt: "Um pequeno conjunto de cartões com as receitas típicas da região, para acompanhar a primeira lata.",
      en: "A small set of cards with the region's traditional recipes, to go along with your first tin."
    },
    shop_home_h: { pt: "Casa & cuidado", en: "Home & care" },
    shop_soap_name: { pt: "Sabonete de Azeite Artesanal", en: "Handmade Olive Oil Soap" },
    shop_soap_desc: {
      pt: "Feito a partir da borra do lagar, seguindo uma tradição transmontana de aproveitamento total da azeitona.",
      en: "Made from mill sediment, following a Trás-os-Montes tradition of using the whole olive."
    },
    shop_candle_name: { pt: "Vela Perfumada Zirbo", en: "Zirbo Scented Candle" },
    shop_candle_desc: {
      pt: "Notas de folha de oliveira e xisto molhado — o inverno transmontano traduzido em cera.",
      en: "Notes of olive leaf and wet schist — the Trás-os-Montes winter translated into wax."
    },
    shop_towel_name: { pt: "Pano de Cozinha Bordado", en: "Embroidered Kitchen Towel" },
    shop_towel_desc: {
      pt: "Linho bordado com o emblema Zirbo, inspirado nos enxovais tradicionais transmontanos.",
      en: "Linen embroidered with the Zirbo emblem, inspired by traditional Trás-os-Montes trousseaus."
    },
    shop_footer_note: {
      pt: "Os produtos marcados como “Em breve” ou “Em estudo” ainda não têm data, preço nem especificações finais — esta página funciona como roteiro da coleção, não como catálogo de encomenda. A loja completa, com pagamento e envios, será ativada depois do lançamento do lote piloto de azeite.",
      en: "Products marked “Coming soon” or “Under study” don't yet have a date, price or final specs — this page works as a roadmap for the collection, not an order catalogue. The full shop, with payments and shipping, will be activated after the pilot batch of olive oil launches."
    },
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
