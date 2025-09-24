// Animação global de entrada/saída harmonizada + animação da logo + animação Elementor
window.addEventListener('DOMContentLoaded', function () {
  // --- Animação global de entrada/saída ---
  var todos = document.body.querySelectorAll('*');
  var ignorar = function (el) {
    var isWhatsappBtn = el.classList && el.classList.contains('whatsapp-button');
    var isWhatsappIcon = el.parentElement && el.parentElement.classList && el.parentElement.classList.contains('whatsapp-button');
    var isBackTop = el.classList && el.classList.contains('back-to-top');
    var isMotionEffect = el.classList && el.classList.contains('motion-effect');
    var isLogo = el.classList && el.classList.contains('mylogo');
    return isWhatsappBtn || isWhatsappIcon || isBackTop || isMotionEffect || isLogo;
  };
  todos.forEach(function (el) {
    if (
      el.offsetParent !== null &&
      el.tagName !== 'SCRIPT' &&
      el.tagName !== 'STYLE' &&
      !ignorar(el)
    ) {
      el.classList.add('animar-saida');
    }
  });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!ignorar(entry.target)) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('animar-saida');
          entry.target.classList.remove('animar-visivel');
          entry.target.classList.add('animar-entrada');
          setTimeout(function () {
            entry.target.classList.remove('animar-entrada');
            entry.target.classList.add('animar-visivel');
          }, 900);
        } else {
          entry.target.classList.remove('animar-entrada');
          entry.target.classList.remove('animar-visivel');
          entry.target.classList.add('animar-saida');
        }
      }
    });
  }, { threshold: 0.15 });
  todos.forEach(function (el) {
    if (
      el.offsetParent !== null &&
      el.tagName !== 'SCRIPT' &&
      el.tagName !== 'STYLE' &&
      !ignorar(el)
    ) {
      observer.observe(el);
    }
  });

  // --- Animação da logo principal ---
  var logo = document.querySelector('.mylogo');
  if (logo) {
    setTimeout(function () {
      logo.classList.add('animate');
    }, 100);
    // Após a animação de entrada, removemos a classe para evitar conflito com o controle via JS
    logo.addEventListener('animationend', function () {
      if (logo) {
        logo.classList.remove('animate');
        // Garante que o estilo animado finalize em estado visível antes do controle por scroll
        logo.style.opacity = '1';
        logo.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
    }, { once: true });
    function handleScroll() {
      if (!logo) return;
      // Respeita preferências de redução de movimento
      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) return;

      var start = 0.50; // ponto de início da transição (percentual do documento)
      var end = 0.81;   // ponto final da transição
      var maxTranslate = 160; // px (equivalente a 1.6 * 100)
      var scrollY = window.scrollY || window.pageYOffset;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;
      if (scrollPercent >= start && scrollPercent <= end) {
        var progress = (scrollPercent - start) / (end - start);
        var translateY = progress * maxTranslate;
        var opacity = 1 - progress;
        logo.style.transform = `translate3d(0, ${translateY}px, 0) scale(1)`;
        logo.style.opacity = String(opacity);
      } else if (scrollPercent < start) {
        logo.style.transform = 'translate3d(0, 0px, 0) scale(1)';
        logo.style.opacity = '1';
      } else {
        logo.style.transform = `translate3d(0, ${maxTranslate}px, 0) scale(1)`;
        logo.style.opacity = '0';
      }
    }
    window.addEventListener('scroll', handleScroll);
    // Aplica estado inicial
    handleScroll();
  }

  // --- Animação para seções do Elementor ---
  var elSections = document.querySelectorAll('.elementor-section.elementor-inner-section.elementor-section-full_width.elementor-section-height-default');
  elSections.forEach(function (section) {
    setTimeout(function () {
      section.classList.add('animate');
    }, 100);
  });

  // --- Efeito de movimento e opacidade no scroll (motion-effect) ---
  // Cache dos elementos e RAF para performance
  var motionNodes = Array.prototype.slice.call(document.querySelectorAll('.motion-effect'));
  var ticking = false;

  function clamp01(v) {
    return v < 0 ? 0 : (v > 1 ? 1 : v);
  }

  function readMotionDistance(el) {
    // Lê a distância configurável por elemento (CSS var --motion-distance)
    var styles = window.getComputedStyle(el);
    var val = styles.getPropertyValue('--motion-distance').trim();
    // Extrai número base (px), fallback 30
    var n = parseFloat(val || '30');
    return isNaN(n) ? 30 : n;
  }

  function updateMotionFrame() {
    ticking = false;
    if (!motionNodes.length) return;
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
    for (var i = 0; i < motionNodes.length; i++) {
      var el = motionNodes[i];
      var rect = el.getBoundingClientRect();
      var percent = clamp01(1 - rect.top / windowHeight);
      var distance = readMotionDistance(el);
      var translateY = distance - percent * distance;
      el.style.setProperty('--translateY', translateY + 'px');
      el.style.opacity = String(percent);

      if (rect.bottom < 0 || rect.top > windowHeight) {
        el.style.setProperty('--translateY', distance + 'px');
        el.style.opacity = '0';
      }
    }
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateMotionFrame);
    }
  }

  // Listeners para atualizar a animação
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  // Primeira atualização após o DOM pronto
  requestTick();

  // --- Botão Voltar ao Topo ---
  var topBtn = document.querySelector('.back-to-top');
  if (topBtn) {
    function syncTopBtnVisibility() {
      var y = window.scrollY || window.pageYOffset;
      var isSmall = (window.innerWidth || document.documentElement.clientWidth) <= 768;
      var threshold = isSmall ? 120 : 300;
      if (y > threshold) {
        topBtn.classList.add('show');
      } else {
        topBtn.classList.remove('show');
      }
    }
    window.addEventListener('scroll', syncTopBtnVisibility, { passive: true });
    syncTopBtnVisibility();
    topBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
