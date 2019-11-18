import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer'
})
export class TimerPipe implements PipeTransform {

  transform(value: string): string {
    const minutes: number = Math.floor(parseInt(value) / 60);
    return minutes.toString().padStart(2, '0') + ':' + (parseInt(value) - minutes * 60).toString().padStart(2, '0');
  }

}
