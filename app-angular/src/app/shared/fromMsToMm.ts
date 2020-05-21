import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'fromMsToMm',
})
export class FromMsToMm implements PipeTransform {
  transform(value: number): number {
    if (value === 0 || value == null) {
      return 0;
    }
    return value / 1000 / 60;
  }
}
