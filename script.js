/* ====================================================================
   PORTFÓLIO — Gustavo Fidelis

   O site se comporta como um editor de código:
   1. Clicar num arquivo do explorador abre esse arquivo no painel
   2. Cada arquivo aberto vira uma aba, que pode ser fechada
   3. A barra de status mostra a linguagem do arquivo atual
   4. No celular o explorador vira uma gaveta
   5. O formulário de contato envia sem recarregar a página

   Todo o conteúdo já vem no HTML: trocar de arquivo apenas mostra e
   esconde. Isso mantém o site legível para buscadores e funcionando
   mesmo se o JavaScript falhar.
==================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==================================================================
  // Cada arquivo tem um rótulo, um ícone e uma linguagem para o status
  // ==================================================================
  const ARQUIVOS = {
    sobre:        { rotulo: 'sobre.md',         icone: 'fab fa-markdown',           linguagem: 'Markdown' },
    projetos:     { rotulo: 'projetos.tsx',     icone: 'fab fa-react',              linguagem: 'TypeScript React' },
    ia:           { rotulo: 'ia.md',            icone: 'fas fa-terminal',           linguagem: 'Markdown' },
    stack:        { rotulo: 'stack.json',       icone: 'fas fa-code',               linguagem: 'JSON' },
    certificados: { rotulo: 'certificados/',    icone: 'fas fa-folder',             linguagem: '9 arquivos' },
    experiencia:  { rotulo: 'experiencia.log',  icone: 'fas fa-clock-rotate-left',  linguagem: 'Log' },
    contato:      { rotulo: 'contato.env',      icone: 'fas fa-key',                linguagem: 'Env' }
  };

  const explorer = document.getElementById('explorer');
  const veu = document.getElementById('veu');
  const abasEl = document.getElementById('abas');
  const conteudo = document.getElementById('conteudo');
  const statusLinguagem = document.getElementById('status-linguagem');

  // Arquivos abertos, na ordem em que apareceram nas abas
  let abertos = ['sobre'];
  let atual = 'sobre';


  // ==================================================================
  // 1. TROCAR DE ARQUIVO
  // ==================================================================
  function abrirArquivo(id, opcoes = {}) {
    if (!ARQUIVOS[id]) return;

    atual = id;
    if (!abertos.includes(id)) abertos.push(id);

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

    statusLinguagem.textContent = ARQUIVOS[id].linguagem;
    conteudo.scrollTop = 0;
    desenharAbas();

    // Mantém o endereço compartilhável sem dar salto na página
    if (!opcoes.semHistorico) {
      history.replaceState(null, '', '#' + id);
    }
  }


  // ==================================================================
  // 2. ABAS
  // ==================================================================
  function desenharAbas() {
    abasEl.textContent = '';

    abertos.forEach(id => {
      const dados = ARQUIVOS[id];

      const aba = document.createElement('button');
      aba.className = 'aba' + (id === atual ? ' ativa' : '');
      aba.setAttribute('role', 'tab');
      aba.setAttribute('aria-selected', String(id === atual));
      aba.addEventListener('click', () => abrirArquivo(id));

      const icone = document.createElement('i');
      icone.className = dados.icone;
      aba.appendChild(icone);
      aba.appendChild(document.createTextNode(dados.rotulo));

      // A última aba não pode ser fechada: o painel ficaria vazio
      if (abertos.length > 1) {
        const fechar = document.createElement('span');
        fechar.className = 'aba-fechar';
        fechar.textContent = '×';
        fechar.setAttribute('role', 'button');
        fechar.setAttribute('aria-label', 'Fechar ' + dados.rotulo);
        fechar.addEventListener('click', evento => {
          evento.stopPropagation();
          fecharAba(id);
        });
        aba.appendChild(fechar);
      }

      abasEl.appendChild(aba);
    });

    const ativa = abasEl.querySelector('.aba.ativa');
    if (ativa) ativa.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function fecharAba(id) {
    const posicao = abertos.indexOf(id);
    abertos = abertos.filter(a => a !== id);

    // Fechando a aba atual, vai para a vizinha
    if (atual === id) {
      abrirArquivo(abertos[Math.max(0, posicao - 1)]);
    } else {
      desenharAbas();
    }
  }


  // ==================================================================
  // 3. EXPLORADOR
  // ==================================================================
  document.querySelectorAll('.arquivo').forEach(botao => {
    botao.addEventListener('click', () => {
      abrirArquivo(botao.dataset.arquivo);
      fecharGaveta();
    });
  });


  // ==================================================================
  // 4. GAVETA NO CELULAR
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
  // 5. ATALHOS DE TECLADO
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
  // 6. FORMULÁRIO DE CONTATO
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
  // 7. ABERTURA
  // Respeita o endereço compartilhado (#projetos, #contato…)
  // ==================================================================
  const inicial = location.hash.replace('#', '');
  abrirArquivo(ARQUIVOS[inicial] ? inicial : 'sobre', { semHistorico: true });

  window.addEventListener('hashchange', () => {
    const alvo = location.hash.replace('#', '');
    if (ARQUIVOS[alvo] && alvo !== atual) abrirArquivo(alvo, { semHistorico: true });
  });

});
