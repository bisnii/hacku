document.addEventListener('DOMContentLoaded', function() {
    let timer = document.getElementById('timer')
    timer.innerHTML = "00:00";
    let dialog = document.querySelector('dialog');
    let btn_show = document.getElementById('show');
    let timeLimit = 0;
    let timerID;
    let startFlag = false;
    let alarmFlag = false;
    let bgm = new Audio();
    let sound = new Audio();

    // getUserMedia が使えないブラウザのとき
    if (typeof navigator.mediaDevices.getUserMedia !== 'function') {
        const err = new Error('getUserMedia()が使えないブラウザです');
        alert(`${err.name} ${err.message}`);
        throw err;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        const videoArea = document.getElementById('video_area');  // 映像表示エリア
        videoArea.srcObject = stream
        setInterval(function() {
            const canvas = document.getElementById('capture_image');  // キャンバス
            const cct = canvas.getContext('2d');  // キャンバスの画像表示エリア
            canvas.width  = videoArea.videoWidth;
            canvas.height = videoArea.videoHeight;
            cct.drawImage(videoArea, 0, 0);  // 動画をキャンバスに描画

            const base64 = canvas.toDataURL('image/png')
            const formData = new FormData()
            formData.append('img', base64)
            $.ajax({
                url: '/get_status',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function(res) {
                    status = res['status'];
                    if (!alarmFlag) {
                        if (status === 'active') {
                            stop();
                        } else {
                            start();
                        }
                    }
                },
                error: function(errorThrown) {
                    console.log('Error', errorThrown);
                }
            })
        }, 3000)
    })
    .catch(err => {
        alert(`${err.name} ${err.message}`)
    });


    // 確定ボタンが押されたらアラーム時間表示
    document.getElementById("check").addEventListener("click", function() {
        sound.pause();
        bgm.pause();
        resetTimer();
    }, false);

    dialog.addEventListener('close', function() {
        alarmFlag = false;
        stop()
    }, false);

    function resetTimer() {
        let $alarmTime = document.getElementById("alarmTime").value;

        if ($alarmTime == '1m') {
            timer.innerHTML = "01:00";
            timeLimit = 10000;  // 本番時100000に戻す
        }
        else if ($alarmTime == '5m') {
            timer.innerHTML = "05:00";
            timeLimit = 300000;
        }
        else if ($alarmTime == '10m') {
            timer.innerHTML = "10:00";
            timeLimit = 600000;
        }
        else if ($alarmTime == '30m') {
            timer.innerHTML = "30:00";
            timeLimit = 1800000;
        }
        else if ($alarmTime == '60m') {
            timer.innerHTML = "60:00";
            timeLimit = 3600000;
        }
    }
    
    function start() {
        if ((! startFlag) && (timeLimit > 0)){
            let $bgmChoice = document.getElementById("bgm").value;
            let $alarmChoice = document.getElementById("alarmMusic").value;
            bgm = new Audio("/static/bgm/bgm-" + $bgmChoice + ".mp3");
            sound = new Audio("/static/alarm/sound-" + $alarmChoice + ".mp3");
            bgm.loop = true;
            bgm.play();
            startFlag = true;
            timerID = setInterval(time, 1000)
        }    
    }
    
    function stop() {
        clearInterval(timerID);
        bgm.pause();
        sound.pause();
        startFlag = false;
        resetTimer();
    }

    // 時間表示、bgm、アラームを鳴らす関数
    function time() {
        let minute = ("00" + Math.floor((timeLimit / 1000) / 60)).slice(-2);
        let second = ("00" + (timeLimit / 1000) % 60).slice(-2);
        timer.innerHTML = minute + ":" + second;
        timeLimit = timeLimit - 1000;

        if (timeLimit < 0) {
            clearInterval(timerID)
            alarmFlag = true;
            startFlag = false;
            sound.loop = true;
            bgm.pause();
            sound.play();
            timer.innerHTML = "Wake Up!";
            dialog.showModal();
            init();
            typingGame();
        }
    }
}, false);