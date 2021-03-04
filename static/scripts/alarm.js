document.getElementById('time').innerHTML = "00:00";
let timeLimit = 0;
let timerID;
// let alarmTimes = document.getElementById("alarmTime").value;
// アラーム音
let alarm = new Audio("../alarm/Clock-Alarm01-1(Loop).mp3");
let telephone = new Audio("../alarm/Telephone-Ringtone02-1.mp3");
let bell = new Audio("../alarm/VSQSE_0465_bicycle_bell_04.mp3");
// bgm
let rain = new Audio("../bgm/VSQSE_0354_rain_3.mp3");
let sea = new Audio("../bgm/VSQSE_0652_sea_wave5.mp3");
let country = new Audio("../bgm/VSQSE_0712_rice_plant_02r.mp3");

// 全ての音を止める
function soundAllStop() {
    rain.pause();
    sea.pause();
    country.pause();
    alarm.pause();
    telephone.pause();
    bell.pause();
}

// 確定ボタンが押されたらアラーム時間表示
document.getElementById("check").addEventListener("click", function() {
    let $alarmTime = document.getElementById("alarmTime").value;

    if ($alarmTime == '1m') {
        document.getElementById('time').innerHTML = "01:00";
        timeLimit = 60000;
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
    clearTimeout(timerID);
    soundAllStop();
})    

// カウントダウンの関数
function countDown() {
    timerID = setTimeout(time,1000);
}

// スタートボタンが押されたらカウントダウンスタート
document.getElementById("timerStart").addEventListener("click", function() {
    countDown();
})  

// ストップボタンが押されたらタイマーとサウンドをストップ
document.getElementById("timerStop").addEventListener("click", function() {
    clearTimeout(timerID);
    soundAllStop();
})  

// 時間表示、bgm、アラームを鳴らす関数
function time() {
    let minute = ("00" + Math.floor((timeLimit / 1000) / 60)).slice(-2);
    let second = ("00" + (timeLimit / 1000) % 60).slice(-2);

    document.getElementById("time").innerHTML = minute + ":" + second;
    timeLimit = timeLimit - 1000;

    let $bgmChoice = document.getElementById("bgm").value;
    if ($bgmChoice == "rain"){
        rain.loop = true;
        rain.play();
        sea.pause();
        country.pause();
    }
    else if ($bgmChoice == "sea") {
        sea.loop = true;
        sea.play();
        rain.pause();
        country.pause();
    }
    else if ($bgmChoice == "country") {
        country.loop = true;
        country.play();
        rain.pause();
        sea.pause();
    }

    if (timeLimit < 0) {
        rain.pause();
        sea.pause();
        country.pause();
        let $alarmChoise = document.getElementById("alarmMusic").value;

        document.getElementById("time").innerHTML = "Wake Up!";
        if ($alarmChoise == "alarm"){
            alarm.loop = true;
            alarm.play();
            telephone.pause();
            bell.pause();
        }
        else if ($alarmChoise == "telephone") {
            telephone.loop = true;
            telephone.play();
            alarm.pause();
            bell.pause();
        }
        else if ($alarmChoise == "bell") {
            bell.loop = true;
            bell.play();
            alarm.pause();
            telephone.pause();
        }
    }
    countDown();
}