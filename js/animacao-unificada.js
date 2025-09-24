// Animação global de entrada/saída harmonizada + animação da logo + animação Elementor
window.addEventListener('DOMContentLoaded', function () {
  // --- Função para ignorar elementos específicos (ex: botão do WhatsApp) ---
  function ignorar(el) {
    if (!el) return false;
    const isWhatsappBtn = el.classList?.contains('whatsapp-button');
    const isWhatsappIcon =
      el.parentElement?.classList?.contains('whatsapp-button');
  const isBackToTop = el.classList?.contains('back-to-top');
  // Ignora também elementos fixos de UI que não devem animar
  return isWhatsappBtn || isWhatsappIcon || isBackToTop;
  }

  // --- Seleciona todos os elementos elegíveis ---
  const todos = Array.from(document.body.querySelectorAll('*')).filter(
    el =>
      el.offsetParent !== null &&
      el.tagName !== 'SCRIPT' &&
      el.tagName !== 'STYLE' &&
      !ignorar(el)
  );

  // Define estado inicial de saída
  todos.forEach(el => {
    el.classList.add('animar-saida');
    el.dataset.state = 'saida'; // controla estado atual
  });

  // --- Observer para entrada/saída ---
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const el = entry.target;
        if (ignorar(el)) return;

        const current = el.dataset.state;

        if (entry.isIntersecting && current !== 'visivel') {
          // Entrando em tela
          el.classList.remove('animar-saida', 'animar-visivel');
          el.classList.add('animar-entrada');
          el.dataset.state = 'entrada';

          // Quando a animação de entrada termina → vira "visivel"
          el.addEventListener(
            'animationend',
            () => {
              el.classList.remove('animar-entrada');
              el.classList.add('animar-visivel');
              el.dataset.state = 'visivel';
            },
            { once: true }
          );
        } else if (!entry.isIntersecting && current === 'visivel') {
          // Saindo da tela
          el.classList.remove('animar-entrada', 'animar-visivel');
          el.classList.add('animar-saida');
          el.dataset.state = 'saida';
        }
      });
    },
    { threshold: 0.15 }
  );

  todos.forEach(el => observer.observe(el));

  // --- Animação da logo principal ---
  const logo = document.querySelector('.mylogo');
  if (logo) {
    setTimeout(() => {
      logo.classList.add('animate');
    }, 100);

    function handleScroll() {
      const start = 0.37;
      const end = 0.81;
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;

      if (scrollPercent >= start && scrollPercent <= end) {
        const progress = (scrollPercent - start) / (end - start);
        const translateY = progress * 1.6 * 100;
        logo.style.transform = `scale(1) translateY(${translateY}px)`;
      } else if (scrollPercent < start) {
        logo.style.transform = 'scale(1) translateY(0px)';
      } else {
        logo.style.transform = `scale(1) translateY(${1.6 * 100}px)`;
      }
    }

    window.addEventListener('scroll', handleScroll);
  }

  // --- Animação para seções do Elementor ---
  const elSections = document.querySelectorAll(
    '.elementor-section.elementor-inner-section.elementor-section-full_width.elementor-section-height-default'
  );
  elSections.forEach(section => {
    setTimeout(() => {
      section.classList.add('animate');
    }, 100);
  });

  // --- Botão Voltar ao Topo ---
  const topBtn = document.querySelector('.back-to-top');
  if (topBtn) {
    const syncTopBtnVisibility = () => {
      const y = window.scrollY || window.pageYOffset;
      const isSmall = (window.innerWidth || document.documentElement.clientWidth) <= 768;
      const threshold = isSmall ? 120 : 300;
      if (y > threshold) topBtn.classList.add('show');
      else topBtn.classList.remove('show');
    };
    window.addEventListener('scroll', syncTopBtnVisibility, { passive: true });
    window.addEventListener('resize', syncTopBtnVisibility);
    // Estado inicial
    syncTopBtnVisibility();
    // Ação de clique
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
