import { observable, computed, action } from 'mobx';
import * as moment from 'moment';
import { TransactionTimer } from '../operationsdashboard/operationsdashboard.component';

export class TimerStore{
    @observable isRunning;
    @observable timer: TransactionTimer;
    @observable startTime;
    @observable laps;
  
    constructor() {
      this.isRunning = false;
      this.laps = [];
      this.timer = new TransactionTimer();
    }
  
    @computed get mainDisplay() {
      return this.timer.timeInSeconds;
    }
  
    @computed get hasStarted() {
      return this.timer.timeInSeconds !== 0;
    }
  
    @action measure() {
      if (!this.isRunning) return;
  
      this.timer.timeInSeconds = moment().diff(this.startTime);
  
      setTimeout(() => this.measure(), 1000);
    }
  
    @action startTimer() {
    //   if (this.isRunning) return;
    //   this.isRunning = true;
    //   this.startTime = moment();
    //   this.measure();
    let interval;
    interval = setInterval(() => {
      this.timer.timeInSeconds++;// = this.timers[0].timeInSeconds++;
    },1000)
    }

    @action setTime(time: number){
        this.timer.timeInSeconds = time;
    }
  
    @computed get length() {
      return this.laps.length;
    }
  
    @computed get lapTime() {
      return this.laps.map((el) => el.totalMilliSeconds)
        .reduce((x, y) => x + y, 0);
    }
  
    @action lapTimer() {
      this.laps.push(new TransactionTimer());
    }
  
    @computed get lapData() {
      const data = [];
      for (let i = 0; i < this.laps.length; i++) {
        data.push({
          lap: this.laps[i],
          text: `Lap ${i + 1}`,
        });
      }
      return data.reverse();
    }
  
    @action stopTimer() {
      //this.timer.saveTime();
      this.isRunning = false;
    }
  
    @action resetTimer() {
      //this.timer.reset();
      this.laps = [];
      this.isRunning = false;
    }
  
}