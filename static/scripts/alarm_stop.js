document.addEventListener('DOMContentLoaded', function() {
    if (!window.opener || window.opener.closed) {
        window.alert('親ウインドウがありません。');
        return false;
    }
    
    document.getElementById('alarm_stop_button').addEventListener('click', function() {
        document.cookie = 'typing=2'
        window.close();
    }, false);
}, false);