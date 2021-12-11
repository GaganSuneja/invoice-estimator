import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Iitem } from './i-item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  public itemList: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);

  constructor() { }


}
