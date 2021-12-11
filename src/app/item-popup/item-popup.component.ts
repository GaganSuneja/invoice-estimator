import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscriber, Subscription } from 'rxjs';
import { CurrenyCustomPipe } from '../curreny-custom.pipe';
import { Iitem } from '../i-item';
import { ItemService } from '../item-service.service';

@Component({
  selector: 'app-item-popup',
  templateUrl: './item-popup.component.html',
  providers:[CurrenyCustomPipe]
})
export class ItemPopupComponent implements OnInit, OnDestroy {

  itemForm = this._fb.group({
    item: ['sbs', Validators.required],
    length: [undefined, Validators.required],
    breadth: [undefined, Validators.required],
    sizeUnit: ['in'],
    description: [''],
    gsm: [undefined, Validators.required],
    noOfUnit: [1, Validators.required],
    noOfSheet: [100, Validators.required],
    ratePerKg: [undefined, Validators.required],
    gstSlab: [{ value: 12, disabled: true }, Validators.required]
  });

  noOfSheetsList = [100, 144,250, 500];
  noOfSheet = 100;
  items: any[] = [
    {
      name: 'art-paper',
      displayName: 'Art Paper',
      packingUnit: 'ream',
      gstSlab: 12,
      hsn: 48109900
    }, {
      name: 'art-card',
      displayName: 'Art Card',
      packingUnit: 'pkt',
      gstSlab: 12,
      hsn: 48109299
    },
    {
      name: 'sbs',
      displayName: 'SBS/FBB',
      packingUnit: 'pkt',
      gstSlab: 12,
      hsn: 48109900
    },
    {
      name: 'duplex',
      displayName: 'Duplex',
      packingUnit: 'gross',
      gstSlab: 12,
      hsn: 48109900
    },
    {
      name: 'maplitho',
      displayName: 'Maplitho',
      packingUnit: 'ream',
      gstSlab: 12,
      hsn: 48025790
    }
  ];

  packingUnitMap = {
    'pkt': 100,
    'ream': 500
  }

  sizeUnits = [
    { unit: 'in', displayName: 'In' },
    { unit: 'cm', displayName: 'CM' }
  ]

  itemValue = 0;
  taxValue = 0;
  totalItemValue = 0;
  gstSlab = 12;
  unitSelected = 'Pkt';
  itemWeight = 0;
  valueMultiplier: any = { 'sbs': 1, 'art-paper': 5, 'art-card': 1, 'maplitho': 5, 'duplex':2.5 };
  currentItemList: Iitem[] = [];
  itemListSubscription: Subscription = new Subscription();

  constructor(private _fb: FormBuilder, private _itemService: ItemService) {
  }

  ngOnInit(): void {
    this.itemForm.valueChanges.subscribe(() => {
      const itemSelected: string = this.itemForm.controls['item'].value || '';
      this.unitSelected = itemSelected === 'art-paper' || itemSelected === 'maplitho' ? 'Ream' :
        itemSelected === 'duplex' ? 'Gross' :
          'Pkt';
      if (this.unitSelected === 'Ream') {
        this.itemForm.controls['noOfSheet'].patchValue(500, {emitEvent: false});
      } else if(this.unitSelected === 'Gross') {
        this.itemForm.controls['noOfSheet'].patchValue(144, {emitEvent: false});
      } else if(this.unitSelected === 'Pkt') {
        this.itemForm.controls['noOfSheet'].patchValue(100, {emitEvent: false});
      }
      this.noOfSheet = this.itemForm.controls['noOfSheet'].value;
      if (!this.itemForm.invalid) {
        this.itemWeight = Number(
          (
            (parseFloat(this.itemForm.controls['length'].value)
              * parseFloat(this.itemForm.controls['breadth'].value)
              * parseFloat(this.itemForm.controls['gsm'].value) * (this.itemForm.controls['noOfSheet'].value / 100) / 15500)
          ).toFixed(1));

        this.itemValue = Number((this.itemWeight
          * Number(this.itemForm.controls['noOfUnit'].value)
          * Number(this.itemForm.controls['ratePerKg'].value))
          .toFixed(2));

        this.taxValue = Number(((this.itemValue * this.gstSlab) / 100).toFixed(2));
        this.totalItemValue = Number((this.itemValue + this.taxValue).toFixed(2));
      }
    })
    this.currentItemList = this._itemService.itemList.getValue();
  }

  addItem() {
    this._itemService.itemList.next([...this.currentItemList, this.createNewItem()]);
  }

  createNewItem(): Iitem {
    let { description, item, length, breadth, gsm, noOfUnit, ratePerKg } = this.itemForm.value;
    return {
      item: this.items.find((itemType) => itemType.name === item)['displayName'],
      description,
      length,
      breadth,
      gsm, noOfUnit,
      ratePerKg,
      packagingUnit: this.unitSelected,
      itemWeight: this.itemWeight,
      itemValue: this.itemValue,
      taxValue: this.taxValue,
      totalItemValue: this.totalItemValue,
      unitSelected: this.unitSelected,
    }
  }
  
  ngOnDestroy() {
    this.itemListSubscription.unsubscribe();
  }

}
