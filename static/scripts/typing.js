const dialog = document.querySelector('dialog');
const array_j = ['さあ張り切って頑張りましょう。', 'ハングリーであれ、愚かであれ。', 'ソースコードは嘘をつかない', '枯れないバグは無い', '美はシンプルさに宿る'];
const array_a = ['saaharikitteganbarimashou.','hanguri-deare,orokadeare.','so-suko-dohausowotukanai','karenaibaguhanai','bihasinpurusaniyadoru']
let used_j = [];
let used_a = [];
let idx = 0;

function init(){
    shuffle();
    used_a = [];
    used_j = [];
    idx = 0;
}

function typingGame(use_j = array_j, use_a = array_a){
    phrase_j = use_j[0];
    phrase_a = use_a[0];
    l = use_j.length;
    printSentence(phrase_j,phrase_a,l);
    show_keydown(phrase_a);
}

function shuffle(){
    for(var i = array_j.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = array_j[i];
        array_j[i] = array_j[j];
        array_j[j] = tmp;

        tmp = array_a[i];
        array_a[i] = array_a[j];
        array_a[j] = tmp;
    }
}

function printSentence(phrase_j,phrase_a,l){
    count.innerHTML = '下の文章を入力してください　　'+(6-l)+'/3';
    japanese.innerHTML = phrase_j;
    alphabet.innerHTML = phrase_a;
}

function show_keydown(phrase_a){
    document.onkeydown = async function(e){
        let key = e.key;
        if(key === phrase_a[idx]){
            idx += 1;
            alphabet.innerHTML = phrase_a.slice(idx,);
            if (idx === phrase_a.length) {
                idx = 0;
                await used_j.push(japanese.innerHTML);
                const newArray_j = await array_j.filter(i => used_j.indexOf(i) === -1);
                await used_a.push(phrase_a);
                const newArray_a = await array_a.filter(i => used_a.indexOf(i) === -1);
                if (newArray_j.length === 2) {
                    alphabet_s = "";
                    dialog.close();
                }
                await typingGame(newArray_j,newArray_a);
            }
        }
    }
}