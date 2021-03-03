var dialog = document.querySelector('dialog');
var btn_show = document.getElementById('show');
var btn_close = document.getElementById('close');


btn_show.addEventListener('click', function() {
    dialog.showModal();
    typingGame();
}, false);

btn_close.addEventListener('click', function() {
    dialog.close();
}, false);

function typingGame(){
    printSentence();
}

function printSentence(){
    sentence.innerHTML = 'さあ張り切って頑張りましょう。'
}