/*
    タスク
    ・タイマーを止める機能
    ・アラーム音を設定に含める
*/

document.getElementById('time').innerHTML = "00:00";
let timeLimit = 0;
// let alarmTimes = document.getElementById("alarmTime").value;
// アラーム音
let alarm = new Audio("alarm/Clock-Alarm01-1(Loop).mp3");
let telephone = new Audio("alarm/Telephone-Ringtone02-1.mp3");
let bell = new Audio("alarm/VSQSE_0465_bicycle_bell_04.mp3");
// bgm
let rain = new Audio("bgm/VSQSE_0354_rain_3.mp3");

// console.log(alarmTimes)

document.getElementById("setting").addEventListener("click", function() {
    let $alarmTime = document.getElementById("alarmTime").value;

	if ($alarmTime == '5m') {
        document.getElementById('time').innerHTML = "05:00";
        // timeLimit = 300000;
        timeLimit = 10000;
    }
    if ($alarmTime == '10m') {
        document.getElementById('time').innerHTML = "10:00";
        timeLimit = 600000;
    }
    if ($alarmTime == '15m') {
        document.getElementById('time').innerHTML = "15:00";
        timeLimit = 900000;
    }
    if ($alarmTime == '30m') {
        document.getElementById('time').innerHTML = "30:00";
        timeLimit = 1800000;
    }
})    

document.onkeydown = function(e) {
    let keyCode = false;
    
    if (e) event1 = e;

    // 対象者が寝たら時計を動かす
    if (event1) {
        if (event1.keyCode) {
            console.log(event1.keyCode)
            keyCode = event1.keyCode;
            if (String.fromCodePoint(keyCode).toLowerCase()=='a'){
                time();
            }    
        } else if (event1.which) {
            keyCode = event1.which;
        }
    }
    setInterval('time()', 1000);
}   

function time() {
    let minute = ("00" + Math.floor((timeLimit / 1000) / 60)).slice(-2);
    let second = ("00" + (timeLimit / 1000) % 60).slice(-2);
    rain.play();
    document.getElementById("time").innerHTML = minute + ":" + second;
    timeLimit = timeLimit - 1000;
    console.log(timeLimit)
    document.getElementById("setting").addEventListener("click", function() {
        console.log('click');
        clearTimeout(time);
    })    
    if (timeLimit < 0) {
        rain.pause();
        let $alarmChoise = document.getElementById("alarmMusic").value;
        console.log($alarmChoise);
        document.getElementById("time").innerHTML = "Wake Up!";
        if ($alarmChoise == "alarm"){
            alarm.play();
            telephone.pause();
            bell.pause();
        }
        else if ($alarmChoise == "telephone") {
            telephone.play();
            alarm.pause();
            bell.pause();
        }
        else if ($alarmChoise == "bell") {
            bell.play();
            alarm.pause();
            telephone.pause();
        }
    }
}