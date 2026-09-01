/* ====================================================================
   PORTFÓLIO — Gustavo Fidelis

   Estrutura de projeto: lista de assuntos na lateral, painel que troca.
   1. Clicar num assunto da lateral troca o conteúdo do painel
   2. O cabeçalho do painel diz onde você está
   3. No celular a lateral vira uma gaveta
   4. O formulário de contato envia sem recarregar a página

   Todo o conteúdo já vem no HTML: trocar de arquivo apenas mostra e
   esconde. Isso mantém o site legível para buscadores e funcionando
   mesmo se o JavaScript falhar.
==================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==================================================================
  // Cada arquivo tem um rótulo, um ícone e uma linguagem para o status
  // ==================================================================
  const ARQUIVOS = {
    sobre:        { rotulo: 'sobre',         desc: 'quem sou e o que já construí' },
    projetos:     { rotulo: 'projetos',      desc: 'duas lojas virtuais em produção' },
    ia:           { rotulo: 'ia com critério', desc: 'como uso IA no desenvolvimento' },
    stack:        { rotulo: 'stack',         desc: 'ferramentas que uso de verdade' },
    certificados: { rotulo: 'certificados',  desc: '9 certificados, com verificação' },
    experiencia:  { rotulo: 'experiência',   desc: 'formação e trajetória' },
    contato:      { rotulo: 'contato',       desc: 'aberto a estágio e vagas júnior' }
  };

  const explorer = document.getElementById('explorer');
  const veu = document.getElementById('veu');
  const conteudo = document.getElementById('conteudo');
  const painelNome = document.getElementById('painel-nome');
  const painelDesc = document.getElementById('painel-desc');

  let atual = 'sobre';


  // ==================================================================
  // 1. TROCAR DE ARQUIVO
  // ==================================================================
  function abrirArquivo(id, opcoes = {}) {
    if (!ARQUIVOS[id]) return;

    atual = id;

    // Painel: mostra só o arquivo atual
    conteudo.querySelectorAll('.arq').forEach(arq => {
      const ativo = arq.dataset.conteudo === id;
      arq.hidden = !ativo;
      if (ativo) {
        // Reinicia a animação de entrada a cada abertura
        arq.style.animation = 'none';
        void arq.offsetWidth;
        arq.style.animation = '';
      }
    });

    // Explorador: destaca o arquivo
    document.querySelectorAll('.arquivo').forEach(botao => {
      botao.classList.toggle('ativo', botao.dataset.arquivo === id);
    });

    painelNome.textContent = ARQUIVOS[id].rotulo;
    painelDesc.textContent = ARQUIVOS[id].desc;
    conteudo.scrollTop = 0;

    // Mantém o endereço compartilhável sem dar salto na página
    if (!opcoes.semHistorico) {
      history.replaceState(null, '', '#' + id);
    }
  }


  // ==================================================================
  // 2. LISTA DE ASSUNTOS
  // ==================================================================
  document.querySelectorAll('.arquivo').forEach(botao => {
    botao.addEventListener('click', () => {
      abrirArquivo(botao.dataset.arquivo);
      fecharGaveta();
    });
  });


  // ==================================================================
  // 3. GAVETA NO CELULAR
  // ==================================================================
  const menuBtn = document.getElementById('menu-btn');

  function abrirGaveta() {
    explorer.classList.add('aberto');
    veu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function fecharGaveta() {
    explorer.classList.remove('aberto');
    veu.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn.addEventListener('click', () => {
    if (explorer.classList.contains('aberto')) fecharGaveta();
    else abrirGaveta();
  });

  veu.addEventListener('click', fecharGaveta);

  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') fecharGaveta();
  });


  // ==================================================================
  // 4. ATALHOS DE TECLADO
  // Alt + seta troca de arquivo, como em editor de verdade
  // ==================================================================
  const ordem = Object.keys(ARQUIVOS);

  document.addEventListener('keydown', evento => {
    if (!evento.altKey) return;
    if (evento.key !== 'ArrowRight' && evento.key !== 'ArrowLeft') return;

    evento.preventDefault();
    const passo = evento.key === 'ArrowRight' ? 1 : -1;
    const indice = (ordem.indexOf(atual) + passo + ordem.length) % ordem.length;
    abrirArquivo(ordem[indice]);
  });


  // ==================================================================
  // 5. FORMULÁRIO DE CONTATO
  // ==================================================================
  const form = document.getElementById('contato-form');

  form.addEventListener('submit', async evento => {
    evento.preventDefault();

    const botao = form.querySelector('.btn-enviar');
    const original = botao.innerHTML;
    botao.disabled = true;
    botao.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Enviando';

    try {
      const resposta = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!resposta.ok) throw new Error('Formspree respondeu ' + resposta.status);

      botao.innerHTML = '<i class="fas fa-check"></i> Mensagem enviada';
      form.reset();
    } catch (erro) {
      // Se o envio falhar, o e-mail direto continua sendo um caminho
      botao.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Falhou — use o e-mail';
      console.error('Envio do formulário falhou:', erro);
    }

    setTimeout(() => {
      botao.disabled = false;
      botao.innerHTML = original;
    }, 4000);
  });


  // ==================================================================
  // 6. ABERTURA
  // Respeita o endereço compartilhado (#projetos, #contato…)
  // ==================================================================
  const inicial = location.hash.replace('#', '');
  abrirArquivo(ARQUIVOS[inicial] ? inicial : 'sobre', { semHistorico: true });

  window.addEventListener('hashchange', () => {
    const alvo = location.hash.replace('#', '');
    if (ARQUIVOS[alvo] && alvo !== atual) abrirArquivo(alvo, { semHistorico: true });
  });

});
