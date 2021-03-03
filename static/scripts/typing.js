var dialog = document.querySelector('dialog');
var btn_show = document.getElementById('show');
var btn_close = document.getElementById('close');

const japanese_sentences = ['さあ張り切って頑張りましょう。'];
const alphabet_sentences = ['saaharikitteganbarimashou.'];
let idx = 0;

btn_show.addEventListener('click', function() {
    dialog.showModal();
    typingGame();
}, false);

btn_close.addEventListener('click', function() {
    dialog.close();
    idx = 0;
    true_keys = '';
}, false);

function typingGame(){
    japanese_s = japanese_sentences[0];
    alphabet_s = alphabet_sentences[0];
    printSentence(japanese_s,alphabet_s);
    show_keydown(alphabet_s);
}

function printSentence(japanese_s,alpabet_s){
    japanese.innerHTML = japanese_s;
    alphabet.innerHTML = alpabet_s;
}

function show_keydown(alphabet_s){
    document.onkeydown = function(e){
        let key = e.key;
        if(key == alphabet_s[idx]){
            idx += 1;
            alphabet.innerHTML = alphabet_s.slice(idx,);
        }
    }
}