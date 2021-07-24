var gTimer = "00:00";
var gTimerInetrval;
var sec = 0;
var min = 0;
var hr = 0;
var stoptime = false;

document.querySelector('.timer').innerHTML = gTimer
//This function Stopping watch from running
function startTimer() {
    if (!gTimerInetrval) {//undefined
        gTimerInetrval = setInterval(timerCycle, 1000);
    }

}
//this function stop timer and reseating
function stopTimer() {
    clearInterval(gTimerInetrval);
    gTimerInetrval = 0;
    resetTimer();
}
//This function create the clock from seconds/minutes/houres
function timerCycle() {
    sec = parseInt(sec);
    min = parseInt(min);
    hr = parseInt(hr);

    sec++;

    if (sec == 60) {
        min = min + 1;
        sec = 0;
    }
    if (min == 60) {
        hr = hr + 1;
        min = 0;
        sec = 0;
    }
    //Creating the the under 10 sec/min   9 --> 09
    if (sec < 10 || sec == 0) {
        sec = '0' + sec;
    }
    if (min < 10 || min == 0) {
        min = '0' + min;
    }
    if (hr < 10 || hr == 0) {
        hr = '0' + hr;
    }
    gTimer = min + ':' + sec;
    //repeat the function every 1000ms
    document.querySelector('.timer').innerHTML = gTimer;
}
//This function reseting timer 
function resetTimer() {
    gTimer = "00:00";
    document.querySelector('.timer').innerHTML = gTimer;
    hr = 0;
    sec = 0;
    min = 0;
}