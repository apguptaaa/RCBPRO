import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatPrice', standalone: true, pure: true })
export class FormatPricePipe implements PipeTransform {
  transform(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
