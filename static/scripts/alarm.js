document.addEventListener('DOMContentLoaded', function() {
    let timer = document.getElementById('timer')
    timer.innerHTML = "00:00";
    let dialog = document.querySelector('dialog');
    let workStatusButton = document.getElementById('work_status_button');
    let timeLimit = 0;
    let timerID;
    let sec = 0;
    let startFlag = false;
    let alarmFlag = false;
    let noticeFlag = false;
    let bgm = new Audio();
    let sound = new Audio();
    let status_queue = ['active', 'active']
    resetAlarm();
    setAlarm();
    setBGM();


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
            if (workStatusButton.textContent === '作業中') {
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
                        status_queue.shift();
                        status_queue.push(res['status']);
                        if (!alarmFlag) {
                            if (status_queue.toString() === 'active,active') {
                                stop();
                            } else if (status_queue.toString() === 'sleep,sleep') {
                                start();
                            }
                        }
                    },
                    error: function(errorThrown) {
                        console.log('Error', errorThrown);
                    }
                })
            }
        }, 3000)  // 本番時10000にする
    })
    .catch(err => {
        alert(`${err.name} ${err.message}`)
    });


    document.getElementById('alarmTime').addEventListener('change', function() {
        resetAlarm();
    }, false);

    document.getElementById('alarmMusic').addEventListener('change', function() {
        setAlarm();
    })

    document.getElementById('bgm').addEventListener('change', function() {
        setBGM();
    }, false);

    // 作業状態ボタンが押されたらアラーム時間表示
    workStatusButton.addEventListener("click", function() {
        if (workStatusButton.textContent === '作業中') {
            workStatusButton.textContent = '退席中';
            noticeFlag = false; 

            stop();
        } else {
            workStatusButton.textContent = '作業中';
            noticeFlag = true;
        }
    }, false);

    dialog.addEventListener('close', function() {
        alarmFlag = false;
        stop();
    }, false);


    function resetAlarm() {
        let $alarmTime = document.getElementById("alarmTime").value;

        if ($alarmTime == '1m') {
            timer.innerHTML = "01:00";
            timeLimit = 10000;  // 本番時100000にする
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

    function setAlarm() {
        let $alarmChoice = document.getElementById("alarmMusic").value;
        sound.pause();
        sound = new Audio("/static/alarm/sound-" + $alarmChoice + ".mp3");
        sound.loop = true;
    }

    function setBGM() {
        let $bgmChoice = document.getElementById("bgm").value;
        bgm.pause();
        if ($bgmChoice === 'none') {
            bgm = new Audio();
        } else {
            bgm = new Audio("/static/bgm/bgm-" + $bgmChoice + ".mp3");
        }
        bgm.loop = true;
    }
    
    function start() {
        bgm.play();
        if ((! startFlag) && (timeLimit > 0)){
            startFlag = true;
            timerID = setInterval(time, 1000)
        } 
        noticeFlag = false;  
        sec = 0; 
        console.log('start')
    }
    
    function stop() {
        console.log('stop');
        clearInterval(timerID);
        bgm.pause();
        sound.pause();
        startFlag = false;
        noticeFlag = true;
        resetAlarm();
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
            bgm.pause();
            sound.play();
            timer.innerHTML = "Wake Up!";
            dialog.showModal();
            init();
            typingGame();
            noticeFlag = true;
            sec = 0;
            console.log('time');
        }
    }

    function pushNotificaton(){
        sec++;
        console.log(sec);
        if (workStatusButton.textContent === '退席中'){
            noticeFlag = false;
            sec = 0;
        }
        if(sec >= 60 && noticeFlag==true){  
            sec = 0;
            console.log('push')
            flag = false;
            Push.create('お疲れ様です！', {
                body: '作業開始から2時間です。そろそろ休憩しましょう！',
                timeout: 5000,
                onClick: function () {
                    this.close();
                }
            });
        }    
    }
    setInterval(pushNotificaton, 1000);
}, false);
