document.getElementById('time').innerHTML = "00:00";
let timeLimit = 0;
let timerID;
let startPushNum = 0;
let flag = false;
let bgm = new Audio("/static/bgm/bgm-rain.mp3");
let sound = new Audio("/static/alarm/sound-alarm.mp3");


// 確定ボタンが押されたらアラーム時間表示
document.getElementById("check").addEventListener("click", function() {
    sound.pause();
    bgm.pause();
    let $alarmTime = document.getElementById("alarmTime").value;

    if ($alarmTime == '1m') {
        document.getElementById('time').innerHTML = "01:00";
        timeLimit = 10000;
    }
	else if ($alarmTime == '5m') {
        document.getElementById('time').innerHTML = "05:00";
        timeLimit = 300000;
    }
    else if ($alarmTime == '10m') {
        document.getElementById('time').innerHTML = "10:00";
        timeLimit = 600000;
    }
    else if ($alarmTime == '30m') {
        document.getElementById('time').innerHTML = "30:00";
        timeLimit = 1800000;
    }
    else if ($alarmTime == '60m') {
        document.getElementById('time').innerHTML = "60:00";
        timeLimit = 3600000;
    }
    startPushNum = 0;
    if (flag){
        flag = false;
    }
    clearTimeout(timerID);
})    

// カウントダウンの関数
function countDown() {
    timerID = setTimeout(time,1000);
}

// スタートボタンが押されたらカウントダウンスタート
document.getElementById("timerStart").addEventListener("click", function() {
    startPushNum = startPushNum + 1;

    // if (startPushNum == 1){
    //     console.log(startPushNum);
    // }    
    
    if (flag == false && timeLimit>0){
        let $bgmChoice = document.getElementById("bgm").value;
        bgm = new Audio("/static/bgm/bgm-" + $bgmChoice + ".mp3");
        bgm.loop = true;
        bgm.play();
        flag = true;
        countDown();
    }    
})  

// ストップボタンが押されたらタイマーとサウンドをストップ
document.getElementById("timerStop").addEventListener("click", function() {
    console.log(bgm);
    bgm.pause();
    sound.pause();
    console.log("stop");
    if (flag){
        bgm.pause();
        sound.pause();
        flag = false;
    } 
    clearTimeout(timerID);
    startPushNum = 0;
})  

// 時間表示、bgm、アラームを鳴らす関数
function time() {
    let minute = ("00" + Math.floor((timeLimit / 1000) / 60)).slice(-2);
    let second = ("00" + (timeLimit / 1000) % 60).slice(-2);

    document.getElementById("time").innerHTML = minute + ":" + second;

    timeLimit = timeLimit - 1000;
    console.log(timeLimit)

    if (timeLimit < 0) {
        bgm.pause();
        flag = false;
        let $alarmChoice = document.getElementById("alarmMusic").value;
        sound = new Audio("/static/alarm/sound-" + $alarmChoice + ".mp3");

        sound.loop = true;
        sound.play();

        document.getElementById("time").innerHTML = "Wake Up!";
    }
    console.log(flag);
    if (flag == true){
        countDown();
    }    
}