// Animação global de entrada/saída harmonizada + animação da logo + animação Elementor
window.addEventListener('DOMContentLoaded', function() {
  // --- Animação global de entrada/saída ---
  var todos = document.body.querySelectorAll('*');
  var ignorar = function(el) {
    var isWhatsappBtn = el.classList && el.classList.contains('whatsapp-button');
    var isWhatsappIcon = el.parentElement && el.parentElement.classList && el.parentElement.classList.contains('whatsapp-button');
    return isWhatsappBtn || isWhatsappIcon;
  };
  todos.forEach(function(el) {
    if (
      el.offsetParent !== null &&
      el.tagName !== 'SCRIPT' &&
      el.tagName !== 'STYLE' &&
      !ignorar(el)
    ) {
      el.classList.add('animar-saida');
    }
  });
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!ignorar(entry.target)) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('animar-saida');
          entry.target.classList.remove('animar-visivel');
          entry.target.classList.add('animar-entrada');
          setTimeout(function() {
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
  todos.forEach(function(el) {
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
    setTimeout(function() {
      logo.classList.add('animate');
    }, 100);
    function handleScroll() {
      if (!logo) return;
      var start = 0.37;
      var end = 0.81;
      var scrollY = window.scrollY || window.pageYOffset;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;
      if (scrollPercent >= start && scrollPercent <= end) {
        var progress = (scrollPercent - start) / (end - start);
        var translateY = progress * 1.6 * 100;
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
  var elSections = document.querySelectorAll('.elementor-section.elementor-inner-section.elementor-section-full_width.elementor-section-height-default');
  elSections.forEach(function(section) {
    setTimeout(function() {
      section.classList.add('animate');
    }, 100);
  });
});
