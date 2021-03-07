document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('time').innerHTML = "00:00";
    let timeLimit = 0;
    let timerID;
    let startPushNum = 0;
    let flag = false;
    let bgm = new Audio();
    let sound = new Audio();

    // getUserMedia が使えないブラウザのとき
    if (typeof navigator.mediaDevices.getUserMedia !== 'function') {
        const err = new Error('getUserMedia()が使えないブラウザです');
        alert(`${err.name} ${err.message}`);
        throw err;
    }

    // 操作する画面エレメント変数定義
    const start_btn = document.getElementById('start_btn');   // スタートボタン
    const capture_btn = document.getElementById('capture_btn')  //キャプチャーボタン
    const video_area = document.getElementById('video_area');  // 映像表示エリア

    // 「スタートボタン」を押下で、getUserMedia を使って映像を「映像表示エリア」に表示するよ。
    start_btn.addEventListener('click', () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            video_area.srcObject = stream
        })
        .catch(err => {
            alert(`${err.name} ${err.message}`)
        });
    }, false);

    // 「静止画取得」ボタンが押されたら「<canvas id="capture_image">」に映像のコマ画像を表示します。
    capture_btn.addEventListener('click', () => {
        const canvas = document.getElementById('capture_image');
        const cci = canvas.getContext('2d');
        canvas.width  = video_area.videoWidth;
        canvas.height = video_area.videoHeight;
        cci.drawImage(video_area, 0, 0);  // canvasに『「静止画取得」ボタン』押下時点の画像を描画。
        canvas.toBlob(function(blob) {
            const img = document.getElementById('jpeg_image');
            img.src = window.URL.createObjectURL(blob);
        }, 'image/png')  // 'image/jpeg'とで精度と速度の変化を要検証
    }, false);


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
}, false)