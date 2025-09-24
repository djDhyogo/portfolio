// Animação global de entrada/saída harmonizada + animação da logo + animação Elementor
window.addEventListener('DOMContentLoaded', function () {
  // --- Função para ignorar elementos específicos (ex: botão do WhatsApp) ---
  function ignorar(el) {
    if (!el) return false;
    const isWhatsappBtn = el.classList?.contains('whatsapp-button');
    const isWhatsappIcon =
      el.parentElement?.classList?.contains('whatsapp-button');
    const isBackToTop = el.classList?.contains('back-to-top');
    const inHeroBtn = el.classList?.contains('hero-btn') || el.closest?.('.hero-btn');
    const isLogo = el.classList?.contains('mylogo');
    // Ignora também elementos fixos de UI e os botões do HERO que terão animação própria
    return isWhatsappBtn || isWhatsappIcon || isBackToTop || inHeroBtn || isLogo;
  }

  // Preferência de redução de movimento (usada globalmente)
  const reduceMotion =
    !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // --- Seleciona todos os elementos elegíveis ---
  const todos = Array.from(document.body.querySelectorAll('*')).filter(
    el =>
      el.offsetParent !== null &&
      el.tagName !== 'SCRIPT' &&
      el.tagName !== 'STYLE' &&
      !ignorar(el)
  );

  // Define estado inicial: se estiver no viewport, já começa visível
  const vh = window.innerHeight || document.documentElement.clientHeight;
  todos.forEach(el => {
    const rect = el.getBoundingClientRect();
    const inView = rect.bottom > 0 && rect.top < vh;
    if (inView) {
      el.classList.add('animar-visivel');
      el.dataset.state = 'visivel';
    } else {
      el.classList.add('animar-saida');
      el.dataset.state = 'saida';
    }
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
    // Marca estado final da animação para unificar com botões
    logo.addEventListener('animationend', () => {
      logo.classList.remove('animate');
      logo.classList.add('ready');
    }, { once: true });
  }

  // --- Animação dos botões do HERO (mesmo efeito da logo) ---
  const heroBtns = document.querySelectorAll('.hero .hero-actions .hero-btn');
  if (heroBtns.length) {
    heroBtns.forEach((btn, i) => {
      if (reduceMotion) {
        btn.style.opacity = '1';
        btn.style.transform = 'none';
        return;
      }
      setTimeout(() => {
        btn.classList.add('animate');
        btn.addEventListener('animationend', () => {
          btn.classList.remove('animate');
          btn.classList.add('ready');
        }, { once: true });
      }, 180 + i * 90);
    });
  }

  // --- Fade-out no scroll (logo e botões com ordem escalonada) ---
  const heroSection = document.querySelector('.hero');
  let uiTicking = false;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);

  function updateHeroUiOnScroll() {
    uiTicking = false;
    if (reduceMotion || !heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    const h = rect.height || heroSection.offsetHeight || window.innerHeight;
    const intrahero = Math.min(Math.max(-rect.top, 0), h);
    const base = clamp01(intrahero / (h * 0.6)); // base progress

    // Ordem: logo primeiro (i=0), depois botões na ordem
    const elements = [];
    if (logo) elements.push({ el: logo, idx: 0 });
    heroBtns.forEach((btn, i) => elements.push({ el: btn, idx: i + 1 }));

    const stagger = 0.12; // atraso por item na progressão de sumiço
    elements.forEach(({ el, idx }) => {
      if (!el || !el.classList?.contains('ready')) return; // aplica só após animação de entrada
      const local = clamp01(base - idx * stagger);
      const fade = local; // 0..1
      const opacity = 1 - fade;
      const translate = 14 * fade;
      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${translate}px) scale(1)`;
    });
  }

  function requestUiTick() {
    if (!uiTicking) {
      uiTicking = true;
      window.requestAnimationFrame(updateHeroUiOnScroll);
    }
  }

  window.addEventListener('scroll', requestUiTick, { passive: true });
  window.addEventListener('resize', requestUiTick);
  // Estado inicial e após entradas
  requestUiTick();
  setTimeout(requestUiTick, 700);

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
