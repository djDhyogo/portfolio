// Anima todos os elementos da página ao carregar
window.addEventListener('DOMContentLoaded', function() {
  var todos = document.body.querySelectorAll('*');
  todos.forEach(function(el, i) {
    // Evita animar elementos invisíveis, scripts, o botão do WhatsApp e o ícone dentro dele
    var isWhatsappBtn = el.classList && el.classList.contains('whatsapp-button');
    var isWhatsappIcon = el.parentElement && el.parentElement.classList && el.parentElement.classList.contains('whatsapp-button');
    if (
      el.offsetParent !== null &&
      el.tagName !== 'SCRIPT' &&
      el.tagName !== 'STYLE' &&
      !isWhatsappBtn &&
      !isWhatsappIcon
    ) {
      setTimeout(function() {
        el.classList.add('animar-entrada');
      }, 40 * i); // efeito cascata rápido
    }
  });
});
