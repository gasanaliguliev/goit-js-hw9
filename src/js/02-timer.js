import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};


let userSelectedDate = null;
let userDefaultDate = null;
let intervalId = null;


refs.startBtn.setAttribute('disabled', true);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() <= options.defaultDate.getTime()) {
      Notiflix.Notify.failure('Please choose a date in the future');
      refs.startBtn.disabled = true;
      return;
    } else {
      refs.startBtn.disabled = false;
      const setTimer = () => {
        userSelectedDate = selectedDates[0].getTime();
        timer.start();
      }
      refs.startBtn.addEventListener('click', setTimer);      
    }
  }
};
flatpickr('#datetime-picker', options);

const timer = {
  start() {
    intervalId = setInterval(() => {
      userDefaultDate = Date.now();
      const deltaTime = userSelectedDate - userDefaultDate;

      if (deltaTime <= 0) {
        this.stop();
        Notiflix.Report.success('The timer has expired', 'Choose a new date and time', 'OK');
        return;
      }

      refs.startBtn.disabled = true;
      const { days, hours, minutes, seconds } = convertMs(deltaTime);
      refs.days.textContent = days;
      refs.hours.textContent = hours;
      refs.minutes.textContent = minutes;
      refs.seconds.textContent = seconds;
    }, 1000);
  },

  stop() {
    clearInterval(intervalId);
    refs.startBtn.disabled = true;    
    intervalId = null;
  },    
};

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
};

function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = addLeadingZero(Math.floor(ms / day));
    // Remaining hours
    const hours = addLeadingZero(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    // Remaining seconds
    const seconds = addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
};


