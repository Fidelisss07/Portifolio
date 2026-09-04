/* ====================================================================
   JAVASCRIPT DO PORTFÓLIO — Gustavo Fidelis
   
   O QUE ESSE ARQUIVO FAZ:
   1. Partículas animadas no fundo do Hero (usando Canvas)
   2. Animação de digitação (formação, stack e projetos)
   3. Navbar que muda ao rolar a página
   4. Menu hamburger no celular
   5. Animações de entrada ao scrollar (Scroll Reveal)
   6. Barras de skill animadas
   7. Formulário de contato com feedback visual
   
   DICA: Leia cada seção devagar, os comentários explicam tudo!
==================================================================== */


/* ====================================================================
   CUIDADO: Todo o código só roda depois que o HTML carrega
   DOMContentLoaded = "DOM (HTML) Carregou e está pronto para ser manipulado"
==================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  // ================================================================
  // 1. PARTÍCULAS ANIMADAS NO HERO
  // Usamos o <canvas> como uma "tela de desenho" e o JavaScript
  // desenha círculos que se movem e se conectam com linhas
  // ================================================================
  
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d'); // "ctx" é o pincel para desenhar no canvas
  
  // Variável para guardar as partículas
  let particulas = [];

  // Ajusta o canvas para o tamanho da janela
  function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  ajustarCanvas();

  // Quando a janela muda de tamanho, ajusta o canvas
  window.addEventListener('resize', ajustarCanvas);

  // Classe Partícula — cada bolinha na tela é uma instância dessa classe
  class Particula {
    constructor() {
      this.x = Math.random() * canvas.width;          // Posição X aleatória
      this.y = Math.random() * canvas.height;         // Posição Y aleatória
      this.tamanho = Math.random() * 2 + 0.5;         // Tamanho entre 0.5 e 2.5
      this.velocidadeX = (Math.random() - 0.5) * 0.5; // Velocidade horizontal
      this.velocidadeY = (Math.random() - 0.5) * 0.5; // Velocidade vertical
      this.opacidade = Math.random() * 0.5 + 0.1;     // Transparência
    }

    // Desenha a partícula no canvas
    desenhar() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${this.opacidade})`; // Cor roxa!
      ctx.fill();
    }

    // Atualiza a posição da partícula (move ela)
    atualizar() {
      this.x += this.velocidadeX;
      this.y += this.velocidadeY;

      // Se sair da tela, volta pelo outro lado
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;

      this.desenhar();
    }
  }

  // Cria as partículas (mais em telas maiores, menos em celulares)
  function criarParticulas() {
    particulas = [];
    // Calcula quantidade baseado no tamanho da tela
    const quantidade = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
    
    for (let i = 0; i < quantidade; i++) {
      particulas.push(new Particula());
    }
  }
  criarParticulas();

  // Desenha linhas entre partículas próximas
  function desenharConexoes() {
    for (let i = 0; i < particulas.length; i++) {
      for (let j = i + 1; j < particulas.length; j++) {
        const dx = particulas[i].x - particulas[j].x;
        const dy = particulas[i].y - particulas[j].y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        // Se estiverem a menos de 120px de distância, desenha uma linha
        if (distancia < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distancia / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particulas[i].x, particulas[i].y);
          ctx.lineTo(particulas[j].x, particulas[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Controle: só anima quando o Hero está visível (economiza bateria/CPU)
  let heroVisivel = true;
  let animacaoAtiva = false;

  // Loop de animação — roda ~60 vezes por segundo
  function animarParticulas() {
    if (!heroVisivel) { animacaoAtiva = false; return; } // Pausa fora da tela
    animacaoAtiva = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    particulas.forEach(p => p.atualizar()); // Atualiza cada partícula
    desenharConexoes();                      // Desenha as linhas

    requestAnimationFrame(animarParticulas); // Repete no próximo frame
  }
  animarParticulas();

  // Observa o Hero: pausa a animação quando sai da tela, retoma ao voltar
  new IntersectionObserver((entradas) => {
    heroVisivel = entradas[0].isIntersecting;
    if (heroVisivel && !animacaoAtiva) animarParticulas();
  }).observe(document.querySelector('.hero'));

  // Recria partículas quando a tela muda de tamanho
  window.addEventListener('resize', criarParticulas);


  // ================================================================
  // 2. ANIMAÇÃO DE DIGITAÇÃO
  // Simula alguém digitando e apagando textos
  // ================================================================
  
  const elementoDigitacao = document.getElementById('typing-text');
  
  // GUSTAVO: Mude os textos abaixo para o que quiser!
  const textos = [
    'Ciência da Computação · FIAP',
    'React • Next.js • Node.js',
    'Construindo E-commerces completos',
    'Desenvolvendo com Claude Code',
    'Apaixonado por Tecnologia'
  ];
  
  let indiceTexto = 0;    // Qual texto está sendo digitado
  let indiceLetra = 0;    // Qual letra está sendo digitada
  let apagando = false;   // Está apagando ou digitando?
  let velocidade = 100;   // Velocidade em milissegundos

  function digitarTexto() {
    const textoAtual = textos[indiceTexto];
    
    if (!apagando) {
      // DIGITANDO: adiciona uma letra por vez
      elementoDigitacao.textContent = textoAtual.substring(0, indiceLetra + 1);
      indiceLetra++;
      velocidade = 80 + Math.random() * 40; // Velocidade variável (mais realista)
      
      // Se terminou de digitar, espera 2 segundos e começa a apagar
      if (indiceLetra === textoAtual.length) {
        apagando = true;
        velocidade = 2000; // Pausa antes de apagar
      }
    } else {
      // APAGANDO: remove uma letra por vez
      elementoDigitacao.textContent = textoAtual.substring(0, indiceLetra - 1);
      indiceLetra--;
      velocidade = 40; // Apaga mais rápido
      
      // Se terminou de apagar, vai para o próximo texto
      if (indiceLetra === 0) {
        apagando = false;
        indiceTexto = (indiceTexto + 1) % textos.length; // Volta ao início quando acabar
        velocidade = 500; // Pausa antes de digitar o próximo
      }
    }
    
    setTimeout(digitarTexto, velocidade); // Chama a si mesmo após o delay
  }
  
  // Começa a digitação após 1 segundo
  setTimeout(digitarTexto, 1000);


  // ================================================================
  // 3. NAVEGAÇÃO POR PAINEL
  // A lateral troca o assunto visível em vez de rolar a página
  // ================================================================

  const palco = document.querySelector('.palco');
  const itens = document.querySelectorAll('.lateral-item');
  const lateral = document.getElementById('lateral');
  const veuLateral = document.getElementById('veu-lateral');
  const navbar = document.getElementById('navbar');

  function mostrarPainel(id, opcoes = {}) {
    const alvo = document.getElementById(id);
    if (!alvo) return;

    palco.querySelectorAll(':scope > section').forEach(secao => {
      secao.classList.toggle('ativo', secao === alvo);
    });

    itens.forEach(item => item.classList.toggle('ativo', item.dataset.painel === id));

    // O painel entra do zero: reanima o que estava escondido
    alvo.querySelectorAll('.reveal').forEach(el => el.classList.remove('active'));
    requestAnimationFrame(() => {
      alvo.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    });

    window.scrollTo({ top: 0, behavior: 'auto' });
    navbar.classList.remove('scrolled');

    // Na home o proprio hero ja tem o botao "Meu Curriculo". O da barra so
    // aparece nos outros paineis, onde nao existe outro caminho para o PDF.
    navbar.classList.toggle('na-home', id === 'hero');

    if (!opcoes.semHistorico) history.replaceState(null, '', '#' + id);
  }

  itens.forEach(item => {
    item.addEventListener('click', () => {
      mostrarPainel(item.dataset.painel);
      fecharLateral();
    });
  });

  // Links internos da página também trocam de painel
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', evento => {
      const id = link.getAttribute('href').slice(1);
      if (!document.getElementById(id) || !id) return;
      evento.preventDefault();
      mostrarPainel(id);
    });
  });


  // ================================================================
  // 4. GAVETA NO CELULAR
  // ================================================================

  const botaoMenu = document.getElementById('navbar-toggle');

  function abrirLateral() {
    lateral.classList.add('aberta');
    botaoMenu.classList.add('ativo');
    veuLateral.hidden = false;
  }

  function fecharLateral() {
    lateral.classList.remove('aberta');
    botaoMenu.classList.remove('ativo');
    veuLateral.hidden = true;
  }

  botaoMenu.addEventListener('click', () => {
    if (lateral.classList.contains('aberta')) fecharLateral();
    else abrirLateral();
  });

  veuLateral.addEventListener('click', fecharLateral);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharLateral(); });

  // Abre no assunto pedido pelo endereço (#projetos, #contato…)
  const inicial = location.hash.slice(1);
  mostrarPainel(document.getElementById(inicial) ? inicial : 'hero', { semHistorico: true });


  // ================================================================
  // 5. SCROLL REVEAL — Animação de entrada ao scrollar
  // Quando um elemento com a classe "reveal" entra na tela,
  // ele ganha a classe "active" e aparece com uma animação suave
  // ================================================================
  
  // Adiciona a classe "reveal" em todos os elementos que devem animar
  const elementosParaAnimar = document.querySelectorAll(
    '.section-header, .sobre-content, .projeto-card, .skills-category, ' +
    '.ia-intro, .ia-card, ' +
    '.timeline-item, .certificados-grupo-header, .certificado-card, .contato-wrapper'
  );
  
  elementosParaAnimar.forEach(el => el.classList.add('reveal'));

  // ESCALONAMENTO: irmãos entram em cascata, não todos de uma vez.
  // Sem isso, oito certificados aparecem juntos e parece um bloco piscando.
  document.querySelectorAll('.reveal').forEach(el => {
    const irmaos = Array.from(el.parentElement.children)
      .filter(filho => filho.classList.contains('reveal'));
    const posicao = irmaos.indexOf(el);
    if (posicao > 0) {
      // 70ms entre cada um, com teto para listas longas não demorarem demais
      el.style.setProperty('--atraso-reveal', Math.min(posicao * 70, 560) + 'ms');
    }
  });

  // IntersectionObserver: "observa" quando um elemento entra na tela
  const observadorScroll = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        const alvo = entrada.target;
        alvo.classList.add('active');
        observadorScroll.unobserve(alvo); // anima uma vez só

        // Ao terminar, tira as classes: o elemento volta ao estado natural
        // e os efeitos de hover do card voltam a funcionar sem disputa.
        alvo.addEventListener('animationend', () => {
          alvo.classList.remove('reveal', 'active');
          alvo.style.removeProperty('--atraso-reveal');
        }, { once: true });
      }
    });
  }, {
    threshold: 0.1,   // O trigger acontece quando 10% do elemento é visível
    rootMargin: '0px 0px -50px 0px' // Começa a animação um pouco antes
  });

  // Observa cada elemento
  document.querySelectorAll('.reveal').forEach(el => {
    observadorScroll.observe(el);
  });


  // ================================================================
  // 5b. FOCO POR ROLAGEM
  // O card que está no centro da tela ganha destaque. Diferente de um
  // efeito de mouse, isso também funciona no celular.
  // ================================================================

  const cardsFocaveis = document.querySelectorAll(
    '.projeto-card, .ia-card, .certificado-card, .skill-item, .timeline-content'
  );

  const observadorFoco = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      entrada.target.classList.toggle('em-foco', entrada.isIntersecting);
    });
  }, {
    // Faixa estreita no meio da tela: só o que passa por ali acende
    rootMargin: '-42% 0px -42% 0px'
  });

  cardsFocaveis.forEach(el => observadorFoco.observe(el));


  // ================================================================
  // 6. BARRAS DE SKILL ANIMADAS
  // Quando a seção de skills aparece na tela, as barras se preenchem
  // ================================================================
  
  const barrasSkill = document.querySelectorAll('.skill-progress');
  let skillsAnimadas = false;

  const observadorSkills = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting && !skillsAnimadas) {
        skillsAnimadas = true;
        barrasSkill.forEach((barra, indice) => {
          // Anima cada barra com um pequeno atraso entre elas
          setTimeout(() => {
            const progresso = barra.getAttribute('data-progress');
            barra.style.width = `${progresso}%`;
          }, indice * 200); // 200ms de delay entre cada uma
        });
      }
    });
  }, { threshold: 0.3 });

  // Observa a seção de skills
  const secaoSkills = document.querySelector('.skills');
  if (secaoSkills) {
    observadorSkills.observe(secaoSkills);
  }


  // ================================================================
  // 7. FORMULÁRIO DE CONTATO (envio real via Formspree)
  // O formulário envia os dados para o Formspree, que repassa a
  // mensagem para o e-mail do Gustavo. O ID fica no atributo
  // "action" do <form> no index.html.
  // ================================================================

  const formulario = document.getElementById('contato-form');

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o reload padrão da página

    const botao = formulario.querySelector('button[type="submit"]');
    const textoOriginal = botao.innerHTML;

    // Feedback visual: mostra que está "enviando"
    botao.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    botao.disabled = true;
    botao.style.opacity = '0.7';

    try {
      // Envia os dados do formulário para o Formspree
      const resposta = await fetch(formulario.action, {
        method: 'POST',
        body: new FormData(formulario),
        headers: { 'Accept': 'application/json' }
      });

      if (!resposta.ok) throw new Error('Falha no envio');

      // Sucesso: mensagem enviada de verdade
      botao.innerHTML = '<i class="fas fa-check"></i> Enviado!';
      botao.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      formulario.reset(); // Limpa o formulário
    } catch (erro) {
      // Erro: algo deu errado no envio
      botao.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Erro ao enviar';
      botao.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
    }

    // Volta o botão ao normal após 3 segundos
    setTimeout(() => {
      botao.innerHTML = textoOriginal;
      botao.disabled = false;
      botao.style.opacity = '1';
      botao.style.background = '';
    }, 3000);
  });


  // ================================================================
  // 8. HOVER 3D NOS CARDS DE PROJETO
  // Quando passa o mouse sobre o card, ele inclina suavemente
  // ================================================================
  
  const cardsComTilt = document.querySelectorAll('[data-tilt]');
  
  cardsComTilt.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;  // Posição X do mouse dentro do card
      const y = e.clientY - rect.top;   // Posição Y do mouse dentro do card
      
      // Calcula o ângulo de inclinação baseado na posição do mouse
      const centroX = rect.width / 2;
      const centroY = rect.height / 2;
      const rotateX = (y - centroY) / 20; // Inclinação vertical
      const rotateY = (centroX - x) / 20; // Inclinação horizontal
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    // Quando o mouse sai, volta ao normal suavemente
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });

    // Quando o mouse entra, remove a transição para ser responsivo
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });


  // ================================================================
  // ESTUDO DE CASO — abre e fecha o raciocínio de cada projeto
  // ================================================================

  document.querySelectorAll('.caso-btn').forEach(botao => {
    botao.addEventListener('click', () => {
      const caso = document.getElementById('caso-' + botao.dataset.caso);
      const abrindo = caso.hidden;
      caso.hidden = !abrindo;
      botao.setAttribute('aria-expanded', String(abrindo));
      botao.lastChild.textContent = abrindo ? ' Fechar estudo de caso' : ' Ver estudo de caso';
    });
  });


  // ================================================================
  // GITHUB AO VIVO
  // Busca perfil e repositórios na API pública quando o painel Código
  // abre pela primeira vez. Carregar sob demanda evita gastar o limite
  // de 60 requisições por hora com quem nem visita a seção.
  // ================================================================

  const USUARIO = 'Fidelisss07';
  let githubCarregado = false;

  function haQuantoTempo(iso) {
    const dias = Math.round((Date.now() - new Date(iso)) / 86400000);
    const fmt = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
    if (dias < 30) return fmt.format(-dias, 'day');
    if (dias < 365) return fmt.format(-Math.round(dias / 30), 'month');
    return fmt.format(-Math.round(dias / 365), 'year');
  }

  function cartaoNumero(valor, rotulo) {
    const div = document.createElement('div');
    div.className = 'gh-numero';
    const v = document.createElement('span');
    v.className = 'gh-numero-valor';
    v.textContent = valor;
    const r = document.createElement('span');
    r.className = 'gh-numero-rotulo';
    r.textContent = rotulo;
    div.append(v, r);
    return div;
  }

  async function carregarGithub() {
    if (githubCarregado) return;
    githubCarregado = true;

    const estado = document.getElementById('gh-estado');
    const numeros = document.getElementById('gh-numeros');
    const lista = document.getElementById('gh-repos');

    try {
      const [perfil, repos] = await Promise.all([
        fetch(`https://api.github.com/users/${USUARIO}`).then(r => {
          if (!r.ok) throw new Error('perfil ' + r.status);
          return r.json();
        }),
        fetch(`https://api.github.com/users/${USUARIO}/repos?sort=pushed&per_page=100`).then(r => {
          if (!r.ok) throw new Error('repos ' + r.status);
          return r.json();
        })
      ]);

      const desde = new Date(perfil.created_at).getFullYear();
      const noAr = repos.filter(r => r.homepage).length;
      const plural = (n, um, muitos) => (n === 1 ? um : muitos);

      numeros.append(
        cartaoNumero(perfil.public_repos,
          plural(perfil.public_repos, 'repositório público', 'repositórios públicos')),
        cartaoNumero(noAr, plural(noAr, 'projeto no ar', 'projetos no ar')),
        cartaoNumero(desde, 'no GitHub desde')
      );

      // Fora o repositório de perfil e os forks: só o que é trabalho
      const relevantes = repos
        .filter(r => !r.fork && r.name.toLowerCase() !== USUARIO.toLowerCase())
        .filter(r => r.homepage || r.description || r.language)
        .slice(0, 6);

      relevantes.forEach(repo => {
        const cartao = document.createElement('a');
        cartao.className = 'gh-repo glass-card';
        cartao.href = repo.html_url;
        cartao.target = '_blank';
        cartao.rel = 'noopener noreferrer';

        const nome = document.createElement('span');
        nome.className = 'gh-repo-nome';
        nome.textContent = repo.name;

        const meta = document.createElement('span');
        meta.className = 'gh-repo-meta';
        meta.textContent = [repo.language, 'atualizado ' + haQuantoTempo(repo.pushed_at)]
          .filter(Boolean).join(' · ');

        cartao.append(nome, meta);

        if (repo.homepage) {
          const noAr = document.createElement('span');
          noAr.className = 'gh-repo-ar';
          noAr.textContent = 'no ar';
          cartao.appendChild(noAr);
        }

        lista.appendChild(cartao);
      });

      estado.hidden = true;
      numeros.hidden = false;
      lista.hidden = false;
    } catch (erro) {
      // A API limita a 60 requisições por hora por IP; falhar é previsível
      estado.innerHTML =
        '<i class="fas fa-triangle-exclamation"></i> Não consegui falar com a API do GitHub agora. ' +
        '<a href="https://github.com/' + USUARIO + '" target="_blank" rel="noopener noreferrer">' +
        'Ver o perfil direto</a>.';
      console.error('GitHub:', erro);
    }
  }

  // O painel Código dispara a busca na primeira abertura
  document.querySelector('.lateral-item[data-painel="codigo"]')
    .addEventListener('click', carregarGithub);

  if (location.hash === '#codigo') carregarGithub();


  // ================================================================
  // DEMO DO CHECKOUT
  // Reproduz o fluxo construído na BaLu 3D. Nada é enviado: os
  // algoritmos rodam no navegador. Luhn, bandeira por prefixo e frete
  // por região do CEP são as regras reais, não números fingidos.
  // ================================================================

  const demo = document.getElementById('demo');

  if (demo) {
    const PRECO = 149.90;
    const estado = { qtd: 1, frete: null, metodo: 'pix', cartaoOk: false };

    const dinheiro = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const $ = id => document.getElementById(id);

    // ---- Frete: o primeiro dígito do CEP indica a região do país ----
    const REGIOES = {
      0: ['Grande São Paulo', 18.90, 2], 1: ['Interior de São Paulo', 22.90, 3],
      2: ['Rio de Janeiro e Espírito Santo', 26.90, 4], 3: ['Minas Gerais', 27.90, 4],
      4: ['Bahia e Sergipe', 34.90, 6], 5: ['Nordeste (PE, AL, PB, RN)', 38.90, 7],
      6: ['Norte e Ceará', 44.90, 9], 7: ['Centro-Oeste e Distrito Federal', 32.90, 5],
      8: ['Paraná e Santa Catarina', 28.90, 4], 9: ['Rio Grande do Sul', 31.90, 5]
    };

    function calcularFrete(cep) {
      const digitos = cep.replace(/\D/g, '');
      if (digitos.length !== 8) return null;
      const [regiao, valor, prazo] = REGIOES[digitos[0]];
      // Acima de 3 unidades o pacote muda de faixa de peso
      const extra = estado.qtd > 3 ? 9.90 : 0;
      return { regiao, valor: valor + extra, prazo };
    }

    // ---- Cartão: Luhn é o algoritmo que os emissores usam de fato ----
    function passaNoLuhn(numero) {
      const d = numero.replace(/\D/g, '');
      if (d.length < 13) return false;
      let soma = 0, dobra = false;
      for (let i = d.length - 1; i >= 0; i--) {
        let n = Number(d[i]);
        if (dobra) { n *= 2; if (n > 9) n -= 9; }
        soma += n;
        dobra = !dobra;
      }
      return soma % 10 === 0;
    }

    function bandeira(numero) {
      const d = numero.replace(/\D/g, '');
      if (/^4/.test(d)) return 'Visa';
      if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard';
      if (/^3[47]/.test(d)) return 'Amex';
      if (/^(4011|4312|4389|5041|6277|6362)/.test(d)) return 'Elo';
      if (/^(606282|3841)/.test(d)) return 'Hipercard';
      return '';
    }

    // ---- Totais ----
    function recalcular() {
      const subtotal = PRECO * estado.qtd;
      const frete = estado.frete ? estado.frete.valor : 0;
      const desconto = estado.metodo === 'pix' ? subtotal * 0.05 : 0;
      const total = subtotal + frete - desconto;

      $('demo-qtd').textContent = estado.qtd;
      $('demo-subtotal').textContent = dinheiro(subtotal);
      $('demo-frete-val').textContent = estado.frete ? dinheiro(frete) : '—';
      $('demo-desconto-val').textContent = '−' + dinheiro(desconto);
      $('demo-linha-desc').hidden = estado.metodo !== 'pix';
      $('demo-total').textContent = dinheiro(total);

      const pronto = estado.frete && (estado.metodo === 'pix' || estado.cartaoOk);
      $('demo-finalizar').disabled = !pronto;
      return total;
    }

    // ---- Quantidade ----
    $('demo-mais').addEventListener('click', () => {
      estado.qtd = Math.min(9, estado.qtd + 1);
      if (estado.frete) atualizarFrete($('demo-cep').value);
      recalcular();
    });

    $('demo-menos').addEventListener('click', () => {
      estado.qtd = Math.max(1, estado.qtd - 1);
      if (estado.frete) atualizarFrete($('demo-cep').value);
      recalcular();
    });

    // ---- CEP ----
    $('demo-cep').addEventListener('input', evento => {
      const d = evento.target.value.replace(/\D/g, '').slice(0, 8);
      evento.target.value = d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
    });

    function atualizarFrete(cep) {
      const r = calcularFrete(cep);
      const saida = $('demo-frete-res');

      if (!r) {
        estado.frete = null;
        saida.textContent = 'CEP incompleto — precisa de 8 dígitos.';
        saida.classList.add('erro');
      } else {
        estado.frete = r;
        saida.classList.remove('erro');
        saida.textContent = `${r.regiao} · ${dinheiro(r.valor)} · chega em até ${r.prazo} dias úteis`;
      }
      recalcular();
    }

    $('demo-calcular').addEventListener('click', () => atualizarFrete($('demo-cep').value));
    $('demo-cep').addEventListener('keydown', e => { if (e.key === 'Enter') atualizarFrete(e.target.value); });

    // ---- Método de pagamento ----
    document.querySelectorAll('.demo-metodo').forEach(botao => {
      botao.addEventListener('click', () => {
        estado.metodo = botao.dataset.metodo;
        document.querySelectorAll('.demo-metodo').forEach(b => {
          const ativo = b === botao;
          b.classList.toggle('ativo', ativo);
          b.setAttribute('aria-selected', String(ativo));
        });
        $('demo-pix').hidden = estado.metodo !== 'pix';
        $('demo-cartao').hidden = estado.metodo !== 'cartao';
        recalcular();
      });
    });

    // ---- Cartão: formata, detecta bandeira e valida ----
    $('demo-num').addEventListener('input', evento => {
      const d = evento.target.value.replace(/\D/g, '').slice(0, 16);
      evento.target.value = d.replace(/(\d{4})(?=\d)/g, '$1 ');

      $('demo-bandeira').textContent = bandeira(d);
      estado.cartaoOk = passaNoLuhn(d) && d.length >= 13;
      $('demo-erro-num').hidden = d.length < 13 || estado.cartaoOk;
      recalcular();
    });

    $('demo-val').addEventListener('input', evento => {
      const d = evento.target.value.replace(/\D/g, '').slice(0, 4);
      evento.target.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
    });

    $('demo-cvv').addEventListener('input', evento => {
      evento.target.value = evento.target.value.replace(/\D/g, '').slice(0, 4);
    });

    $('demo-preencher').addEventListener('click', () => {
      $('demo-num').value = '4111 1111 1111 1111';
      $('demo-num').dispatchEvent(new Event('input'));
      $('demo-val').value = '12/30';
      $('demo-cvv').value = '123';
    });

    // ---- QR simulado: desenhado no canvas, sem biblioteca ----
    (function desenharQR() {
      const ctx = $('demo-qr-canvas').getContext('2d');
      const cel = 4, n = 33;
      ctx.fillStyle = '#0f0f14';
      ctx.fillRect(0, 0, n * cel, n * cel);
      ctx.fillStyle = '#e9e6f5';
      // Padrão determinístico: parece QR, mas não codifica nada
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          if (((x * 7 + y * 13) ^ (x * y)) % 3 === 0) ctx.fillRect(x * cel, y * cel, cel, cel);
        }
      }
      // Os três marcadores de canto
      [[0, 0], [n - 7, 0], [0, n - 7]].forEach(([mx, my]) => {
        ctx.fillStyle = '#0f0f14';
        ctx.fillRect(mx * cel, my * cel, 7 * cel, 7 * cel);
        ctx.fillStyle = '#e9e6f5';
        ctx.fillRect(mx * cel, my * cel, 7 * cel, cel);
        ctx.fillRect(mx * cel, (my + 6) * cel, 7 * cel, cel);
        ctx.fillRect(mx * cel, my * cel, cel, 7 * cel);
        ctx.fillRect((mx + 6) * cel, my * cel, cel, 7 * cel);
        ctx.fillRect((mx + 2) * cel, (my + 2) * cel, 3 * cel, 3 * cel);
      });
    })();

    // ---- Contador do PIX ----
    let restam = 300;
    setInterval(() => {
      if (demo.classList.contains('ativo') === false) return;
      restam = restam > 0 ? restam - 1 : 300;
      const m = String(Math.floor(restam / 60)).padStart(2, '0');
      const s = String(restam % 60).padStart(2, '0');
      $('demo-contador').textContent = `${m}:${s}`;
    }, 1000);

    $('demo-copiar').addEventListener('click', async evento => {
      const botao = evento.currentTarget;
      try {
        await navigator.clipboard.writeText('SIMULACAO-NAO-E-UM-PIX-REAL-' + Date.now());
        botao.innerHTML = '<i class="fas fa-check"></i> Copiado (simulação)';
      } catch {
        botao.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Sem acesso à área de transferência';
      }
      setTimeout(() => { botao.innerHTML = '<i class="fas fa-copy"></i> Copiar código'; }, 2500);
    });

    // ---- Finalizar ----
    $('demo-finalizar').addEventListener('click', () => {
      const total = recalcular();
      $('demo-numero').textContent = '#' + String(Math.floor(Math.random() * 900000) + 100000);
      $('demo-metodo-txt').textContent = estado.metodo === 'pix' ? 'PIX' : 'cartão de crédito';
      $('demo-total-final').textContent = dinheiro(total);
      document.querySelector('.demo-grid').hidden = true;
      $('demo-sucesso').hidden = false;
    });

    $('demo-refazer').addEventListener('click', () => {
      $('demo-sucesso').hidden = true;
      document.querySelector('.demo-grid').hidden = false;
    });

    recalcular();
  }


  // ================================================================
  // ANÉIS DAS MÉTRICAS
  // O preenchimento vem do próprio número medido, não de um valor fixo
  // ================================================================

  document.querySelectorAll('.nota-item').forEach(item => {
    item.querySelector('.nota-anel').style.setProperty('--pct', item.dataset.nota);
  });

}); // Fim do DOMContentLoaded
