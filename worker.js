// Zirbo Worker
// Serves the static site (via ASSETS binding) and exposes a small API
// to create Stripe Checkout Sessions server-side. The Stripe secret key
// lives only in the Worker's environment (Cloudflare dashboard → Settings
// → Variables and Secrets), never in the repo or the browser.

// Server-side source of truth for prices — never trust the client's price.
const PRODUCTS = {
  "tin-500": {
    name: "Zirbo — Azeite Virgem Extra, Lata 500 ml",
    amount: 1650, // cents, EUR
  },
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/checkout" && request.method === "POST") {
      return handleCheckout(request, env, url);
    }

    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContact(request, env);
    }

    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json" },
      });
    }

    // Everything else: serve the static site.
    return env.ASSETS.fetch(request);
  },
};

async function handleCheckout(request, env, url) {
  try {
    if (!env.STRIPE_SECRET_KEY) {
      return json({ error: "Stripe ainda não está configurado neste servidor." }, 500);
    }

    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) {
      return json({ error: "Carrinho vazio." }, 400);
    }

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("success_url", `${url.origin}/obrigado.html?session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${url.origin}/loja.html`);
    params.set("shipping_address_collection[allowed_countries][0]", "PT");
    params.set("locale", "pt");

    let i = 0;
    for (const item of items) {
      const product = PRODUCTS[item.id];
      if (!product) continue;
      const qty = Math.max(1, Math.min(20, parseInt(item.qty, 10) || 1));
      params.set(`line_items[${i}][price_data][currency]`, "eur");
      params.set(`line_items[${i}][price_data][product_data][name]`, product.name);
      params.set(`line_items[${i}][price_data][unit_amount]`, String(product.amount));
      params.set(`line_items[${i}][quantity]`, String(qty));
      i++;
    }

    if (i === 0) {
      return json({ error: "Nenhum artigo válido no carrinho." }, 400);
    }

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await stripeRes.json();

    if (!stripeRes.ok) {
      return json({ error: data.error?.message || "Erro ao criar sessão de pagamento." }, 502);
    }

    return json({ url: data.url });
  } catch (err) {
    return json({ error: "Erro inesperado no checkout." }, 500);
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "content-type": "application/json" },
  });
}

// Contact form → sends an email via Resend (env.RESEND_API_KEY) to the
// address the form was set up for (CONTACT_TO env var, or a hardcoded
// fallback). The visitor's own address is set as reply-to, so replying
// to the notification email goes straight back to them.
const CONTACT_TO = "geral@zirbo.cc";
const CONTACT_FROM = "Zirbo — Site <site@zirbo.cc>"; // must be a verified sender/domain in Resend

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function handleContact(request, env) {
  try {
    if (!env.RESEND_API_KEY) {
      return json({ error: "O envio de e-mail ainda não está configurado neste servidor." }, 500);
    }

    const body = await request.json();
    const name = (body.name || "").toString().trim().slice(0, 200);
    const email = (body.email || "").toString().trim().slice(0, 200);
    const subject = (body.subject || "Mensagem do site").toString().trim().slice(0, 200);
    const message = (body.message || "").toString().trim().slice(0, 5000);
    const hp = (body.company || "").toString(); // honeypot field, should stay empty

    if (hp) {
      // Likely a bot; pretend success without sending anything.
      return json({ ok: true });
    }

    if (!name || !email || !message) {
      return json({ error: "Preencha nome, e-mail e mensagem." }, 400);
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return json({ error: "E-mail inválido." }, 400);
    }

    const html = `
      <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
      <p><strong>Assunto:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: email,
        subject: `[Zirbo — Contacto] ${subject}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errData = await resendRes.json().catch(() => ({}));
      return json({ error: errData.message || "Erro ao enviar a mensagem." }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    return json({ error: "Erro inesperado ao enviar a mensagem." }, 500);
  }
}
