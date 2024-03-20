import React, { useState, useRef } from "react";
import CounterBox from "./box/CounterBox";
import { toast } from "react-hot-toast";
import useSound from "use-sound";
import { RotateCcw, Pause, Play } from "lucide-react";
import start from "../../assets/sounds/over.mp3";
import over from "../../assets/sounds/start.mp3";
import Button from "../utils/Button";

function Counter() {
  const [timerOverSound] = useSound(over);
  const [timerStartSound] = useSound(start);

  // timerId will store the setInterval id.
  const [timerId, setTimerId] = useState("");
  const [inputDate, setInputDate] = useState("");

  const secondsRef = useRef(null);
  const minutesRef = useRef(null);
  const hourRef = useRef(null);
  const dayRef = useRef(null);

  let stop = false;

  const allRef = [dayRef, hourRef, minutesRef, secondsRef];
  const counterType = ["Days", "Hours", "Minutes", "Seconds"];

  // array for converting days, hour, minutes and seconds into milliseconds
  //             1 day   1 hour   1 minute, 1 Sec into milliseconds.
  const timer = [86400000, 3600000, 60000, 1000];

  // this function will trigger with start button and perform validation. If validation got success it start the countdown with user input date and time.
  const handelClick = () => {
    if (inputDate === "") {
      toast.error("please select the timer value");
      return null;
    } else if (timerStartedCheck()) {
      toast.error("timer already started");
      return;
    }
    const userInputDate = new Date(inputDate).getTime();

    // validating the entered date and time.
    const timerLength = isValid(userInputDate);

    if (timerLength > 0) {
      // if all validation get completed we will start the timer with notification.
      setTimerId(startTimer(userInputDate));
    } else {
      return;
    }
  };

  // isValid function validate the date and time given by the user by performing checks
  // days should not be more then 99
  // hours should not be more then 23
  // minutes should not be more then 59
  // seconds should not be more then 59
  // date should not be less then current date and time.

  const isValid = (userInputDate) => {
    //  calculating the max timer length
    //  hours in 1 day * minutes in 1 hour * seconds in 1 minutes * 1000 for milliseconds * 100 (days) - 1000 (1 sec);

    // 24 * 60 * 60 * 1000 * 100 - 1000;
    const validTimerLength = 8639999000;
    const currentDate = new Date().getTime();
    const timerLength = userInputDate - currentDate;

    if (timerLength < 0 || timerLength > validTimerLength) {
      toast.error("invalid date to start countdown");
      setInputDate("");
      return 0;
    }
    return timerLength;
  };

  // startTimer function will ensure about the countdown, by updating the timer on the interval of 1 second.
  const startTimer = (userInputDate) => {
    stop = false;
    toast.success("Timer started!");
    timerStartSound();

    // setting the interval for updating the countdown value.
    const timerId = setInterval(() => {
      const currentDate = new Date().getTime();
      let newTimer = userInputDate - currentDate;

      // if timer got over, we'll clear the interval and pop out the notification with sound.
      if (newTimer <= 0) {
        toast.success("Timer finished");
        timerOverSound();
        clearInterval(timerId);
        return;
      }

      // updating the all reference value, which will showing on the screen.
      let idx = 0;
      for (let i of timer) {
        let val = Math.floor(newTimer / i);
        newTimer = newTimer % i;
        allRef[idx++].current.value = val;
      }
    }, 1000);

    return timerId;
  };

  // restart function will re start the timer.
  const restart = () => {
    if (!timerStartedCheck("please start the countdown")) return;
    setInputDate("");
    clearInterval(timerId);
    secondsRef.current.value =
      minutesRef.current.value =
      hourRef.current.value =
      dayRef.current.value =
        0;
    toast.success("timer restarted");
    return;
  };

  // stopTimer function will stop the timer when you hit stop button on display.
  const stopTimer = () => {
    if (!timerStartedCheck()) {
      toast.error("please start the countdown");
      return;
    } else if (stop) {
      toast.error("countdown already pause");
      return;
    }
    clearInterval(timerId);
    stop = true;
    toast.success("timer stopped!");
  };

  // this function will start the timer form where we pause it.
  const startMyTimer = () => {
    if (!timerStartedCheck()) {
      toast.error("please start the countdown");
      return;
    } else if (!stop) {
      toast.error("timer should be stopped");
      return;
    }
    stop = false;
    clearInterval(timerId);
    let stoppedTime = new Date().getTime() + 1000;

    let idx = 0;
    for (let i of timer) {
      stoppedTime += i * allRef[idx++].current.value;
    }

    setTimerId(startTimer(stoppedTime));
    toast.success("Timer started!");
  };

  const timerStartedCheck = () => {
    if (
      secondsRef.current.value === "0" &&
      minutesRef.current.value === "0" &&
      hourRef.current.value === "0" &&
      dayRef.current.value === "0"
    ) {
      return false;
    }
    return true;
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <h2 className="text-4xl max-md:text-3xl font-semibold text-white">
        Countdown <span className="text-[#964ec5]">Timer</span>
      </h2>
      <div className="w-58 flex items-center justify-center">
        <input
          className="p-1 px-5 cursor-pointer outline-none text-white border-2 bg-transparent rounded-lg"
          onChange={(e) => setInputDate(e.target.value)}
          type="datetime-local"
          value={inputDate}
        />
      </div>
      <div className="flex items-center justify-between w-58 gap-2">
        <Button
          action={handelClick}
          Type={"Start now"}
          customStyle={"border-2 p-1 px-3"}
        />
        <div className="border-[2px] rounded-lg gap-2 flex items-center p-[6px]">
          <Button action={stopTimer} Type={<Pause />} />
          <Button action={startMyTimer} Type={<Play />} />
          <Button action={restart} Type={<RotateCcw />} />
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        {allRef.map((ele, idx) => {
          return (
            <CounterBox key={idx} customRef={ele} title={counterType[idx]} />
          );
        })}
      </div>
    </div>
  );
}

export default Counter;
