// Animação de entrada para seções do Elementor
window.addEventListener('DOMContentLoaded', function() {
  var elSections = document.querySelectorAll('.elementor-section.elementor-inner-section.elementor-section-full_width.elementor-section-height-default');
  elSections.forEach(function(section) {
    setTimeout(function() {
      section.classList.add('animate');
    }, 100);
  });
});
