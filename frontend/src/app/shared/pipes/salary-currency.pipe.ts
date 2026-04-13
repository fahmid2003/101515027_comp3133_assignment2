import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salaryCurrency'
})
export class SalaryCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined, currency: string = 'CAD'): string {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(value);
  }
}
