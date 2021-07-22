var gTimer = "00:00";
var sec=0;
var min=0;
var hr=0;
var stoptime = false;

document.querySelector('.timer').innerHTML = gTimer
//This function Stopping watch from running
function stopTimer() {
    if (stoptime == false) {
        stoptime = true;
    }
}
//This function create the clock from seconds/minutes/houres
function timerCycle() {
    if (stoptime == false) {
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

        gTimer =   min + ':' + sec;
        //repeat the function every 1000ms
        document.querySelector('.timer').innerHTML = gTimer;
        setTimeout(timerCycle, 1000);


    }
}
//This function reseting timer 
function resetTimer() {
    gTimer.innerHTML = "00:00";
    stoptime = true;
    hr = 0;
    sec = 0;
    min = 0;
}