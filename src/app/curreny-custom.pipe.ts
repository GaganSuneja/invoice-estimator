import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyPipe'
})
export class CurrenyCustomPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown | string {
    return `₹ ${new Intl.NumberFormat('en-IN').format(Number(value.toFixed(2)))}`;
  }

}
