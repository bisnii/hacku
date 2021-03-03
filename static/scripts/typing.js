var dialog = document.querySelector('dialog');
var btn_show = document.getElementById('show');
var btn_close = document.getElementById('close');

const japanese_sentences = ['さあ張り切って頑張りましょう。'];
const alphabet_sentences = ['saaharikitteganbarimashou.'];

btn_show.addEventListener('click', function() {
    dialog.showModal();
    typingGame();
}, false);

btn_close.addEventListener('click', function() {
    dialog.close();
}, false);

function typingGame(){
    printSentence(japanese_sentences[0],alphabet_sentences[0]);
    show_keydown();
}

function printSentence(japanese_s,alpabet_s){
    japanese.innerHTML = japanese_s;
    alphabet.innerHTML = alpabet_s;
}

function show_keydown(){
    document.onkeydown = function(e){
        let key = e.key;
        input_key.innerHTML = key;
    }
}
/*
word = word.toLowerCase();
if(e.keyCode == 190){
    word = '.';
}
else if(e.keyCode == 188){
    word = ',';
}
if(word == input_words[0][idx]){
    true_key += word;
    show_word.innerHTML = true_key;
    idx += 1;
}*/