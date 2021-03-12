document.addEventListener('DOMContentLoaded', function() {
    let timer = document.getElementById('timer')
    timer.innerHTML = "00:00";
    let workStatusButton = document.getElementById('work_status_button');
    let setting = document.getElementById('setting');
    let btn_show = document.getElementById('show');
    let btn_close = document.getElementById('close');
    let radio_break = document.getElementById("break_setting");
    let radioBreakList = radio_break.q1;
    let break_value = radioBreakList.value;
    let radio_typing = document.getElementById("typing_setting");
    let radioTypingList = radio_typing.q2;
    let typing_value = radioTypingList.value;
    const slider_volume = document.getElementById("volume");
    const bgmtext = document.getElementById("btn_play");
    let timeLimit = 0;
    let timerID;
    let sec = 0;
    let startFlag = false;
    let alarmFlag = false;
    let $bgmChoice;
    let noticeFlag = false;
    let settingFlag = false;
    let bgm = new Audio();
    let sound = new Audio();
    let bgm_setting = new Audio("/static/bgm/bgm-sea.mp3");
    bgm.volume = slider_volume.value;
    let status_queue = ['active', 'active']
    let subWindow;  // サブウインドウのオブジェクト
    const WIDTH = 800;
    const HEIGHT = 500;
    resetAlarm();
    setAlarm();
    setBGM();
    // 0:1と2以外、1:アラームが鳴っている、2:タイピングによりサブウインドウが閉じられたとき
    document.cookie = 'typing=0';


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
            if (workStatusButton.textContent === '作業中' && settingFlag == false) {
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
        if (!alarmFlag) {
            if (workStatusButton.textContent === '作業中') {
                workStatusButton.textContent = '退席中';
                clearInterval(timerID);
                bgm.pause();
                startFlag = false;
                noticeFlag = false; 
                resetAlarm();
            } else {
                workStatusButton.textContent = '作業中';
                noticeFlag = true;
            }
        }
    }, false);

    // 1秒ごとにクッキーでアラームとタイピングゲームの状態を判断
    let typing = setInterval(function() {
        if (document.cookie === 'typing=1') {
            if (subWindow.closed) {
                if (typing_value === 'する') {
                    subWindow = window.open('/typing', null, getPosition());
                } else {
                    alarmFlag = false;
                    stop();
                }
            }
        } else if (document.cookie === 'typing=2') {
            alarmFlag = false;
            stop();
        }
    }, 1000);

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
        $bgmChoice = document.getElementById("bgm").value;
        bgm.pause();
        if ($bgmChoice === 'none') {
            bgm = new Audio();
        } else {
            bgm = new Audio("/static/bgm/bgm-" + $bgmChoice + ".mp3");
        }
        bgm.loop = true;
    }
    
    function start() {
        if ($bgmChoice != 'none') {
            bgm.play();
        }
        if ((! startFlag) && (timeLimit > 0)){
            startFlag = true;
            timerID = setInterval(time, 1000)
        } 
        noticeFlag = false;  
        sec = 0; 
    }
    
    function stop() {
        clearInterval(timerID);
        bgm.pause();
        sound.pause();
        document.cookie = 'typing=0';
        startFlag = false;
        noticeFlag = true;
        resetAlarm();
    }

    function stopTyping() {
        clearInterval(timerID);
        bgm.pause();
        noticeFlag = true;
        startFlag = false;
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
            document.cookie = 'typing=1'
            if (typing_value === "する") {
                subWindow = window.open('/typing', null, getPosition());
            } else {
                subWindow = window.open('/alarm_stop', null, getPosition());
            }
            noticeFlag = true;
            sec = 0;
        }
    }

    function getPosition(width=WIDTH, height=HEIGHT) {
        const x = window.screenX + (window.outerWidth / 2) - (width / 2);
        const y = window.screenY + (window.outerHeight / 2) - (height / 2);
        return 'left='+x+',top='+y+',width='+width+',height='+height;
    }

    // プッシュ通知
    function pushNotificaton(){
        sec++;
        if (workStatusButton.textContent === '退席中' || break_value === "しない"){
            noticeFlag = false;
            sec = 0;
        }
        if(sec >= 60 && noticeFlag==true && break_value === "する"){  
            sec = 0;
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

    // 詳細設定
    btn_show.addEventListener('click', function() {
        if (!alarmFlag) {
            setting.showModal();
            clearInterval(timerID);
            resetAlarm();
            bgm.pause();
            settingFlag = true;
        }
    }, false);

    btn_close.addEventListener('click', function() {
        bgm_setting.pause();
        bgmtext.textContent = "再生";
        break_value = radioBreakList.value;
        typing_value = radioTypingList.value;
        settingFlag = false;
        setting.close();
        startFlag = false;
    }, false);
    
    btn_play.addEventListener("click", e => {
        if (bgmtext.textContent === "再生"){
            bgm_setting.play();
            bgmtext.textContent = "一時停止";
        }
        else {
            bgm_setting.pause();
            bgmtext.textContent = "再生";
        }
    })
    
    slider_volume.addEventListener("input", e => {
        bgm_setting.volume = slider_volume.value;
        bgm.volume = slider_volume.value;
    });

}, false);
