function clock(){
    let now_time = new Date();
    let now_hour = now_time.getHours();
    let now_minute = now_time.getMinutes();
    let now_second = now_time.getSeconds();
    
    if (now_hour < 10){
        now_hour = '0'+now_hour
    }
    if (now_minute < 10){
        now_minute = '0'+now_minute
    }
    if (now_second < 10){
        now_second = '0'+now_second
    }
    const times =  now_hour+':'+now_minute+':'+now_second;
    document.getElementById('clock').innerHTML = times;
}
setInterval(clock,1000);
