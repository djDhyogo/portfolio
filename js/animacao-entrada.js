// Anima todos os elementos da página ao carregar
window.addEventListener('DOMContentLoaded', function() {
  var todos = document.body.querySelectorAll('*');
  todos.forEach(function(el, i) {
    // Evita animar elementos invisíveis, scripts, o botão do WhatsApp e o ícone dentro dele

