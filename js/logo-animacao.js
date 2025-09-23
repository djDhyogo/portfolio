
// Animação de aparecer para a logo principal
window.addEventListener('DOMContentLoaded', function() {
var logo = document.querySelector('.mylogo');
if (logo) {
setTimeout(function() {
    logo.classList.add('animate');
}, 100); // pequeno delay para suavizar
}
// Efeito de translateY ao rolar a página (motion_fx_translatey_effect)
function handleScroll() {
if (!logo) return;
// Range de efeito: 37% a 81% do scroll da página
var start = 0.37;
var end = 0.81;
var scrollY = window.scrollY || window.pageYOffset;
var docHeight = document.documentElement.scrollHeight - window.innerHeight;
var scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;
// Se dentro do range, aplica translateY proporcional
if (scrollPercent >= start && scrollPercent <= end) {
    var progress = (scrollPercent - start) / (end - start);
    var translateY = progress * 1.6 * 100; // 1.6px por % do range
    logo.style.transform = `scale(1) translateY(${translateY}px)`;
} else if (scrollPercent < start) {
    logo.style.transform = 'scale(1) translateY(0px)';
} else {
    logo.style.transform = `scale(1) translateY(${1.6 * 100}px)`;
}
}
window.addEventListener('scroll', handleScroll);
});


