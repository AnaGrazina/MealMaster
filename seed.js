{ 
  const LS_REC   = 'mealmaster_receitas';
  const SEED_TAG = 'mealmaster_seed_v3'; // nova versão para resemear

  try {
    if (localStorage.getItem(SEED_TAG)) return;

    // se já houver receitas gravadas, não mexe
    const raw = localStorage.getItem(LS_REC);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return;
    }

    const R = (id, titulo, tipo, img, ingredientes, tags = [], passos = '') => ({
      id, titulo, tipo, img, tags,
      ingredientes: ingredientes.map(i => `- ${i}`).join('\n'),
      passos
    });

    // imagens (mantive as tuas)
    const IMG = {
      pao_queijo_fruta: "https://cdn.recipes.lidl/images/pt-PT/Torrada-de-queijo-quark-e-compota-de-fruta.jpg",
      iogurte_cereais_fruta: "https://amodadoflavio.pt/ophaboah/2020/02/Iogurte-com-fruta-e-cereais.jpg",
      tosta_fiambre_queijo_tomate: "https://www.iguaria.com/wp-content/uploads/2018/05/Iguaria-Tosta-Mista-e-Tomate.jpg",
      
      ovos_mexidos_torrada: "https://www.comidaereceitas.com.br/img/sizeswp/1200x675/2017/10/torrada_ovos.jpg",

      bifes_grelhados_legumes: "https://hortodocampogrande.pt/wp-content/uploads/2024/06/01_HCG_blog_1200x752px.jpg",
      wrap_frango: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9nr7GP04ZrLHq0_itSBuPQdkV40puyFfwHA&s",
      quiche_espinafres: "https://www.saborintenso.com/images/receitas/Quiche-de-Espinafres-SI-2.jpg",
      arroz_atum: "https://www.vaqueiro.pt/-/media/Project/Upfield/Whitelabels/Vaqueiro-PT/Assets/Recipes/sync-images/6dbd3f00-cee3-4852-adef-3dda3535051c.jpg?rev=76c3e4cdb1ba4595a99e904cc2646fc3",
      rissois_croquetes_arroz: "https://media-cdn.tripadvisor.com/media/photo-s/1a/c8/68/8a/shrimp-patties-with-rice.jpg",

      sandes_queijo_tomate: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZGv1HIMTVwTWDN1daGlVjA-jENkl61lCvAw&s",
      crepes_banana: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=60",
      tosta_mista: "https://pavaotogo.com/wp-content/uploads/2021/04/Pavaotogo_SM_BLOG_Apr-15-2021.jpg",
      iogurte_mel: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0YNQFMXKKKq-i84-kwiYnYBUajDJ02Alayg&s",
      fruta_epoca: "https://blog.bodyscience.pt/wp-content/uploads/frutas-da-epoca-1024x683.jpg",

      sopa_legumes: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1_nKIitWzdwBQPQo5xyV1CzR1WBxoA7Sncg&s",
      frango_grelhado_legumes: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYSE_2Qe2I6hHpfw1sA-hqZ6tCAQda5cCbDg&s",
      bacalhau_bras: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxfLoMu6U4W6EsSup16vCnnDe4-MRnmlvPYQ&s",
      massada_atum: "https://saboreiaavida.nestle.pt/sites/default/files/styles/receita_card_620x560/public/2023-10/massa_molho_cremoso_atum.png?h=fd38a500&itok=eHp8o_K2",
      lasanha: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9X_xMjcXQcYOIM7btDF1sPqOPO4k6jI08Tg&s",

      cha_bolachas: "https://imagens.publico.pt/imagens.aspx/480196?tp=KM&w=380&h=253&act=cropResize",
      iogurte_simples: "https://static.itdg.com.br/images/640-440/a0a793c2aaaf9f8a08cbf0b0fd187f81/254783-shutterstock-556732771-1-1-.jpg",
      leite_morno: "https://thumbs.dreamstime.com/b/duas-m%C3%A3os-que-mant%C3%AAm-um-copo-do-leite-morno-servido-em-de-vidro-transparente-110567264.jpg",
      torrada: "https://media-cdn.tripadvisor.com/media/photo-s/09/74/94/f7/pastelaria-al-kerib.jpg",
      gelatina: "https://www.funtastyc.pt/blogue/wp-content/uploads/2021/09/como-fazer-gelatina-caseira-810x540.jpg"
    };

    const seeds = [
      // ===== 5 PEQUENOS-ALMOÇOS ===== (substituição feita aqui)
      R(1, "Pão com queijo fresco e fruta", "pequeno-almoco", IMG.pao_queijo_fruta,
        ["pão","queijo fresco","fruta da época"], ["leve","rápido"],
        "Fatiar o pão, colocar queijo fresco e acompanhar com fruta."),
      R(2, "Iogurte natural com cereais e fruta", "pequeno-almoco", IMG.iogurte_cereais_fruta,
        ["iogurte natural","cereais/granola","fruta"], ["rápido","pequeno-almoço"],
        "Dispor o iogurte numa taça, juntar cereais e fruta."),
      R(3, "Tosta com fiambre, queijo e tomate", "pequeno-almoco", IMG.tosta_fiambre_queijo_tomate,
        ["pão","fiambre","queijo","tomate"], ["tosta","rápido"],
        "Montar e tostar até o queijo derreter."),
      R(4, "Torrada com manteiga e compota", "pequeno-almoco", IMG.torrada,
        ["pão","manteiga","compota"], ["rápido","clássico"],
        "Tostar o pão e barrar com manteiga e compota."),
      R(5, "Ovos mexidos com torrada", "pequeno-almoco", IMG.ovos_mexidos_torrada,
        ["ovos","manteiga","sal","pimenta","pão"], ["proteína","rápido"],
        "Mexer os ovos em lume brando e servir com torrada."),

      // ===== 5 ALMOÇOS =====
      R(6, "Bifes grelhados com legumes", "almoco", IMG.bifes_grelhados_legumes,
        ["bife de vaca","curgete","pimento","azeite","sal","pimenta"], ["proteína","grelhados"],
        "Grelhar os bifes e saltear os legumes."),
      R(7, "Wrap de frango", "almoco", IMG.wrap_frango,
        ["tortilha","frango cozinhado","alface","tomate","molho iogurte"], ["lancheira","prato único"],
        "Rechear a tortilha e enrolar."),
      R(8, "Quiche de espinafres", "almoco", IMG.quiche_espinafres,
        ["massa quebrada","ovos","espinafres","queijo","leite/natas"], ["vegetariano"],
        "Forno a 180ºC durante 30–35 min."),
      R(9, "Arroz de atum", "almoco", IMG.arroz_atum,
        ["arroz","atum","cebola","azeite","sal"], ["rápido","baixo custo"],
        "Saltear cebola, juntar atum e envolver com arroz cozido."),
      R(10, "Rissóis/Croquetes com arroz de legumes", "almoco", IMG.rissois_croquetes_arroz,
        ["rissóis/croquetes","arroz","legumes variados"], ["prático","conforto"],
        "Fritar ou levar ao forno e acompanhar com arroz de legumes."),

      // ===== 5 LANCHES =====
      R(11, "Sandes de queijo e tomate", "lanche", IMG.sandes_queijo_tomate,
        ["pão","queijo","tomate","azeite","oregãos"], ["clássico"], "Montar e servir."),
      R(12, "Crepes de banana", "lanche", IMG.crepes_banana,
        ["banana","ovo","farinha (opcional)","mel"], ["doce","rápido"], "Bater e cozinhar em frigideira."),
      R(13, "Tosta mista", "lanche", IMG.tosta_mista,
        ["pão","fiambre","queijo"], ["tosta"], "Tostar até o queijo derreter."),
      R(14, "Iogurte natural com mel", "lanche", IMG.iogurte_mel,
        ["iogurte natural","mel"], ["leve"], "Misturar e servir fresco."),
      R(15, "Fruta da época", "lanche", IMG.fruta_epoca,
        ["fruta da época"], ["snack"], "Lavar, cortar e servir."),

      // ===== 5 JANTARES =====
      R(16, "Sopa de legumes", "jantar", IMG.sopa_legumes,
        ["legumes variados","batata","água","sal","azeite"], ["leve","inverno"],
        "Cozer e triturar."),
      R(17, "Frango grelhado com legumes", "jantar", IMG.frango_grelhado_legumes,
        ["peito de frango","courgete","pimento","sal","azeite"], ["proteína"],
        "Grelhar frango e saltear legumes."),
      R(18, "Bacalhau à Brás", "jantar", IMG.bacalhau_bras,
        ["bacalhau","batata palha","ovos","cebola","azeitonas"], ["peixe"],
        "Saltear cebola, juntar bacalhau e ovos."),
      R(19, "Massada de atum", "jantar", IMG.massada_atum,
        ["massa","atum","tomate","alho","azeite"], ["rápido"],
        "Cozinhar massa e envolver no molho."),
      R(20, "Lasanha", "jantar", IMG.lasanha,
        ["placas de lasanha","carne/pesto/legumes","molho de tomate","queijo"], ["forno","conforto"],
        "Montar em camadas e levar ao forno."),

      // ===== 5 CEIAS =====
      R(21, "Chá e bolachas", "ceia", IMG.cha_bolachas,
        ["chá a gosto","bolachas simples"], ["leve"]),
      R(22, "Iogurte natural", "ceia", IMG.iogurte_simples,
        ["iogurte natural","canela/mel (opcional)"], ["sem preparação"]),
      R(23, "Leite morno", "ceia", IMG.leite_morno,
        ["leite","canela (opcional)"], ["conforto"]),
      R(24, "Torrada", "ceia", IMG.torrada,
        ["pão","manteiga/compota (opcional)"], ["rápido"]),
      R(25, "Gelatina", "ceia", IMG.gelatina,
        ["gelatina em pó/folhas","água"], ["leve","sobremesa"],
        "Preparar conforme embalagem e levar ao frio.")
    ];

    localStorage.setItem(LS_REC, JSON.stringify(seeds));
    localStorage.setItem(SEED_TAG, 'true');
    console.log('[MealMaster] Receitas seed gravadas:', seeds.length);
  } catch (e) {
    console.warn('[seed] falhou:', e);
  }
}