var dialog = document.querySelector('dialog');
var btn_show = document.getElementById('show');
var btn_close = document.getElementById('close');

const japanese_sentences = ['さあ張り切って頑張りましょう。','その1行が世界を一歩前に進める','君の手には人を笑顔にできる力がある','あなたの技術を尊敬しています。','ソースコードはアートなのです。'];
const alphabet_sentences = ['saaharikitteganbarimashou.','sono1gyougasekaiwoippomaenisusumeru','kiminotenihahitowoegaonidekirutikaragaaru','anatanogijyutuwosonkeisiteimasu.','so-suko-dohaa-tonanodesu.'];
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
    shuffle();
    japanese_s = japanese_sentences[0];
    alphabet_s = alphabet_sentences[0];
    printSentence(japanese_s,alphabet_s);
    show_keydown(alphabet_s);
}

function shuffle(){
    for(var i = japanese_sentences.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = japanese_sentences[i];
        japanese_sentences[i] = japanese_sentences[j];
        japanese_sentences[j] = tmp;
        
        tmp = alphabet_sentences[i];
        alphabet_sentences[i] = alphabet_sentences[j];
        alphabet_sentences[j] = tmp;
    }
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