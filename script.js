/* ====================================================================
   JAVASCRIPT DO PORTFÓLIO — Gustavo Fidelis
   
   O QUE ESSE ARQUIVO FAZ:
   1. Navbar que muda ao rolar a página
   2. Menu hamburger no celular
   3. Animações de entrada ao scrollar, em cascata
   4. Foco por rolagem: o card no centro da tela acende
   5. Barras de skill animadas
   6. Formulário de contato com feedback visual
   7. Inclinação 3D nos cards de projeto
   
   DICA: Leia cada seção devagar, os comentários explicam tudo!
==================================================================== */


/* ====================================================================
   CUIDADO: Todo o código só roda depois que o HTML carrega
   DOMContentLoaded = "DOM (HTML) Carregou e está pronto para ser manipulado"
==================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  // ================================================================
  // A abertura editorial dispensou o canvas de partículas e o efeito
  // de digitação. Os blocos foram removidos junto com os elementos.
  // ================================================================

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

}); // Fim do DOMContentLoaded
