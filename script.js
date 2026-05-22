/* ====================================================================
   JAVASCRIPT DO PORTFÓLIO — Gustavo Fidelis
   
   O QUE ESSE ARQUIVO FAZ:
   1. Partículas animadas no fundo do Hero (usando Canvas)
   2. Animação de digitação ("Desenvolvedor Front-End")
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
  let mouse = { x: null, y: null }; // Posição do mouse (para interagir)

  // Ajusta o canvas para o tamanho da janela
  function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  ajustarCanvas();

  // Quando a janela muda de tamanho, ajusta o canvas
  window.addEventListener('resize', ajustarCanvas);

  // Detecta posição do mouse para as partículas reagirem
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  // Quando o mouse sai da janela, reseta a posição
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

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

      // Se o mouse estiver perto, empurra a partícula
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        if (distancia < 100) {
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        }
      }

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
    'Desenvolvedor Full Stack',
    'React • Next.js • Node.js',
    'Construindo SaaS e E-commerces',
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
  // 3. NAVBAR — Muda de estilo ao rolar a página
  // ================================================================
  
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.navbar-link');
  const secoes = document.querySelectorAll('.section');

  window.addEventListener('scroll', () => {
    // Adiciona classe "scrolled" quando rolar mais de 50px
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Destaca o link da seção que está visível na tela
    let secaoAtual = '';
    secoes.forEach(secao => {
      const topo = secao.offsetTop - 100;
      const altura = secao.offsetHeight;
      if (window.scrollY >= topo && window.scrollY < topo + altura) {
        secaoAtual = secao.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${secaoAtual}`) {
        link.classList.add('active');
      }
    });
  });


  // ================================================================
  // 4. MENU HAMBURGER (celular)
  // ================================================================
  
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarMenu = document.getElementById('navbar-menu');

  navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('open');
  });

  // Fecha o menu ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbarToggle.classList.remove('active');
      navbarMenu.classList.remove('open');
    });
  });


  // ================================================================
  // 5. SCROLL REVEAL — Animação de entrada ao scrollar
  // Quando um elemento com a classe "reveal" entra na tela,
  // ele ganha a classe "active" e aparece com uma animação suave
  // ================================================================
  
  // Adiciona a classe "reveal" em todos os elementos que devem animar
  const elementosParaAnimar = document.querySelectorAll(
    '.section-header, .sobre-content, .projeto-card, .skills-category, ' +
    '.timeline-item, .certificado-card, .contato-wrapper'
  );
  
  elementosParaAnimar.forEach(el => el.classList.add('reveal'));

  // IntersectionObserver: "observa" quando um elemento entra na tela
  const observadorScroll = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('active');
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

}); // Fim do DOMContentLoaded
