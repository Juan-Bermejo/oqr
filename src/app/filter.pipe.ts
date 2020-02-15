import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: Array<any>, key?: any): Array<any> {
    console.log(key)
    if( key)
    {
      return items.filter(item => item.category.toLowerCase().includes(key) );
    }
    else
    {
      return items;
    }
   
  }

}
