
// main.js ou main.ts
import 'aos/dist/aos.css'; // Importar o CSS do AOS
import AOS from 'aos';

// Inicializar o AOS
AOS.init();

// SelectText
function SelectText(element) {
  var doc = document,
      text = element,
      range, selection;

  if (doc.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
      /*
      if(range.toString().length === 0){
        range.moveToElementText(text);
        range.select();
      }
      */
  } else if (window.getSelection) {
      selection = window.getSelection();
      if(selection.toString().length === 0){
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
      }
  }
}