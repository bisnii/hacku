/*
    タスク
    ・タイマーを止める機能
    ・アラーム音を設定に含める
*/

document.getElementById('time').innerHTML = "00:00";
let timeLimit = 0;
let timerID;
let flag = false;
// let alarmTimes = document.getElementById("alarmTime").value;
// アラーム音
let alarm = new Audio("../alarm/Clock-Alarm01-1(Loop).mp3");
let telephone = new Audio("../alarm/Telephone-Ringtone02-1.mp3");
let bell = new Audio("../alarm/VSQSE_0465_bicycle_bell_04.mp3");
// bgm
let rain = new Audio("../bgm/VSQSE_0354_rain_3.mp3");

// console.log(alarmTimes)
document.getElementById("setting").addEventListener("click", function() {
    let $alarmTime = document.getElementById("alarmTime").value;

	if ($alarmTime == '5m') {
        document.getElementById('time').innerHTML = "05:00";
        // timeLimit = 300000;
        timeLimit = 10000;
    }
    else if ($alarmTime == '10m') {
        document.getElementById('time').innerHTML = "10:00";
        timeLimit = 600000;
    }
    else if ($alarmTime == '15m') {
        document.getElementById('time').innerHTML = "15:00";
        timeLimit = 900000;
    }
    else if ($alarmTime == '30m') {
        document.getElementById('time').innerHTML = "30:00";
        timeLimit = 1800000;
    }
    flag = true;
})    

function countDown() {
    timerID = setTimeout(time,1000);
}

document.getElementById("timerStart").addEventListener("click", function() {
    countDown();
})  


document.getElementById("timerStop").addEventListener("click", function() {
    clearTimeout(timerID);
    rain.pause();
    alarm.pause();
    telephone.pause();
    bell.pause();
})  

function time() {
    let minute = ("00" + Math.floor((timeLimit / 1000) / 60)).slice(-2);
    let second = ("00" + (timeLimit / 1000) % 60).slice(-2);
    rain.loop = true;
    rain.play();
    document.getElementById("time").innerHTML = minute + ":" + second;
    timeLimit = timeLimit - 1000;
    console.log(timeLimit)  
    if (timeLimit < 0) {
        rain.pause();
        let $alarmChoise = document.getElementById("alarmMusic").value;
        console.log($alarmChoise);
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