// Zirbo — site.js
// Cart (localStorage), search overlay, and PT/EN language toggle.
// Cart persists locally (localStorage); checkout hands off to the Worker's
// /api/checkout, which creates a real Stripe Checkout Session server-side.
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
      url: "produto.html"
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
    { pt: "Azeite Zirbo — Lata 500 ml", en: "Zirbo Olive Oil — 500 ml Tin", url: "produto.html", kw: "lata azeite comprar buy tin oil" },
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
    nav_shop_cta: { pt: "Comprar", en: "Shop now" },
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
    banner_eyebrow: { pt: "Cultivo próprio", en: "Our own growing" },
    banner_h: { pt: "As oliveiras são nossas.", en: "The olive trees are ours." },
    banner_p: {
      pt: "Sequeiro, poda à mão, sem atalhos — cultivadas à moda antiga no nosso olival em Trás-os-Montes, e prensadas do mesmo modo num lagar regional.",
      en: "Rain-fed, hand-pruned, no shortcuts — grown the old way in our own olive grove in Trás-os-Montes, and pressed the same way at a regional mill."
    },
    banner_cta: { pt: "Conheça o nosso olival →", en: "See our olive grove →" },
    nf_eyebrow: { pt: "Erro 404", en: "404 Error" },
    nf_title: { pt: "Esta página perdeu-se no olival.", en: "This page got lost in the grove." },
    nf_dek: {
      pt: "A página que procura não existe, foi movida, ou o link está incorreto. Mas o azeite continua onde sempre esteve.",
      en: "The page you're looking for doesn't exist, was moved, or the link is wrong. But the olive oil is right where it's always been."
    },
    nf_home: { pt: "Voltar ao início", en: "Back to home" },
    nf_shop: { pt: "Ir para a Loja →", en: "Go to the Shop →" },
    nf_explore: { pt: "Talvez procure isto", en: "You might be looking for" },
    lote_eyebrow: { pt: "Produção limitada e numerada", en: "Limited, numbered production" },
    lote_h: { pt: "1.000 latas.<br>Uma só colheita.", en: "1,000 tins.<br>One single harvest." },
    lote_p: { pt: "O primeiro lote Zirbo é limitado e numerado. Depois de esgotado, só a próxima colheita trará mais.", en: "The first Zirbo batch is limited and numbered. Once it sells out, only next harvest's batch will bring more." },
    lote_cta: { pt: "Comprar agora →", en: "Buy now →" },
    lote_fineprint: { pt: "Envio após confirmação da ficha técnica final do lote.", en: "Shipping begins once the batch's final spec sheet is confirmed." },
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
    // história do azeite
    ha_eyebrow: { pt: "Seis mil anos de civilização", en: "Six thousand years of civilisation" },
    ha_title: { pt: "A História do Azeite", en: "The History of Olive Oil" },
    ha_dek: {
      pt: "Do Neolítico às mesas de hoje: como um fruto amargo se tornou pilar de impérios, religiões e da própria ideia de Mediterrâneo.",
      en: "From the Neolithic to today's tables: how a bitter fruit became the pillar of empires, religions, and the very idea of the Mediterranean."
    },
    ha_h1: { pt: "As primeiras prensas", en: "The first presses" },
    ha_p1: {
      pt: "As evidências mais antigas do uso da oliveira remontam a cerca de 5000 a.C., na costa do Monte Carmelo, na atual Israel — uma região com saída direta para o Mediterrâneo. Escavações no sítio neolítico de Kfar Samir revelaram prensas de azeitona rudimentares, prova de que a extração de azeite já era praticada muito antes da escrita.",
      en: "The earliest evidence of olive use dates back to around 5000 BC, on the coast of Mount Carmel in modern-day Israel — a region with direct access to the Mediterranean. Excavations at the Neolithic site of Kfar Samir revealed rudimentary olive presses, proof that oil extraction was practised long before writing."
    },
    ha_p2: {
      pt: "Por volta de 3000 a.C., a oliveira já se cultivava por todo o Crescente Fértil. Os povos da Mesopotâmia usavam o azeite para se proteger do frio e untavam o corpo antes de batalhas — um óleo que era, ao mesmo tempo, alimento, medicina e armadura simbólica.",
      en: "By around 3000 BC, the olive tree was already cultivated across the Fertile Crescent. The peoples of Mesopotamia used olive oil to protect against the cold and anointed their bodies before battle — an oil that was, at once, food, medicine, and symbolic armour."
    },
    ha_h2: { pt: "Ouro líquido no comércio antigo", en: "Liquid gold in ancient trade" },
    ha_p3: {
      pt: "A propagação da cultura do azeite pelo Mediterrâneo deve-se, em grande parte, aos fenícios — os grandes navegadores e comerciantes da Antiguidade. A Bíblia regista trocas comerciais de azeite entre a cidade fenícia de Tiro e o Egito, e o Antigo Testamento descreve o rei Salomão a pagar a Hirão de Tiro com milhares de batos de azeite pela construção do Templo de Jerusalém.",
      en: "The spread of olive-growing across the Mediterranean owes much to the Phoenicians — Antiquity's great navigators and traders. The Bible records olive oil trade between the Phoenician city of Tyre and Egypt, and the Old Testament describes King Solomon paying Hiram of Tyre thousands of baths of oil for building the Temple of Jerusalem."
    },
    ha_pull1: { pt: "Foi por esta raridade e valor de troca que o azeite ficou conhecido, na Antiguidade, como “ouro líquido”.", en: "It was this scarcity and trade value that earned olive oil, in Antiquity, the name “liquid gold”." },
    ha_fig1: { pt: "Ânfora grega de figuras negras retratando a colheita da azeitona — a cena agrícola mais antiga registada na cerâmica ática.", en: "Black-figure Greek amphora depicting the olive harvest — the oldest agricultural scene recorded on Attic pottery." },
    ha_h3: { pt: "A árvore sagrada da Grécia", en: "Greece's sacred tree" },
    ha_p4: {
      pt: "Foi na Grécia Antiga que o azeite e a oliveira alcançaram o estatuto que hoje reconhecemos. As tabuinhas em Linear B encontradas nos palácios de Micenas e Pilos documentam já a produção e o comércio de azeite na Grécia micénica, séculos antes de Homero.",
      en: "It was in Ancient Greece that olive oil and the olive tree reached the status we recognise today. Linear B tablets found in the palaces of Mycenae and Pylos already document olive oil production and trade in Mycenaean Greece, centuries before Homer."
    },
    ha_p5: {
      pt: "No século VI a.C., Sólon — o grande legislador ateniense — decretou uma das primeiras leis de proteção ambiental da história: proibiu o corte descontrolado de oliveiras. Os atletas dos Jogos Olímpicos antigos untavam o corpo com azeite antes das provas, e os vencedores eram coroados com ramos de oliveira cortados com uma foice de ouro. Entre os séculos VII e III a.C., filósofos, médicos e historiadores gregos dedicaram-se a estudar as propriedades do azeite — o mesmo conhecimento que a ciência moderna hoje “redescobre” ao investigar a dieta mediterrânica.",
      en: "In the 6th century BC, Solon — the great Athenian lawmaker — issued one of history's first environmental protection laws: a ban on the uncontrolled felling of olive trees. Ancient Olympic athletes anointed their bodies with oil before competing, and winners were crowned with olive branches cut with a golden sickle. Between the 7th and 3rd centuries BC, Greek philosophers, physicians and historians studied the properties of olive oil — the same knowledge modern science now “rediscovers” when researching the Mediterranean diet."
    },
    ha_h4: { pt: "Roma e a expansão pelo Império", en: "Rome and expansion across the Empire" },
    ha_p6: {
      pt: "Com a expansão do Império Romano, o cultivo da oliveira alastrou-se para novas províncias — Hispânia, Tunísia e Líbia — entre os séculos I e III d.C. Os romanos aperfeiçoaram as técnicas de prensagem e, sobretudo, o transporte: milhões de ânforas de azeite circulavam pelas rotas marítimas do Império.",
      en: "As the Roman Empire expanded, olive cultivation spread to new provinces — Hispania, Tunisia and Libya — between the 1st and 3rd centuries AD. The Romans refined pressing techniques and, above all, transport: millions of olive oil amphorae travelled the Empire's maritime routes."
    },
    ha_p7: {
      pt: "Em Roma, chegou a formar-se uma colina artificial — o Monte Testaccio — composta quase inteiramente por cacos de ânforas de azeite descartadas ao longo de séculos, um testemunho silencioso da escala do consumo romano. A Hispânia, de que Portugal fazia parte enquanto território da Lusitânia, tornou-se uma das províncias mais produtivas de azeite de todo o Império.",
      en: "In Rome, an artificial hill even formed — Monte Testaccio — made up almost entirely of discarded olive oil amphora shards accumulated over centuries, a silent testament to the scale of Roman consumption. Hispania, of which Portugal was part as the territory of Lusitania, became one of the Empire's most productive olive oil provinces."
    },
    ha_h5: { pt: "Da Idade Média aos dias de hoje", en: "From the Middle Ages to today" },
    ha_p8: {
      pt: "Durante a Idade Média, mosteiros e comunidades agrícolas mantiveram viva a tradição olivícola herdada de Roma, e fontes portuguesas atribuem aos árabes um papel importante no aperfeiçoamento das técnicas de cultivo do olival na Península Ibérica. O azeite manteve, ao longo de séculos, um papel simbólico em rituais religiosos — da unção de reis e sacerdotes às lâmpadas votivas.",
      en: "During the Middle Ages, monasteries and farming communities kept alive the olive-growing tradition inherited from Rome, and Portuguese sources credit the Arabs with an important role in refining olive-growing techniques on the Iberian Peninsula. For centuries, olive oil retained a symbolic role in religious rites — from anointing kings and priests to votive lamps."
    },
    ha_p9: {
      pt: "Hoje, a bacia do Mediterrâneo continua a ser responsável por cerca de 95% da produção mundial de azeite, e a Dieta Mediterrânica — da qual o azeite é pilar central — é reconhecida pela UNESCO como Património Cultural Imaterial da Humanidade. É esta linhagem milenar que chega, gota a gota, a cada lata de Zirbo.",
      en: "Today, the Mediterranean basin is still responsible for around 95% of the world's olive oil production, and the Mediterranean Diet — of which olive oil is a central pillar — is recognised by UNESCO as Intangible Cultural Heritage of Humanity. It's this millennia-old lineage that arrives, drop by drop, in every tin of Zirbo."
    },
    ha_t1: { pt: "Primeiras prensas, Monte Carmelo", en: "First presses, Mount Carmel" },
    ha_t2: { pt: "Lei de Sólon, Atenas", en: "Solon's law, Athens" },
    ha_t3: { pt: "Expansão romana pela Hispânia", en: "Roman expansion across Hispania" },
    ha_t4n: { pt: "Hoje", en: "Today" },
    ha_t4: { pt: "Património da Humanidade (UNESCO)", en: "World Heritage (UNESCO)" },
    // trás-os-montes
    tom_eyebrow: { pt: "Milhares de anos atrás dos montes", en: "Thousands of years behind the mountains" },
    tom_title: { pt: "Trás-os-Montes: a Terra Fria", en: "Trás-os-Montes: the Cold Land" },
    tom_dek: {
      pt: "Uma região que a sua própria geografia isolou — e que, por isso mesmo, guarda alguns dos vestígios humanos mais antigos da Península Ibérica.",
      en: "A region isolated by its own geography — and which, for that very reason, holds some of the oldest human traces on the Iberian Peninsula."
    },
    tom_h1: { pt: "Os primeiros sinais humanos", en: "The first signs of human presence" },
    tom_p1: {
      pt: "Muito antes de haver nome para esta terra, já havia mãos a gravar pedra. No Vale do Côa, perto de Vila Nova de Foz Côa, encontram-se milhares de gravuras rupestres a céu aberto, feitas ao longo de mais de 20.000 anos — entre o Paleolítico Superior (cerca de 25.000–10.000 a.C.) e a Idade do Ferro. Cavalos, auroques, cabras-monteses e veados foram entalhados nas rochas de xisto às margens do rio Côa, com um realismo que ainda hoje impressiona arqueólogos.",
      en: "Long before this land had a name, hands were already carving stone. In the Côa Valley, near Vila Nova de Foz Côa, thousands of open-air rock engravings can be found, made over more than 20,000 years — between the Upper Palaeolithic (roughly 25,000–10,000 BC) and the Iron Age. Horses, aurochs, ibex and deer were carved into the schist rocks along the Côa river, with a realism that still impresses archaeologists today."
    },
    tom_pull1: {
      pt: "Estas são consideradas as primeiras obras-primas da humanidade em Portugal — e uma das maiores concentrações de arte rupestre paleolítica ao ar livre do mundo.",
      en: "These are considered humanity's first masterpieces in Portugal — and one of the world's largest concentrations of open-air Palaeolithic rock art."
    },
    tom_fig1: { pt: "Gravuras rupestres no Vale do Côa — figuras de animais entalhadas em xisto há mais de 20 mil anos.", en: "Rock engravings in the Côa Valley — animal figures carved into schist more than 20,000 years ago." },
    tom_fig2: { pt: "A ponte romana de Trajano, em Chaves (a antiga Aquae Flaviae) — ainda hoje em uso, quase dois mil anos depois.", en: "Trajan's Roman bridge in Chaves (ancient Aquae Flaviae) — still in use today, nearly two thousand years later." },
    tom_fig3: { pt: "A transição entre planalto e vale — onde a Terra Fria cede lugar a um microclima capaz de sustentar o olival.", en: "The transition between plateau and valley — where the Terra Fria gives way to a microclimate able to sustain olive groves." },
    tom_p2: {
      pt: "O sítio esteve prestes a desaparecer sob as águas de uma barragem projetada nos anos 90; a descoberta pública das gravuras, em 1994, travou a obra. Em 1998, a UNESCO classificou o Vale do Côa como Património Mundial — o primeiro parque arqueológico português.",
      en: "The site was about to disappear under the waters of a dam planned in the 1990s; the public discovery of the engravings in 1994 halted the project. In 1998, UNESCO designated the Côa Valley a World Heritage Site — Portugal's first archaeological park."
    },
    tom_h2: { pt: "Os castros: aldeias fortificadas da Idade do Ferro", en: "The castros: fortified Iron Age villages" },
    tom_p3: {
      pt: "Séculos mais tarde, as terras altas de Trás-os-Montes encheram-se de castros — povoados fortificados de planta circular, construídos em granito e xisto, característicos do Noroeste da Península Ibérica. A região regista uma concentração particularmente densa destes povoados nas zonas de maior altitude, acima dos 750 metros, em concelhos como Montalegre, Boticas, Vinhais e Bragança.",
      en: "Centuries later, the highlands of Trás-os-Montes filled with castros — fortified, circular hilltop settlements built in granite and schist, characteristic of northwestern Iberia. The region shows a particularly dense concentration of these settlements at higher altitudes, above 750 metres, in municipalities such as Montalegre, Boticas, Vinhais and Bragança."
    },
    tom_p4: {
      pt: "Eram comunidades agropastoris, com metalurgia própria e uma cultura de influência céltica, organizadas em torno da criação de gado, da guerra e do artesanato. Muitos destes castros mantiveram-se habitados mesmo depois da chegada de Roma — um sinal de resistência que ainda hoje parece definir o carácter transmontano.",
      en: "These were farming and herding communities with their own metalworking and a Celtic-influenced culture, organised around livestock, warfare and craft. Many of these castros remained inhabited even after Rome's arrival — a sign of resistance that still seems to define the character of Trás-os-Montes today."
    },
    tom_h3: { pt: "A romanização — incompleta e à sua maneira", en: "Romanisation — incomplete, and on its own terms" },
    tom_p5: {
      pt: "Roma chegou a Trás-os-Montes através de uma rede de vias — as chamadas Vias Augustas — que ligavam Bracara Augusta (Braga) a Aquae Flaviae (Chaves, célebre pelas suas termas e pela ponte romana ainda em uso) e daí até Bragança. Ao longo destas estradas surgiram pontes, marcos miliários e inscrições em latim que ainda hoje se encontram em vilas como Favaios.",
      en: "Rome reached Trás-os-Montes through a network of roads — the so-called Vias Augustas — linking Bracara Augusta (Braga) to Aquae Flaviae (Chaves, famous for its thermal springs and its Roman bridge, still in use) and on to Bragança. Along these roads, bridges, milestones and Latin inscriptions appeared that can still be found today in villages like Favaios."
    },
    tom_p6: {
      pt: "Mas a romanização desta terra foi, comparada com o litoral, lenta e parcial: estudos arqueológicos ao território de Trás-os-Montes Oriental identificam sinais claros de romanização em pouco menos de metade dos castros inventariados na região. É um detalhe revelador — mesmo sob o Império, esta continuou a ser uma terra que resistia à uniformização.",
      en: "But this land's Romanisation was, compared to the coast, slow and partial: archaeological studies of eastern Trás-os-Montes identify clear signs of Romanisation in just under half of the region's catalogued castros. It's a revealing detail — even under the Empire, this remained a land that resisted uniformity."
    },
    tom_h4: { pt: "Terra Fria, Terra Quente", en: "Cold Land, Warm Land" },
    tom_p7: {
      pt: "Geograficamente, Trás-os-Montes divide-se em duas metades de temperamento oposto. A Terra Fria é o planalto de invernos rigorosos onde nasce o vento Zirbo — paisagem de xisto e granito, castanheiros centenários e aldeias de pedra. A Terra Quente estende-se pelos vales mais amenos do Douro e do Sabor, onde o microclima permite culturas que o planalto recusa, incluindo, historicamente, o olival.",
      en: "Geographically, Trás-os-Montes splits into two halves of opposite temperament. The Terra Fria is the plateau of harsh winters where the Zirbo wind is born — a landscape of schist and granite, centuries-old chestnut trees and stone villages. The Terra Quente stretches along the milder valleys of the Douro and Sabor rivers, where the microclimate allows crops the plateau refuses, including, historically, the olive tree."
    },
    tom_p8: {
      pt: "Foi este isolamento — a própria origem do nome “Trás-os-Montes”, a terra que fica atrás da cordilheira que a separa do litoral — que moldou séculos de austeridade, transumância e uma agricultura de subsistência transformada, com o tempo, em identidade.",
      en: "It was this isolation — the very origin of the name “Trás-os-Montes”, the land that lies behind the mountain range separating it from the coast — that shaped centuries of austerity, seasonal herding, and a subsistence agriculture that, over time, became identity."
    },
    tom_h5: { pt: "Uma identidade que resistiu ao tempo", en: "An identity that outlasted time" },
    tom_p9: {
      pt: "Nenhum símbolo ilustra melhor essa resistência do que o mirandês. Falado na região de Miranda do Douro, este idioma de raiz asturo-leonesa sobreviveu séculos de isolamento por transmissão oral, até ser “descoberto” pelo filólogo José Leite de Vasconcelos em 1882. Em 29 de janeiro de 1999, tornou-se, por lei, a segunda língua oficial de Portugal — um reconhecimento tardio de uma voz muito antiga.",
      en: "No symbol illustrates that resistance better than Mirandese. Spoken in the Miranda do Douro region, this Astur-Leonese-rooted language survived centuries of isolation through oral transmission, until it was “discovered” by philologist José Leite de Vasconcelos in 1882. On 29 January 1999, it legally became Portugal's second official language — a late recognition of a very old voice."
    },
    tom_t1: { pt: "Arte rupestre do Côa", en: "Côa rock art" },
    tom_t2n: { pt: "Idade do Ferro", en: "Iron Age" },
    tom_t2: { pt: "Castros nas terras altas", en: "Castros in the highlands" },
    tom_t3n: { pt: "Séc. I d.C.", en: "1st c. AD" },
    tom_t3: { pt: "Vias romanas Braga–Bragança", en: "Roman roads, Braga–Bragança" },
    tom_t4: { pt: "Mirandês, língua oficial", en: "Mirandese, official language" },
    // terroir (o azeite em trás-os-montes)
    ter_eyebrow: { pt: "O azeite na região", en: "Olive oil in the region" },
    ter_title: { pt: "O Azeite em Trás-os-Montes", en: "Olive Oil in Trás-os-Montes" },
    ter_dek: {
      pt: "Onde a oliveira desafia o planalto: a história de como esta terra fria se tornou, contra as probabilidades, uma origem de azeite reconhecida.",
      en: "Where the olive tree defies the plateau: the story of how this cold land became, against the odds, a recognised olive oil origin."
    },
    ter_h1: { pt: "Uma introdução romana, num microclima favorável", en: "A Roman introduction, in a favourable microclimate" },
    ter_p1: {
      pt: "A presença da oliveira em Trás-os-Montes remonta provavelmente à romanização, introduzida ao longo dos vales encaixados do Douro e do Sabor — onde o microclima, mais ameno do que o planalto envolvente, permite o que a Terra Fria recusa. É nesses vales, e não nas terras altas, que a azeitona sempre encontrou o seu lugar na região.",
      en: "The olive tree's presence in Trás-os-Montes probably dates back to Romanisation, introduced along the steep valleys of the Douro and Sabor rivers — where the microclimate, milder than the surrounding plateau, allows what the Terra Fria refuses. It's in these valleys, not the highlands, that the olive has always found its place in the region."
    },
    ter_pull1: {
      pt: "Já no século XVIII, o médico Francisco da Fonseca Henriques recomendava, na sua obra Medicina Lusitana, comer pão quente com azeite novo saído diretamente do lagar — prova de uma tradição de consumo com séculos de enraizamento popular.",
      en: "As early as the 18th century, physician Francisco da Fonseca Henriques recommended, in his work Medicina Lusitana, eating warm bread with new oil straight from the mill — proof of a consumption tradition rooted in popular practice for centuries."
    },
    ter_h2: { pt: "Uma Denominação de Origem Protegida", en: "A Protected Designation of Origin" },
    ter_p2: {
      pt: "Hoje, a região tem direito a uma Denominação de Origem Protegida própria — a Azeite de Trás-os-Montes DOP —, que abrange concelhos como Mirandela, Vila Flor, Alfândega da Fé, Macedo de Cavaleiros, Vila Nova de Foz Côa e Carrazeda de Ansiães, entre outros. É uma das denominações de origem mais antigas e consagradas de Portugal, sustentada por regras rígidas de produção, colheita e engarrafamento na própria região.",
      en: "Today, the region holds its own Protected Designation of Origin — Azeite de Trás-os-Montes DOP — covering municipalities such as Mirandela, Vila Flor, Alfândega da Fé, Macedo de Cavaleiros, Vila Nova de Foz Côa and Carrazeda de Ansiães, among others. It's one of Portugal's oldest and most established designations of origin, underpinned by strict rules for production, harvesting and bottling within the region itself."
    },
    ter_p3: {
      pt: "O concelho de Mirandela — também conhecido pela sua alheira — concentra os olivais mais importantes da região, ocupando cerca de 35% da sua área agrícola.",
      en: "The municipality of Mirandela — also known for its alheira sausage — holds the region's most important olive groves, covering around 35% of its farmland."
    },
    ter_h3: { pt: "Quatro variedades, um carácter", en: "Four varieties, one character" },
    ter_fig1: { pt: "Uma oliveira do nosso olival — plantada há mais de meio século, ainda a dar fruto.", en: "An olive tree from our own grove — planted more than half a century ago, still bearing fruit." },
    ter_fig2: { pt: "Uma árvore carregada, ainda a semanas da colheita — as quatro variedades lado a lado no mesmo olival.", en: "A tree heavy with fruit, still weeks from harvest — the four varieties side by side in the same grove." },
    ter_p4: { pt: "O perfil do azeite transmontano nasce do equilíbrio entre quatro variedades autóctones:", en: "The character of Trás-os-Montes olive oil comes from the balance of four native varieties:" },
    ter_v1: { pt: "Contribui com amargor e picante", en: "Adds bitterness and pungency" },
    ter_v2: { pt: "Sabor frutado mais intenso", en: "More intense fruity flavour" },
    ter_v3: { pt: "Perfil suave e aromático", en: "Soft, aromatic profile" },
    ter_v4: { pt: "Contribui para o teor de ácidos monoinsaturados", en: "Contributes to monounsaturated fat content" },
    ter_p5: {
      pt: "O resultado é um azeite equilibrado, de cor amarelo-esverdeada, com aroma e sabor a fruto fresco — por vezes amendoado — e uma sensação notável de doce, verde, amargo e picante em conjunto. São estas características particulares que distinguem o azeite de Trás-os-Montes dos restantes azeites do país.",
      en: "The result is a balanced oil, yellow-green in colour, with the aroma and flavour of fresh fruit — sometimes almond-like — and a notable combination of sweet, green, bitter and pungent notes. These particular characteristics are what set Trás-os-Montes olive oil apart from the rest of the country's oils."
    },
    ter_sign: { pt: "É este terroir — e não ainda uma certificação — que Zirbo procura honrar.", en: "It's this terroir — not yet a certification — that Zirbo seeks to honour." },
    ter_t1n: { pt: "Antiguidade", en: "Antiquity" },
    ter_t1: { pt: "Introdução romana da oliveira", en: "Roman introduction of the olive tree" },
    ter_t2n: { pt: "Séc. XVIII", en: "18th c." },
    ter_t2: { pt: "Registo de Fonseca Henriques", en: "Fonseca Henriques' record" },
    ter_t3: { pt: "Variedades autóctones", en: "Native varieties" },
    // azeite em portugal
    pt2_eyebrow: { pt: "Um país, dois olivais", en: "One country, two olive groves" },
    pt2_title: { pt: "O Azeite em Portugal", en: "Olive Oil in Portugal" },
    pt2_dek: {
      pt: "Do planalto transmontano às planícies do Alentejo: como o mesmo fruto dá origem a azeites — e a modelos de agricultura — completamente diferentes.",
      en: "From the Trás-os-Montes plateau to the Alentejo plains: how the same fruit gives rise to completely different oils — and completely different farming models."
    },
    pt2_h1: { pt: "De importador a exportador", en: "From importer to exporter" },
    pt2_p1: {
      pt: "Durante décadas, Portugal dependeu de importações para ter azeite à mesa. Essa história mudou por completo: desde 2014, o país é autossuficiente em azeite, e a produção nacional atingiu cerca de 150 mil toneladas na campanha de 2019–2020 — um volume que transformou Portugal num exportador global, não já num importador.",
      en: "For decades, Portugal relied on imports to get olive oil onto the table. That story has completely changed: since 2014, the country has been self-sufficient in olive oil, and national production reached around 150,000 tonnes in the 2019–2020 season — a volume that turned Portugal into a global exporter, no longer an importer."
    },
    pt2_p2: {
      pt: "Essa transformação tem uma geografia muito clara: fez-se sobretudo a Sul, no Alentejo. Mas a história do azeite português continua a escrever-se, também, nos moldes antigos do Norte — onde nasce o Zirbo.",
      en: "This transformation has a very clear geography: it happened mostly in the South, in the Alentejo. But the story of Portuguese olive oil is still being written, too, in the old ways of the North — where Zirbo is born."
    },
    pt2_h2: { pt: "Norte e Sul: duas formas de fazer azeite", en: "North and South: two ways of making olive oil" },
    pt2_p3: {
      pt: "Poucas culturas agrícolas ilustram tão bem o contraste entre o Portugal do interior norte e o Portugal do Sul como o olival.",
      en: "Few crops illustrate the contrast between inland northern Portugal and southern Portugal as well as the olive tree does."
    },
    pt2_col1_h: { pt: "Norte — Trás-os-Montes & Beira", en: "North — Trás-os-Montes & Beira" },
    pt2_col1_l1: { pt: "Olival tradicional, de sequeiro (sem rega)", en: "Traditional, rainfed olive groves (no irrigation)" },
    pt2_col1_l2: { pt: "Encostas de xisto e granito, terreno acidentado", en: "Schist and granite hillsides, rugged terrain" },
    pt2_col1_l3: { pt: "70 a 120 árvores por hectare", en: "70 to 120 trees per hectare" },
    pt2_col1_l4: { pt: "Colheita frequentemente manual", en: "Often hand-harvested" },
    pt2_col1_l5: { pt: "Variedades autóctones: Cobrançosa, Verdeal, Madural", en: "Native varieties: Cobrançosa, Verdeal, Madural" },
    pt2_col1_l6: { pt: "Azeites mais amargos, picantes e complexos", en: "More bitter, pungent, complex oils" },
    pt2_col2_h: { pt: "Sul — Alentejo", en: "South — Alentejo" },
    pt2_col2_l1: { pt: "Olival intensivo e superintensivo, regado", en: "Intensive and super-intensive, irrigated groves" },
    pt2_col2_l2: { pt: "Planícies, regadio do Alqueva", en: "Plains, Alqueva irrigation" },
    pt2_col2_l3: { pt: "Centenas a milhares de árvores por hectare, em sebe", en: "Hundreds to thousands of trees per hectare, hedgerow-style" },
    pt2_col2_l4: { pt: "Colheita totalmente mecanizada", en: "Fully mechanised harvest" },
    pt2_col2_l5: { pt: "Variedades internacionais: Arbequina, Arbosana, Picual", en: "International varieties: Arbequina, Arbosana, Picual" },
    pt2_col2_l6: { pt: "Azeites mais suaves, produção em grande escala", en: "Milder oils, large-scale production" },
    pt2_fig1: { pt: "Olival superintensivo em sebe, colhido por máquina — o modelo que hoje domina a produção nacional.", en: "Super-intensive hedgerow grove, machine-harvested — the model that now dominates national production." },
    pt2_fig2: { pt: "No Norte, a colheita continua a fazer-se árvore a árvore, com escada e à mão.", en: "In the North, the harvest is still done tree by tree, by hand, from a ladder." },
    pt2_pull1: {
      pt: "O Alentejo, impulsionado pela água do Alqueva, passa hoje a área de olival tradicional em olival “moderno” a um ritmo notável — e concentra hoje entre 76% e 85% de toda a produção nacional de azeite.",
      en: "The Alentejo, driven by Alqueva's water, is converting traditional groves into “modern” ones at a remarkable pace — and now accounts for between 76% and 85% of the country's entire olive oil production."
    },
    pt2_p4: {
      pt: "É um modelo eficiente e, para muitos produtores, uma revolução económica genuína para o Baixo Alentejo. Também gera debate: associações ambientalistas têm alertado para o consumo de água e o impacto na biodiversidade da região; a associação de olivicultores do Sul contrapõe que o olival moderno está entre as culturas mais eficientes do perímetro do Alqueva em termos de água por hectare. É uma discussão em aberto, própria de qualquer transformação agrícola desta escala.",
      en: "It's an efficient model and, for many producers, a genuine economic revolution for the Lower Alentejo. It also sparks debate: environmental groups have raised concerns about water use and the impact on the region's biodiversity; the southern olive growers' association counters that modern groves are among the most water-efficient crops in the Alqueva irrigation perimeter, per hectare. It's an open discussion, typical of any agricultural transformation of this scale."
    },
    pt2_h3: { pt: "Seis Denominações de Origem Protegida", en: "Six Protected Designations of Origin" },
    pt2_p5: {
      pt: "Portugal tem seis regiões de azeite certificadas com Denominação de Origem Protegida (DOP) pela União Europeia, cada uma com o seu próprio conjunto de variedades e carácter sensorial:",
      en: "Portugal has six olive oil regions certified with a Protected Designation of Origin (PDO) by the European Union, each with its own set of varieties and sensory character:"
    },
    pt2_dop1: { pt: "Cobrançosa, Verdeal Transmontana, Madural, Cordovil — equilibrado, amendoado, doce-verde-amargo-picante.", en: "Cobrançosa, Verdeal Transmontana, Madural, Cordovil — balanced, almond-like, sweet-green-bitter-pungent." },
    pt2_dop2: { pt: "Galega, Cobrançosa, Cornicabra (Beira Alta); Galega, Bical, Cordovil (Beira Baixa) — baixa acidez, sabor a fruto.", en: "Galega, Cobrançosa, Cornicabra (Beira Alta); Galega, Bical, Cordovil (Beira Baixa) — low acidity, fruity flavour." },
    pt2_dop3: { pt: "Galega Vulgar predominante — a região dos azeites doces por excelência.", en: "Predominantly Galega Vulgar — the region of sweet oils par excellence." },
    pt2_dop4: { pt: "Galega, Carrasquenha, Redondil — frutado a maçã madura, cor amarelo-ouro.", en: "Galega, Carrasquenha, Redondil — ripe-apple fruitiness, golden-yellow colour." },
    pt2_dop5: { pt: "Galega, Cordovil de Serpa, Cobrançosa — condições edafoclimáticas muito próprias.", en: "Galega, Cordovil de Serpa, Cobrançosa — very distinctive soil and climate conditions." },
    pt2_dop6: { pt: "Cordovil de Serpa, Galega, Verdeal Alentejana — muito frutado, amargo e picante.", en: "Cordovil de Serpa, Galega, Verdeal Alentejana — very fruity, bitter and pungent." },
    pt2_h4: { pt: "As variedades — um retrato", en: "The varieties — a portrait" },
    pt2_p6: { pt: "Portugal cultiva dezenas de variedades de azeitona, mas um pequeno grupo domina a paisagem:", en: "Portugal grows dozens of olive varieties, but a small group dominates the landscape:" },
    pt2_var1: { pt: "A mais difundida no país; doce e suave", en: "The most widespread in the country; sweet and mild" },
    pt2_var2: { pt: "Norte e Alentejo; amargor e picante", en: "North and Alentejo; bitterness and pungency" },
    pt2_var3: { pt: "Várias sub-regiões; alto teor de ácidos monoinsaturados", en: "Several sub-regions; high monounsaturated fat content" },
    pt2_var4: { pt: "Transmontana ou Alentejana; muito frutada", en: "Transmontana or Alentejana; very fruity" },
    pt2_var5: { pt: "Catalã; olival superintensivo do Sul", en: "Catalan; southern super-intensive groves" },
    pt2_var6: { pt: "Espanhola; olival intensivo do Alentejo", en: "Spanish; intensive Alentejo groves" },
    pt2_p7: {
      pt: "A Galega é, de longe, a variedade mais espalhada pelo país — das Beiras ao Algarve — e a base dos azeites mais suaves e frutados de Portugal. Já a Cobrançosa, com maior presença no Norte, é responsável pelo amargor e picante que caracterizam azeites como o de Trás-os-Montes.",
      en: "Galega is by far the most widespread variety in the country — from the Beiras to the Algarve — and the base of Portugal's mildest, most fruity oils. Cobrançosa, more present in the North, is responsible for the bitterness and pungency that characterise oils like Trás-os-Montes'."
    },
    pt2_h5: { pt: "Onde entra o Zirbo", en: "Where Zirbo fits in" },
    pt2_p8: {
      pt: "Face a este panorama, o Zirbo escolhe deliberadamente o lado do Norte: olival de sequeiro, em encosta, com variedades autóctones colhidas numa escala pequena e humana — o oposto do olival em sebe que hoje domina a produção nacional. Não é o modelo mais eficiente. É, para nós, o mais interessante.",
      en: "Given this landscape, Zirbo deliberately chooses the northern side: rainfed, hillside groves, with native varieties harvested at a small, human scale — the opposite of the hedgerow groves that now dominate national production. It's not the most efficient model. To us, it's the most interesting one."
    },
    pt2_t1n: { pt: "Desde 2014", en: "Since 2014" },
    pt2_t1: { pt: "Portugal autossuficiente em azeite", en: "Portugal self-sufficient in olive oil" },
    pt2_t2: { pt: "Denominações de Origem Protegida", en: "Protected Designations of Origin" },
    pt2_t3: { pt: "Produção nacional concentrada no Alentejo", en: "National production concentrated in the Alentejo" },
    pt2_t4: { pt: "Árvores no olival tradicional do Norte", en: "Trees in traditional northern groves" },
    // produto
    prod_eyebrow: { pt: "Produto & características", en: "Product & characteristics" },
    prod_title: { pt: "Um azeite, um lote, uma origem", en: "One oil, one batch, one origin" },
    prod_dek: { pt: "Perfil sensorial, ficha técnica e a razão por trás de uma escolha pouco convencional: a lata.", en: "Sensory profile, spec sheet, and the reasoning behind an unconventional choice: the tin." },
    prod_card_eyebrow: { pt: "Ficha técnica", en: "Spec sheet" },
    prod_card_h: { pt: "Verde na cor,<br>firme no carácter.", en: "Green in colour,<br>firm in character." },
    prod_card_p1: {
      pt: "Um perfil equilibrado: verde na cor, com aroma a folha e erva cortada, notas de amêndoa fresca e um amargor e picante bem marcados — sinais de uma azeitona colhida cedo, típicos dos azeites transmontanos de qualidade.",
      en: "A balanced profile: green in colour, with the aroma of leaf and cut grass, notes of fresh almond, and a pronounced bitterness and pungency — signs of an early harvest, typical of quality Trás-os-Montes oils."
    },
    prod_card_p2: {
      pt: "Escolhemos a lata de alumínio, não a garrafa de vidro: veda por completo a luz — o maior inimigo do azeite — e protege da oxidação, conservando aroma e propriedades durante mais tempo.",
      en: "We chose the aluminium tin, not a glass bottle: it fully blocks light — olive oil's biggest enemy — and protects against oxidation, preserving aroma and properties for longer."
    },
    spec_cat: { pt: "Categoria", en: "Category" },
    spec_cat_v: { pt: "Virgem Extra Premium", en: "Premium Extra Virgin" },
    spec_format: { pt: "Formato", en: "Format" },
    spec_format_v: { pt: "Lata de alumínio, 500 ml", en: "Aluminium tin, 500 ml" },
    spec_protect: { pt: "Proteção", en: "Protection" },
    spec_protect_v: { pt: "Barreira total à luz", en: "Total light barrier" },
    spec_variety: { pt: "Variedades", en: "Varieties" },
    spec_acidity: { pt: "Acidez", en: "Acidity" },
    spec_origin: { pt: "Origem", en: "Origin" },
    spec_extraction: { pt: "Extração", en: "Extraction" },
    spec_extraction_v: { pt: "A frio", en: "Cold" },
    prod_footnote: { pt: "*Valores-alvo, sujeitos a confirmação pela ficha técnica final do lote.", en: "*Target values, subject to confirmation by the batch's final spec sheet." },
    nutri_title: { pt: "Declaração Nutricional", en: "Nutrition Declaration" },
    nutri_basis: { pt: "Valor médio por 100 ml", en: "Average value per 100 ml" },
    nutri_energy: { pt: "Energia", en: "Energy" },
    nutri_fat: { pt: "Lípidos", en: "Fat" },
    nutri_fat_sat: { pt: "dos quais Saturadas", en: "of which Saturates" },
    nutri_fat_mono: { pt: "dos quais Monoinsaturadas", en: "of which Monounsaturates" },
    nutri_fat_poly: { pt: "dos quais Polinsaturadas", en: "of which Polyunsaturates" },
    nutri_carb: { pt: "Hidratos de Carbono", en: "Carbohydrate" },
    nutri_sugar: { pt: "dos quais Açúcares", en: "of which Sugars" },
    nutri_protein: { pt: "Proteínas", en: "Protein" },
    nutri_salt: { pt: "Sal", en: "Salt" },
    nutri_footnote: {
      pt: "Valores médios de referência para azeite virgem extra, sujeitos a confirmação pela ficha técnica final do lote.",
      en: "Average reference values for extra virgin olive oil, subject to confirmation by the batch's final spec sheet."
    },
    prod_category_tag: { pt: "Azeite Virgem Extra · Edição Limitada", en: "Extra Virgin Olive Oil · Limited Edition" },
    prod_buy_title: { pt: "Azeite Zirbo — Lata 500\u00a0ml", en: "Zirbo Olive Oil — 500\u00a0ml Tin" },
    prod_short_desc: {
      pt: "Virgem extra da Terra Fria Transmontana, em lata de alumínio que protege da luz e conserva o azeite. Colheita manual, prensa tradicional, produção limitada e numerada.",
      en: "Extra virgin from the Terra Fria Transmontana, in an aluminium tin that blocks light and preserves the oil. Hand-harvested, traditionally pressed, limited numbered production."
    },
    prod_availability: { pt: "Disponível para reserva — lote piloto de 1.000 latas numeradas.", en: "Available for pre-order — pilot batch of 1,000 numbered tins." },
    prod_qty_label: { pt: "Quantidade", en: "Quantity" },
    tab_desc: { pt: "Descrição", en: "Description" },
    tab_info: { pt: "Informação adicional", en: "Additional information" },
    tab_info_title: { pt: "Características do Produto", en: "Product Characteristics" },
    gallery_thumb1_alt: { pt: "Lata Zirbo, azeite virgem extra, 500 ml", en: "Zirbo tin, extra virgin olive oil, 500 ml" },
    gallery_thumb2_alt: { pt: "Lata Zirbo em composição de mesa", en: "Zirbo tin styled on a table" },
    zoom_hint: { pt: "⊕ Ampliar", en: "⊕ Zoom" },
    prod_h1: { pt: "Porquê lata, e não vidro", en: "Why a tin, not glass" },
    prod_p1: {
      pt: "A lata de alumínio é a embalagem tradicionalmente usada para azeites de gama alta em contextos onde a proteção da luz é prioridade absoluta — a exposição à luz é uma das principais causas de degradação do azeite, oxidando os seus compostos e alterando aroma e sabor ao longo do tempo. Ao contrário do vidro, mesmo escuro, a lata bloqueia totalmente a luz e o ar, prolongando a vida útil do produto sem necessidade de conservantes.",
      en: "The aluminium tin is the packaging traditionally used for high-end olive oils where protection from light is an absolute priority — light exposure is one of the main causes of oil degradation, oxidising its compounds and altering aroma and flavour over time. Unlike glass, even dark glass, the tin fully blocks light and air, extending shelf life without needing preservatives."
    },
    prod_p2: { pt: "É também uma escolha prática: mais leve, mais resistente ao transporte e a quedas, e totalmente reciclável.", en: "It's also a practical choice: lighter, more resistant to shipping and drops, and fully recyclable." },
    prod_t1: { pt: "Acidez-alvo", en: "Target acidity" },
    prod_t2n: { pt: "A frio", en: "Cold" },
    prod_t2: { pt: "Método de extração", en: "Extraction method" },
    prod_t3: { pt: "Formato único", en: "Single format" },
    prod_t4: { pt: "Latas no lote piloto", en: "Tins in the pilot batch" },
    prod_h2: { pt: "Feito à moda antiga", en: "Made the old-fashioned way" },
    prod_p3: {
      pt: "O Zirbo segue os rituais que sempre definiram o azeite em Trás-os-Montes. A colheita é manual, azeitona a azeitona ou por vareijo tradicional — nunca por vibração mecânica em massa —, o que permite escolher apenas o fruto no ponto certo de maturação e evita esmagá-lo antes da hora.",
      en: "Zirbo follows the rituals that have always defined olive oil in Trás-os-Montes. The harvest is done by hand, olive by olive or by traditional beating with sticks — never by mass mechanical shaking —, allowing only fruit at the right ripeness to be chosen, without bruising it before its time."
    },
    prod_fig1: { pt: "Azeitona colhida e recolhida à mão sobre rede — sem pressa, sem atalhos.", en: "Olives hand-picked and gathered on a net — no rush, no shortcuts." },
    prod_fig2: { pt: "Vareijo tradicional: as varas fazem cair a azeitona diretamente sobre a rede, sem pressa nem máquinas.", en: "Traditional varejo: sticks knock the olives down straight onto the net, no rush and no machines." },
    prod_fig3: { pt: "Um lagar de pedra tradicional — as mós de granito ainda giram como giravam há gerações.", en: "A traditional stone lagar — the granite millstones still turn as they did for generations." },
    prod_p4: {
      pt: "A prensagem é feita num lagar tradicional da região, à escala pequena, seguindo o mesmo princípio de sempre: extrair o azeite sem pressa e sem atalhos. É um processo lento, dependente do tempo, da mão de quem colhe e de quem prensa — e é exatamente por isso que se produz tão pouco. Não é escassez artificial; é o limite natural de fazer as coisas como sempre se fizeram.",
      en: "Pressing takes place at a small, traditional mill in the region, following the same principle it always has: extracting the oil without rushing and without shortcuts. It's a slow process, dependent on the weather, on the hands of whoever harvests and whoever presses — and that's exactly why so little is made. It isn't artificial scarcity; it's the natural limit of doing things the way they've always been done."
    },
    // benefícios
    ben_eyebrow: { pt: "Propriedades nutricionais", en: "Nutritional properties" },
    ben_title: { pt: "Efeitos benéficos do azeite", en: "Health benefits of olive oil" },
    ben_dek: { pt: "O que a ciência da nutrição diz — com rigor, sem exageros — sobre o azeite virgem extra.", en: "What nutrition science says — rigorously, without hype — about extra virgin olive oil." },
    ben_h1: { pt: "Uma gordura diferente das outras", en: "A different kind of fat" },
    ben_p1: {
      pt: "O azeite virgem extra é rico em ácido oleico, uma gordura monoinsaturada que constitui a base da dieta mediterrânica — um padrão alimentar reconhecido pela UNESCO como Património Cultural Imaterial da Humanidade. Ao contrário de gorduras saturadas, o ácido oleico está associado, na literatura nutricional, a um perfil lipídico mais favorável quando consumido no contexto de uma alimentação equilibrada.",
      en: "Extra virgin olive oil is rich in oleic acid, a monounsaturated fat that forms the basis of the Mediterranean diet — a dietary pattern recognised by UNESCO as Intangible Cultural Heritage of Humanity. Unlike saturated fats, oleic acid is associated in the nutritional literature with a more favourable lipid profile when consumed as part of a balanced diet."
    },
    ben_stat_label: {
      pt: "de gordura monoinsaturada por cada 100 ml de Azeite Zirbo — dados da declaração nutricional do produto, disponível na <a href=\"produto.html\" style=\"color:var(--verde); text-decoration:underline;\">ficha técnica</a>.",
      en: "of monounsaturated fat per 100 ml of Zirbo Olive Oil — from the product's nutrition declaration, available in the <a href=\"produto.html\" style=\"color:var(--verde); text-decoration:underline;\">spec sheet</a>."
    },
    ben_p2: {
      pt: "O azeite virgem extra contém também polifenóis — compostos naturais com propriedades antioxidantes, resultantes do processo de extração a frio e ausentes em óleos vegetais refinados.",
      en: "Extra virgin olive oil also contains polyphenols — natural compounds with antioxidant properties, a result of cold extraction and absent from refined vegetable oils."
    },
    ben_h2: { pt: "O que a regulamentação europeia reconhece", en: "What EU regulation recognises" },
    ben_p3: {
      pt: "A União Europeia reconhece oficialmente uma alegação de saúde específica para o azeite: os polifenóis do azeite contribuem para a proteção das gorduras do sangue contra o stress oxidativo. Esta alegação aplica-se especificamente a azeites com um teor mínimo garantido de hidroxitirosol e seus derivados, consumidos como parte de um padrão alimentar equilibrado — não a qualquer azeite, em qualquer quantidade.",
      en: "The European Union officially recognises one specific health claim for olive oil: olive oil polyphenols contribute to the protection of blood lipids from oxidative stress. This claim applies specifically to oils with a guaranteed minimum content of hydroxytyrosol and its derivatives, consumed as part of a balanced diet — not to any olive oil, in any amount."
    },
    ben_pull1: { pt: "É uma diferença importante: a ciência apoia benefícios reais, mas específicos e dependentes de contexto — não uma promessa genérica de saúde.", en: "It's an important distinction: the science supports real, but specific and context-dependent benefits — not a generic health promise." },
    ben_h3: { pt: "Parte de um padrão, não uma solução isolada", en: "Part of a pattern, not a standalone fix" },
    ben_p4: {
      pt: "A investigação em torno da dieta mediterrânica associa consistentemente o consumo regular de azeite virgem extra — no contexto de uma dieta rica em vegetais, legumes, peixe e cereais integrais — a indicadores de saúde cardiovascular mais favoráveis. O valor do azeite está, sobretudo, no seu papel dentro de um padrão alimentar mais amplo, e não como suplemento isolado.",
      en: "Research on the Mediterranean diet consistently links regular consumption of extra virgin olive oil — within a diet rich in vegetables, legumes, fish and whole grains — to more favourable cardiovascular health markers. Olive oil's value lies mainly in its role within a broader dietary pattern, not as a standalone supplement."
    },
    ben_note: {
      pt: "Esta informação tem caráter nutricional geral e educativo. Não constitui aconselhamento médico ou nutricional personalizado — para orientação adaptada à sua situação de saúde, consulte um médico ou nutricionista.",
      en: "This information is general and educational in nature. It does not constitute personalised medical or nutritional advice — for guidance tailored to your health situation, consult a doctor or dietitian."
    },
    // receitas
    rec_eyebrow: { pt: "Da lata para a mesa", en: "From the tin to the table" },
    rec_title: { pt: "Receitas típicas portuguesas", en: "Traditional Portuguese recipes" },
    rec_dek: { pt: "Quatro clássicos onde o azeite não é ingrediente — é protagonista.", en: "Four classics where olive oil isn't just an ingredient — it's the star." },
    rec1_h: { pt: "Açorda de Bacalhau", en: "Açorda de Bacalhau (Codfish Bread Soup)" },
    rec1_desc: { pt: "Pão amanhecido, bacalhau desfiado, coentros e um fio generoso de Zirbo no final.", en: "Day-old bread, flaked salt cod, coriander, and a generous drizzle of Zirbo at the end." },
    rec1_s1: { pt: "Demolhe o bacalhau e desfie em lascas.", en: "Soak the salt cod and flake it." },
    rec1_s2: { pt: "Ferva água com alho e coentros; regue fatias de pão amanhecido.", en: "Boil water with garlic and coriander; pour over slices of day-old bread." },
    rec1_s3: { pt: "Junte o bacalhau e um ovo escalfado por cima.", en: "Add the cod and a poached egg on top." },
    rec1_s4: { pt: "Termine com um fio generoso de azeite antes de servir.", en: "Finish with a generous drizzle of olive oil before serving." },
    rec2_h: { pt: "Bacalhau à Lagareiro", en: "Bacalhau à Lagareiro (Miller-Style Codfish)" },
    rec2_desc: { pt: "Lombos assados em azeite, com batata a murro — o nome já diz tudo: à moda do lagar.", en: "Loins roasted in olive oil, with smashed potatoes — the name says it all: mill-style." },
    rec2_s1: { pt: "Asse os lombos de bacalhau em forno com azeite abundante.", en: "Roast the cod loins in the oven with plenty of olive oil." },
    rec2_s2: { pt: "Esmague batatas cozidas com casca, “a murro”.", en: "Smash boiled skin-on potatoes with your fist." },
    rec2_s3: { pt: "Regue tudo com azeite quente e alho laminado.", en: "Drizzle everything with hot olive oil and sliced garlic." },
    rec2_s4: { pt: "Sirva de imediato, ainda a fumegar.", en: "Serve immediately, still steaming." },
    rec3_h: { pt: "Migas à Transmontana", en: "Migas à Transmontana (Trás-os-Montes Bread Migas)" },
    rec3_desc: { pt: "Pão migado com alho e entrecosto, unido pelo azeite que dá liga e sabor.", en: "Crumbled bread with garlic and pork ribs, brought together by the olive oil that binds and flavours." },
    rec3_s1: { pt: "Corte o pão em pedaços pequenos.", en: "Cut the bread into small pieces." },
    rec3_s2: { pt: "Refogue alho em bastante azeite.", en: "Sauté garlic in plenty of olive oil." },
    rec3_s3: { pt: "Junte o pão e caldo até formar uma massa solta.", en: "Add the bread and stock until it forms a loose mass." },
    rec3_s4: { pt: "Sirva com carne grelhada ao lado.", en: "Serve with grilled meat on the side." },
    rec4_h: { pt: "Broa com Azeite e Queijo", en: "Corn Bread with Olive Oil and Cheese" },
    rec4_desc: { pt: "A combinação mais simples do Nordeste transmontano.", en: "The simplest combination from northeastern Trás-os-Montes." },
    rec4_p: {
      pt: "Uma fatia de broa de milho, queijo de cabra curado por cima, e um fio generoso de Zirbo a terminar. Sem receita — só bom senso e um azeite à altura.",
      en: "A slice of corn bread, aged goat cheese on top, and a generous drizzle of Zirbo to finish. No recipe needed — just good judgement and an olive oil worthy of it."
    },
    rec_note_h: { pt: "Uma nota sobre o azeite em cru", en: "A note on raw olive oil" },
    rec_note_p: {
      pt: "Em todas estas receitas, o momento em que o azeite é adicionado importa tanto quanto a quantidade. Regado em cru, no final da confeção, um azeite virgem extra de qualidade preserva o aroma e as notas frutadas que se perdem quando exposto a temperaturas elevadas durante demasiado tempo. É por isso que a tradição portuguesa reserva sempre o “fio final” de azeite para o prato já pronto a servir.",
      en: "In all these recipes, when the oil is added matters as much as how much. Drizzled raw, at the end of cooking, a good extra virgin olive oil preserves the aroma and fruity notes that are lost when exposed to high heat for too long. That's why Portuguese tradition always saves the “final drizzle” of olive oil for the dish once it's ready to serve."
    },
    // sobre nós
    sobre_eyebrow: { pt: "Quem somos", en: "Who we are" },
    sobre_title: { pt: "Sobre a Zirbo", en: "About Zirbo" },
    sobre_dek: { pt: "Uma marca nova, com uma origem muito antiga.", en: "A new brand, with a very old origin." },
    sobre_h1: { pt: "Quem somos", en: "Who we are" },
    sobre_p1: {
      pt: "Zirbo é uma marca portuguesa dedicada à comercialização de azeite virgem extra premium, com foco na Terra Fria Transmontana. É um projeto em fase de lançamento — o primeiro lote é piloto: 1.000 latas de 500 ml, produzidas em regime de marca própria junto de um lagar parceiro certificado na região.",
      en: "Zirbo is a Portuguese brand dedicated to selling premium extra virgin olive oil, focused on the Terra Fria Transmontana. It's a pre-launch project — the first batch is a pilot: 1,000 tins of 500 ml, produced under a private-label arrangement with a certified partner mill in the region."
    },
    sobre_p2: {
      pt: "A nossa missão é simples: honrar o terroir de Trás-os-Montes com um produto rastreável, de produção limitada, e ser honestos sobre o que ainda está por confirmar — desde a ficha técnica final do lote até ao registo legal da marca.",
      en: "Our mission is simple: honour the Trás-os-Montes terroir with a traceable, limited-production product, and be honest about what's still to be confirmed — from the batch's final spec sheet to the brand's legal registration."
    },
    sobre_pull: { pt: "Mantemos um compromisso contínuo com a qualidade, para os futuros clientes e para a própria região que nos inspira.", en: "We maintain an ongoing commitment to quality, for future customers and for the region that inspires us." },
    sobre_p3: {
      pt: "Para conhecer a história por trás do nome, da região e do produto, visite as páginas A História do Azeite, Trás-os-Montes e O Azeite na Região.",
      en: "To learn the story behind the name, the region and the product, visit the pages The History of Olive Oil, Trás-os-Montes and Olive Oil in the Region."
    },
    olival_eyebrow: { pt: "Da terra à lata", en: "From the grove to the tin" },
    olival_h: { pt: "O nosso olival", en: "Our olive grove" },
    olival_p: {
      pt: "Fotografias tiradas no nosso olival em Trás-os-Montes, na Terra Fria Transmontana — as mesmas oliveiras e encostas de onde vem o azeite Zirbo.",
      en: "Photos taken at our own olive grove in Trás-os-Montes, in the Terra Fria Transmontana — the same olive trees and hillsides the Zirbo oil comes from."
    },
    olival_cap1: { pt: "Uma sobrevivente dos incêndios: o tronco múltiplo é a marca de quem rebentou de novo da raiz.", en: "A survivor of the wildfires: the multiple trunk is the mark of a tree that grew back from the root." },
    olival_cap2: { pt: "Uma oliveira carregada, ainda semanas antes da colheita.", en: "A tree heavy with fruit, still weeks before harvest." },
    olival_cap3: { pt: "As encostas da Terra Fria — o cenário de todos os dias.", en: "The hillsides of the Terra Fria — the everyday backdrop." },
    olival_cap4: { pt: "Cada nó do tronco pode ser cicatriz de fogo — e prova de resistência.", en: "Every knot in the trunk could be a fire scar — and proof of resilience." },
    olival_cap5: { pt: "Fileiras mais novas, replantadas onde o fogo não deixou nada para trás.", en: "Younger rows, replanted where the fire left nothing behind." },
    olival_cap6: { pt: "O caminho de terra que atravessa o olival, encosta acima.", en: "The dirt path that crosses the grove, up the hillside." },
    olival_cap7: { pt: "Fileira após fileira, o olival estende-se pela encosta.", en: "Row after row, the grove stretches across the hillside." },
    olival_cap8: { pt: "Cada cacho é o resultado de um ano inteiro de espera.", en: "Every cluster is the result of a full year's wait." },
    hist_eyebrow: { pt: "Três gerações, um incêndio, e as árvores que resistiram", en: "Three generations, a wildfire, and the trees that held on" },
    hist_h1: { pt: "Um olival com história", en: "A grove with a history" },
    hist_p1: {
      pt: "O nosso olival foi plantado há mais de 50 anos pelo avô da família — árvore a árvore, encosta acima. Não é um investimento recente nem um projeto de marca: é terra que já passou por três gerações.",
      en: "Our olive grove was planted more than 50 years ago by the family's grandfather — tree by tree, up the hillside. It isn't a recent investment or a brand project: it's land that has already passed through three generations."
    },
    hist_p2: {
      pt: "Entre 2010 e 2012, os incêndios que percorreram Trás-os-Montes destruíram mais de metade do olival. Não foi opção nem gestão — foi perda, sem mais.",
      en: "Between 2010 and 2012, the wildfires that swept through Trás-os-Montes destroyed more than half the grove. It wasn't a choice or a management decision — it was simply loss."
    },
    hist_pull: {
      pt: "Mas as árvores que sobreviveram voltaram a rebentar da raiz. Nos anos seguintes, foram vingando — teimosas, resistentes.",
      en: "But the trees that survived grew back from the root. In the years that followed, they took hold — stubborn, resilient."
    },
    hist_p3: {
      pt: "É delas, e das fileiras mais novas replantadas depois para as substituir, que vem hoje o azeite Zirbo.",
      en: "It's from those trees, and the younger rows replanted afterwards to replace what was lost, that Zirbo olive oil comes today."
    },
    cult_eyebrow: { pt: "Como cuidamos das oliveiras", en: "How we care for the trees" },
    cult_h1: { pt: "Cultivo Tradicional", en: "Traditional Cultivation" },
    cult_p1: {
      pt: "O nosso olival trabalha-se como sempre se trabalhou nesta região: em regime de sequeiro, sem rega forçada, deixando que seja o solo de xisto — e as estações — a ditar o ritmo. É essa resistência, mais do que qualquer intervenção, que dá caráter à azeitona.",
      en: "Our grove is worked the way it has always been worked in this region: rain-fed, with no forced irrigation, letting the schist soil — and the seasons — set the pace. It's that resilience, more than any intervention, that gives the olive its character."
    },
    cult_h2: { pt: "A poda", en: "Pruning" },
    cult_p2: {
      pt: "A poda faz-se no inverno, depois da colheita e antes do arranque da nova vegetação — sempre à mão. O objetivo não é só controlar o tamanho da árvore: é abrir a copa em forma de taça, deixando entrar luz e ar até ao centro, para que a azeitona amadureça de forma uniforme em toda a árvore, e não só nas pontas.",
      en: "Pruning happens in winter, after harvest and before new growth begins — always by hand. The goal isn't just to control the tree's size: it's to open the canopy into a cup shape, letting light and air reach the centre, so the fruit ripens evenly across the whole tree, not just at the tips."
    },
    cult_fig1: {
      pt: "Cada corte é pensado: remove-se a madeira velha, doente ou cruzada — nunca mais do que a árvore aguenta perder num só ano.",
      en: "Every cut is deliberate: old, diseased or crossing wood is removed — never more than the tree can afford to lose in a single year."
    },
    cult_p3: {
      pt: "Não há pressa nem máquina que substitua este trabalho. É repetido árvore a árvore, todos os invernos, há gerações — e é esse cuidado, mais do que qualquer técnica nova, que mantém produtivas as árvores que resistiram ao fogo.",
      en: "No machine or shortcut replaces this work. It's repeated tree by tree, every winter, for generations — and that care, more than any new technique, is what keeps the trees that survived the fire still productive."
    },
    cult_fig2: {
      pt: "Anos de poda cuidada moldam a copa aberta, típica do olival tradicional transmontano.",
      en: "Years of careful pruning shape the open canopy typical of the traditional Trás-os-Montes grove."
    },
    cult_h3: { pt: "O resto do ano", en: "The rest of the year" },
    cult_p4: {
      pt: "Fora da época da poda e da colheita, a intervenção é mínima: sem regas artificiais, sem adubação intensiva, sem herbicidas de largo espectro. A erva cresce e seca naturalmente ao longo do ano, protegendo o solo da erosão nas encostas mais inclinadas. É um cultivo que exige paciência — e que está, de alguma forma, em cada gota de Zirbo.",
      en: "Outside pruning and harvest season, intervention is kept to a minimum: no artificial irrigation, no intensive fertilising, no broad-spectrum herbicides. Grass grows and dries naturally through the year, protecting the soil from erosion on the steeper slopes. It's a way of growing that demands patience — and it's there, in some way, in every drop of Zirbo."
    },
    // contacto
    cont_eyebrow: { pt: "Fale connosco", en: "Get in touch" },
    cont_title: { pt: "Contacte-nos", en: "Contact Us" },
    cont_dek: { pt: "Ainda somos uma equipa pequena — mas respondemos a todas as mensagens.", en: "We're still a small team — but we answer every message." },
    cont_h1: { pt: "Como nos contactar", en: "How to reach us" },
    cont_p1: {
      pt: "Para questões sobre o lançamento, o lote piloto, parcerias com lagares ou pontos de venda, escreva para geral@zirbo.cc. Respondemos, tipicamente, dentro de 2 a 3 dias úteis.",
      en: "For questions about the launch, the pilot batch, mill partnerships or points of sale, write to geral@zirbo.cc. We typically reply within 2 to 3 business days."
    },
    cont_p2: {
      pt: "Este site ainda não tem um formulário de contacto nem um chat ligados a um sistema de apoio ao cliente — por agora, o e-mail é o canal principal.",
      en: "This site doesn't yet have a contact form or chat connected to a customer support system — for now, email is the main channel."
    },
    cont_email_k: { pt: "E-mail geral", en: "General email" },
    cont_region_k: { pt: "Região de operação", en: "Region of operation" },
    cont_note: {
      pt: "A firma, morada fiscal e número de identificação da empresa serão publicados nesta página assim que a constituição societária e o registo estiverem concluídos.",
      en: "The company name, registered address and tax ID will be published on this page once the company's formation and registration are complete."
    },
    cont_form_h: { pt: "Envie-nos uma mensagem", en: "Send us a message" },
    cont_form_name: { pt: "Nome", en: "Name" },
    cont_form_email: { pt: "E-mail", en: "Email" },
    cont_form_subject: { pt: "Assunto", en: "Subject" },
    cont_form_message: { pt: "Mensagem", en: "Message" },
    cont_form_send: { pt: "Enviar mensagem", en: "Send message" },
    // entrega & devoluções
    ent_eyebrow: { pt: "Política de entrega e devolução", en: "Delivery and returns policy" },
    ent_title: { pt: "Entrega & Devoluções", en: "Delivery & Returns" },
    ent_dek: { pt: "Esta secção descreve o que planeamos para o lançamento — os valores finais serão confirmados antes da abertura da loja.", en: "This section describes what we're planning for launch — final figures will be confirmed before the shop opens." },
    ent_h1: { pt: "Condições gerais", en: "General conditions" },
    ent_p1: {
      pt: "A Zirbo pode alterar a informação e a oferta comercial de qualquer produto sem aviso prévio. Todos os preços apresentados na loja online estão sujeitos a alteração e a rutura de stock. No caso de uma encomenda não poder ser satisfeita, total ou parcialmente, o cliente será contactado para encontrarmos, em conjunto, a melhor solução.",
      en: "Zirbo may change the information and commercial offer of any product without prior notice. All prices shown in the online shop are subject to change and stock availability. If an order cannot be fulfilled, in whole or in part, the customer will be contacted so we can find the best solution together."
    },
    ent_h2: { pt: "Encomendas", en: "Orders" },
    ent_p2: { pt: "Após a confirmação do pagamento, a preparação da encomenda tem início. Cada lata viaja em caixa de cartão canelado reforçada, com separadores internos, testada para transporte seguro.", en: "Once payment is confirmed, order preparation begins. Each tin travels in a reinforced corrugated cardboard box, with internal dividers, tested for safe shipping." },
    ent_h3: { pt: "Prazos de entrega", en: "Delivery times" },
    ent_p3: { pt: "Está previsto um prazo de entrega entre 2 a 5 dias úteis para Portugal Continental. Para as Ilhas e para o resto da Europa, o prazo poderá variar consoante a transportadora e o destino. Estes valores serão confirmados antes da abertura da loja com pagamentos.", en: "Delivery is expected within 2 to 5 business days for mainland Portugal. For the islands and the rest of Europe, timing may vary depending on the carrier and destination. These figures will be confirmed before the shop opens for payments." },
    ent_h4: { pt: "Custos de envio", en: "Shipping costs" },
    ent_p4: { pt: "Ao preço final de cada compra acresce o custo de envio, calculado com base no peso total da encomenda. O valor total será sempre apresentado antes da finalização da compra, no checkout — nenhum custo é cobrado sem o cliente o ver primeiro.", en: "Shipping cost is added to each purchase's final price, calculated based on the order's total weight. The total amount will always be shown before checkout is completed — no cost is charged without the customer seeing it first." },
    ent_h5: { pt: "Trocas e devoluções", en: "Exchanges and returns" },
    ent_p5: {
      pt: "Nos termos do Decreto-Lei n.º 24/2014, de 14 de fevereiro, o cliente tem direito a resolver o contrato sem necessidade de justificação no prazo de 14 dias a contar da receção do produto — ver detalhes completos em Direito de Livre Resolução. Os custos diretos da devolução do produto ficam a cargo do cliente, salvo indicação em contrário. O reembolso é processado após a receção e verificação do artigo devolvido.",
      en: "Under Decree-Law no. 24/2014, of 14 February, the customer has the right to withdraw from the contract without justification within 14 days of receiving the product — see full details on the Right of Withdrawal page. Direct return shipping costs are borne by the customer, unless stated otherwise. Refunds are processed after the returned item is received and inspected."
    },
    ent_p6: {
      pt: "Por se tratar de um produto alimentar, a Zirbo poderá não aceitar devoluções de latas cujo selo de origem tenha sido violado, ou que tenham sido expostas a condições inadequadas de temperatura, humidade ou luminosidade — esta exceção será clarificada nos termos finais antes do lançamento.",
      en: "As this is a food product, Zirbo may not accept returns of tins whose original seal has been broken, or that have been exposed to inadequate temperature, humidity or light conditions — this exception will be clarified in the final terms before launch."
    },
    ent_note: { pt: "Esta página descreve a política prevista para o lançamento. Os valores e prazos definitivos serão confirmados, com validação legal, antes da abertura da loja com pagamentos.", en: "This page describes the policy planned for launch. Final figures and timeframes will be confirmed, with legal validation, before the shop opens for payments." },
    // privacidade & cookies
    priv_eyebrow: { pt: "RGPD & cookies", en: "GDPR & cookies" },
    priv_title: { pt: "Privacidade & Cookies", en: "Privacy & Cookies" },
    priv_dek: { pt: "Como tratamos os seus dados — de forma simples e em conformidade com o Regulamento Geral de Proteção de Dados.", en: "How we handle your data — simply, and in compliance with the General Data Protection Regulation." },
    priv_h1: { pt: "1. Recolha e registo de dados", en: "1. Data collection and recording" },
    priv_p1: {
      pt: "A Zirbo compromete-se a proteger a privacidade de quem visita este site e recolhe apenas os dados pessoais fornecidos voluntariamente — nomeadamente através do formulário de contacto e, no momento da compra, os dados necessários ao processamento do pagamento e ao envio da encomenda. Esses dados são usados exclusivamente para responder ao contacto, processar a encomenda e para comunicações relacionadas com a marca.",
      en: "Zirbo is committed to protecting the privacy of everyone who visits this site, and only collects personal data voluntarily provided — namely through the contact form and, at the time of purchase, the data needed to process payment and ship the order. This data is used exclusively to respond to enquiries, process orders, and for brand-related communications."
    },
    priv_h2: { pt: "2. Retificação ou eliminação dos dados", en: "2. Rectification or deletion of data" },
    priv_p2: {
      pt: "Nos termos da legislação aplicável, tem direito de acesso e retificação dos seus dados a qualquer momento. Qualquer pessoa pode optar livremente por fornecer os seus dados, e o preenchimento de qualquer formulário deste site é entendido como uma indicação voluntária, aceitando esta política de privacidade. Se pretender deixar de ser contactado, basta pedir a eliminação dos seus dados para o contacto indicado no ponto 5.",
      en: "Under applicable law, you have the right to access and rectify your data at any time. Anyone may freely choose whether to provide their data, and filling in any form on this site is understood as a voluntary act, accepting this privacy policy. If you wish to stop being contacted, simply request deletion of your data via the contact listed in point 5."
    },
    priv_h3: { pt: "3. Segurança e utilização da informação", en: "3. Security and use of information" },
    priv_p3: { pt: "A Zirbo compromete-se a não vender, alugar ou transmitir a terceiros os dados pessoais recolhidos através deste site, exceto com autorização do utilizador ou quando legalmente exigido.", en: "Zirbo commits to not selling, renting or transmitting to third parties the personal data collected through this site, except with user authorisation or when legally required." },
    priv_h4: { pt: "4. Conservação da informação pessoal", en: "4. Retention of personal information" },
    priv_p4: { pt: "Os dados recolhidos são conservados pelo período necessário para o fim para que foram fornecidos, até indicação em contrário ou até que a lei exija a sua eliminação.", en: "Collected data is retained for as long as necessary for the purpose it was provided for, until stated otherwise or until the law requires its deletion." },
    priv_h5: { pt: "5. Entidade responsável", en: "5. Data controller" },
    priv_p5: {
      pt: "O responsável pelo tratamento de dados deste site ainda não tem identificação societária formal publicada — a firma, morada fiscal e número de identificação da empresa serão acrescentados a este ponto assim que a constituição estiver concluída. Para questões sobre os seus dados, contacte geral@zirbo.cc.",
      en: "This site's data controller does not yet have a formally published company identification — the company name, registered address and tax ID will be added to this section once formation is complete. For questions about your data, contact geral@zirbo.cc."
    },
    priv_h6: { pt: "A nossa política de cookies", en: "Our cookie policy" },
    priv_p6: { pt: "Cookies são pequenos ficheiros de texto guardados pelo seu navegador. Este site, na sua versão atual, utiliza apenas cookies estritamente necessários ao funcionamento básico da página — não usamos cookies analíticos, de marketing ou de terceiros.", en: "Cookies are small text files stored by your browser. This site, in its current version, only uses cookies strictly necessary for basic page functionality — we don't use analytics, marketing or third-party cookies." },
    priv_c1k: { pt: "Estritamente necessários", en: "Strictly necessary" },
    priv_c1v: { pt: "Essenciais ao funcionamento do site", en: "Essential to the site's operation" },
    priv_c2k: { pt: "Analíticos", en: "Analytics" },
    priv_c3k: { pt: "Funcionalidade", en: "Functionality" },
    priv_c4k: { pt: "Marketing", en: "Marketing" },
    priv_cnu: { pt: "Não utilizados nesta versão", en: "Not used in this version" },
    priv_p7: { pt: "Se, no futuro, forem adicionadas ferramentas de análise de tráfego ou publicidade, esta página será atualizada com um aviso de consentimento explícito, com opção de aceitar, recusar ou personalizar.", en: "If traffic analytics or advertising tools are added in the future, this page will be updated with an explicit consent notice, with the option to accept, decline or customise." },
    priv_note: { pt: "Esta política será revista e formalizada com apoio jurídico antes do lançamento comercial completo.", en: "This policy will be reviewed and formalised with legal support before full commercial launch." },
    // livro de reclamações
    rec2_eyebrow: { pt: "O seu direito enquanto consumidor", en: "Your right as a consumer" },
    rec2_title: { pt: "Livro de Reclamações", en: "Complaints Book" },
    rec2_dek: { pt: "Em Portugal, todo o fornecedor de bens ou prestador de serviços tem de disponibilizar um livro de reclamações — físico ou eletrónico.", en: "In Portugal, every supplier of goods or services must provide a complaints book — physical or electronic." },
    rec2_h1: { pt: "Como reclamar", en: "How to file a complaint" },
    rec2_p1: { pt: "Nos termos da legislação portuguesa (Decreto-Lei n.º 156/2005), tem direito a apresentar uma reclamação através do Livro de Reclamações Eletrónico, disponível no portal oficial:", en: "Under Portuguese law (Decree-Law no. 156/2005), you have the right to file a complaint through the Electronic Complaints Book, available on the official portal:" },
    rec2_p2: {
      pt: "Enquanto a Zirbo não tiver o seu registo formal concluído nesta plataforma — algo que faremos antes de iniciar vendas com pagamento —, qualquer reclamação pode também ser enviada diretamente para geral@zirbo.cc, com o assunto “Reclamação”.",
      en: "Until Zirbo has completed its formal registration on this platform — something we'll do before starting paid sales —, any complaint can also be sent directly to geral@zirbo.cc, with the subject “Complaint”."
    },
    rec2_note: { pt: "O número de registo do Livro de Reclamações da Zirbo será publicado nesta página assim que o processo de registo estiver concluído.", en: "Zirbo's Complaints Book registration number will be published on this page once the registration process is complete." },
    // resolução de conflitos
    odr_eyebrow: { pt: "Antes de ir a tribunal", en: "Before going to court" },
    odr_title: { pt: "Resolução de Conflitos Online", en: "Online Dispute Resolution" },
    odr_dek: { pt: "Existem formas de resolver um litígio de consumo sem passar pelos tribunais.", en: "There are ways to resolve a consumer dispute without going to court." },
    odr_h1: { pt: "Resolução Alternativa de Litígios (RAL)", en: "Alternative Dispute Resolution (ADR)" },
    odr_p1: { pt: "Caso surja um conflito relacionado com uma compra na Zirbo que não consigamos resolver diretamente, tem direito a recorrer a uma entidade de Resolução Alternativa de Litígios de Consumo (RAL), nos termos da Lei n.º 144/2015. A entidade competente, consoante a sua área de residência, poderá ser consultada no Portal do Consumidor.", en: "Should a dispute arise related to a Zirbo purchase that we can't resolve directly, you have the right to turn to a Consumer Alternative Dispute Resolution (ADR) body, under Law no. 144/2015. The competent body, depending on your area of residence, can be found on the Consumer Portal." },
    odr_h2: { pt: "Plataforma Europeia de Resolução de Litígios Online (RLL)", en: "European Online Dispute Resolution Platform (ODR)" },
    odr_p2: { pt: "Se preferir, pode também recorrer à plataforma europeia de Resolução de Litígios em Linha, criada pela União Europeia para litígios resultantes de compras online dentro do espaço europeu:", en: "If you prefer, you can also use the European Online Dispute Resolution platform, created by the European Union for disputes arising from online purchases within the EU:" },
    odr_note: { pt: "A identificação da entidade de RAL competente para a Zirbo será publicada nesta página assim que a atividade comercial estiver formalmente registada.", en: "The competent ADR body for Zirbo will be identified on this page once the business is formally registered." },
    // direito de livre resolução
    wdr_eyebrow: { pt: "O seu direito de arrependimento", en: "Your right of withdrawal" },
    wdr_title: { pt: "Direito de Livre Resolução", en: "Right of Withdrawal" },
    wdr_dek: { pt: "Em compras à distância, a lei portuguesa dá-lhe 14 dias para mudar de ideias — sem ter de justificar porquê.", en: "For distance purchases, Portuguese law gives you 14 days to change your mind — with no need to explain why." },
    wdr_h1: { pt: "O prazo de 14 dias", en: "The 14-day period" },
    wdr_p1: {
      pt: "Nos termos do Decreto-Lei n.º 24/2014, que transpõe a Diretiva Europeia dos Direitos dos Consumidores, tem direito a resolver livremente um contrato celebrado à distância — como uma compra na loja online da Zirbo —, sem necessidade de indicar qualquer motivo, no prazo de 14 dias corridos a contar da data de receção do produto.",
      en: "Under Decree-Law no. 24/2014, which transposes the EU Consumer Rights Directive, you have the right to freely withdraw from a distance contract — such as a purchase in the Zirbo online shop — with no need to state a reason, within 14 calendar days of receiving the product."
    },
    wdr_h2: { pt: "Exceções previstas na lei", en: "Exceptions provided by law" },
    wdr_p2: {
      pt: "A legislação prevê exceções a este direito para determinados bens, nomeadamente produtos alimentares selados que não sejam adequados a devolução por razões de proteção da saúde ou higiene, uma vez abertos após a entrega. A aplicação exata desta exceção à lata de azeite Zirbo será confirmada e clarificada nos termos e condições finais, antes da abertura da loja com pagamentos.",
      en: "The law provides exceptions to this right for certain goods, namely sealed food products not suitable for return for health or hygiene reasons once opened after delivery. The exact application of this exception to the Zirbo tin will be confirmed and clarified in the final terms and conditions, before the shop opens for payments."
    },
    wdr_h3: { pt: "Como exercer este direito", en: "How to exercise this right" },
    wdr_p3: {
      pt: "Para exercer o direito de livre resolução, bastará contactar geral@zirbo.cc dentro do prazo indicado. Um modelo de formulário de livre resolução será disponibilizado nesta página junto com a abertura da loja.",
      en: "To exercise the right of withdrawal, simply contact geral@zirbo.cc within the stated period. A withdrawal form template will be made available on this page alongside the shop's opening."
    },
    // obrigado
    obr_eyebrow: { pt: "Encomenda confirmada", en: "Order confirmed" },
    obr_title: { pt: "Obrigado.", en: "Thank you." },
    obr_dek: { pt: "A sua encomenda foi recebida com sucesso.", en: "Your order was received successfully." },
    obr_h1: { pt: "O que se segue", en: "What happens next" },
    obr_p1: { pt: "Vai receber um e-mail de confirmação do Stripe com os detalhes do pagamento. Entraremos em contacto assim que a sua lata estiver pronta a enviar.", en: "You'll receive a confirmation email from Stripe with your payment details. We'll be in touch once your tin is ready to ship." },
    obr_p2: { pt: "Se tiver qualquer dúvida sobre a sua encomenda, escreva para geral@zirbo.cc.", en: "If you have any questions about your order, write to geral@zirbo.cc." },
    obr_note: { pt: "Nota: este site está em fase de testes de pagamento. Se completou uma compra em modo de teste, nenhum valor real foi cobrado.", en: "Note: this site is in payment testing phase. If you completed a purchase in test mode, no real charge was made." },
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
    spec_capacity: { pt: "Capacidade", en: "Capacity" },
    spec_material: { pt: "Material", en: "Material" },
    spec_system: { pt: "Sistema", en: "System" },
    spec_antidrip: { pt: "Anti-gota", en: "Drip-free" },
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
    shop_tin_view: { pt: "Ver ficha do produto →", en: "View product page →" },
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
      pt: "Almotolia em aço inoxidável polido, com bico doseador interno e sistema anti-gota, para servir com precisão à mesa — sem desperdício, sem escorrências.",
      en: "Polished stainless-steel oil can, with an internal dosing spout and drip-free system, for precise pouring at the table — no waste, no mess."
    },
    shop_bandeja_name: { pt: "Bandeja de Degustação", en: "Tasting Tray" },
    shop_bandeja_desc: {
      pt: "Madeira maciça, com acabamento natural — duas bandejas de tamanhos diferentes, para azeite, pão e acompanhamentos à mesa.",
      en: "Solid wood, natural finish — two trays in different sizes, for olive oil, bread and accompaniments at the table."
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
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      if (I18N[key]) el.setAttribute("alt", I18N[key][lang] || I18N[key].pt);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (I18N[key]) el.setAttribute("aria-label", I18N[key][lang] || I18N[key].pt);
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
              "</div>" +
              '<button class="ci-remove" data-act="rm">' + t("remove") + "</button>" +
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

    // populate mobile nav drawer by cloning the desktop nav links (keeps aria-current/i18n in sync)
    var navScrollEl = document.querySelector(".navscroll");
    var drawerLinksEl = document.getElementById("navDrawerLinks");
    if (navScrollEl && drawerLinksEl) {
      drawerLinksEl.innerHTML = navScrollEl.innerHTML;
    }

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
      if (e.key === "Escape") { closeSearch(); closeCart(); closeMenu(); }
    });

    // mobile nav drawer
    var navDrawer = document.getElementById("navDrawer");
    var navScrim = document.getElementById("navScrim");
    var menuOpenBtn = document.getElementById("menuOpen");
    var menuCloseBtn = document.getElementById("menuClose");
    function openMenu() {
      navDrawer.classList.add("open");
      navScrim.classList.add("open");
      navDrawer.setAttribute("aria-hidden", "false");
    }
    function closeMenu() {
      if (!navDrawer) return;
      navDrawer.classList.remove("open");
      navScrim.classList.remove("open");
      navDrawer.setAttribute("aria-hidden", "true");
    }
    if (menuOpenBtn) menuOpenBtn.addEventListener("click", openMenu);
    if (menuCloseBtn) menuCloseBtn.addEventListener("click", closeMenu);
    if (navScrim) navScrim.addEventListener("click", closeMenu);
    if (drawerLinksEl) drawerLinksEl.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
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

    // add-to-cart buttons (optionally paired with a quantity input via data-qty-input="inputId")
    document.querySelectorAll(".add-cart-btn[data-product]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var qty = 1;
        var qtyInputId = btn.getAttribute("data-qty-input");
        if (qtyInputId) {
          var qtyInput = document.getElementById(qtyInputId);
          if (qtyInput) qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
        }
        addToCart(btn.getAttribute("data-product"), qty);
        openCart();
      });
    });

    // quantity steppers (buy box): buttons with data-qact="inc"/"dec" next to an <input>
    document.querySelectorAll(".qty-stepper").forEach(function (stepper) {
      var input = stepper.querySelector("input");
      if (!input) return;
      stepper.querySelectorAll("button[data-qact]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var min = parseInt(input.getAttribute("min"), 10) || 1;
          var max = parseInt(input.getAttribute("max"), 10) || 99;
          var val = parseInt(input.value, 10) || min;
          if (btn.dataset.qact === "inc") val = Math.min(max, val + 1);
          else if (btn.dataset.qact === "dec") val = Math.max(min, val - 1);
          input.value = val;
        });
      });
      input.addEventListener("change", function () {
        var min = parseInt(input.getAttribute("min"), 10) || 1;
        var max = parseInt(input.getAttribute("max"), 10) || 99;
        var val = parseInt(input.value, 10) || min;
        input.value = Math.min(max, Math.max(min, val));
      });
    });

    // product gallery thumbnails (produto.html)
    document.querySelectorAll(".gallery-thumbs .thumb[data-img]").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var mainImg = document.getElementById("galleryMain");
        if (!mainImg) return;
        mainImg.src = thumb.getAttribute("data-img");
        document.querySelectorAll(".gallery-thumbs .thumb").forEach(function (t) { t.classList.remove("active"); });
        thumb.classList.add("active");
      });
    });

    // click/tap main product image to open full-size in a new tab (whichever image is currently shown)
    var galleryMainWrap = document.getElementById("galleryMainWrap");
    if (galleryMainWrap) {
      var openZoom = function () {
        var mainImg = document.getElementById("galleryMain");
        if (mainImg) window.open(mainImg.src, "_blank", "noopener");
      };
      galleryMainWrap.addEventListener("click", openZoom);
      galleryMainWrap.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openZoom(); }
      });
    }

    // product tabs (produto.html)
    document.querySelectorAll(".tabnav .tabbtn[data-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tab = btn.getAttribute("data-tab");
        document.querySelectorAll(".tabnav .tabbtn").forEach(function (b) { b.classList.remove("active"); });
        document.querySelectorAll(".tabpanel").forEach(function (p) { p.classList.remove("active"); });
        btn.classList.add("active");
        var panel = document.getElementById("tab-" + tab);
        if (panel) panel.classList.add("active");
      });
    });

    // contact form
    var contactForm = document.getElementById("contactForm");
    if (contactForm) contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var statusEl = document.getElementById("cf-status");
      var submitBtn = document.getElementById("cf-submit");
      var fd = new FormData(contactForm);
      var data = {
        name: fd.get("name") || "",
        email: fd.get("email") || "",
        subject: fd.get("subject") || "",
        message: fd.get("message") || "",
        company: fd.get("company") || "", // honeypot
      };
      statusEl.className = "foot-note";
      statusEl.textContent = "";
      submitBtn.disabled = true;
      var sendingTxt = getLang() === "en" ? "Sending…" : "A enviar…";
      submitBtn.textContent = sendingTxt;
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }).catch(function () { throw new Error("error"); }); })
        .then(function (res) {
          submitBtn.disabled = false;
          submitBtn.textContent = t("cont_form_send");
          if (res.ok && res.body.ok) {
            statusEl.className = "foot-note success";
            statusEl.textContent = getLang() === "en"
              ? "Message sent — we'll reply as soon as we can."
              : "Mensagem enviada — responderemos assim que possível.";
            contactForm.reset();
          } else {
            throw new Error((res.body && res.body.error) || "error");
          }
        })
        .catch(function (err) {
          submitBtn.disabled = false;
          submitBtn.textContent = t("cont_form_send");
          statusEl.className = "foot-note error";
          var detail = (err && err.message && err.message !== "error") ? err.message : "";
          var fallback = getLang() === "en"
            ? "Couldn't send the message — please email geral@zirbo.cc directly."
            : "Não foi possível enviar a mensagem — escreva diretamente para geral@zirbo.cc.";
          statusEl.textContent = detail ? (fallback + " (" + detail + ")") : fallback;
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
              ? "Checkout is temporarily unavailable — please try again shortly, or contact us."
              : "O checkout está temporariamente indisponível — tente novamente dentro de momentos, ou contacte-nos.";
            checkoutError.style.display = "block";
          }
        });
    });

    // obrigado — a completed Stripe Checkout redirects here with
    // ?session_id=... in the URL. Only then do we know the purchase went
    // through, so this is the single place the cart gets cleared.
    if (/\/obrigado\.html/.test(window.location.pathname) &&
        /[?&]session_id=/.test(window.location.search)) {
      localStorage.removeItem("zirbo_cart");
      renderCart();
    }
  });
})();
