import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'removePipe'
})
export class RemovePipePipe implements PipeTransform {

  transform(value: any): any {
    if (value !== undefined && value !== null) {
        return _.uniqBy(value, 'oferta._id');
    }
    return value;
}
}
