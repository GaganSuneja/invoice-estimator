import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { Iitem } from './i-item';
import { ItemPopupComponent } from './item-popup/item-popup.component';
import { ItemService } from './item-service.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { dd } from './pdf-download-setting';
import { CurrenyCustomPipe } from './curreny-custom.pipe';
import { estimateTemplate } from './pdfMake-template';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'invoice-estimator';
  items: (Iitem & { position: number })[] = [];
  totalValue: number = 0;
  subTotal: number = 0;
  subTotalTax: number = 0;
  totalTaxValue: number = 0;

  displayedColumns: string[] = ['position', 'item', 'itemWeight', 'ratePerKg', 'noOfUnit', 'taxValue', 'itemValue'];
  partyForm: FormGroup = this._fb.group({
    'partyName': [undefined, [Validators.required, forbiddenNameValidator(4)]],
    'estimateNo': [undefined, Validators.required],
    'cartage': [0],
    'estimateDate': [undefined]
  });

  currencyPipe: CurrenyCustomPipe = new CurrenyCustomPipe();
  cartage: FormControl = new FormControl();
  cartageAdded: boolean = false;

  constructor(private _fb: FormBuilder, private _dialogInjector: MatDialog, public itemService: ItemService) {
  }

  ngOnInit() {
    this.itemService.itemList.pipe(
      map(
        (itemList: Iitem[]): (Iitem & { position: number })[] => {
          let itemModifiedList: (Iitem & { position: number })[] = itemList.map((itemEntry, index) => { return { position: index + 1, ...itemEntry } })
          return itemModifiedList;
        }))
      .subscribe((items) => this.items = items);
  }

  // opens mat dialog box
  public addItem() {
    const dialogRef = this._dialogInjector.open(ItemPopupComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.subTotalTax += this.items[this.items.length - 1]?.taxValue || 0;
      this.subTotal += this.items[this.items.length - 1]?.totalItemValue || 0;
    });
  }

  public addCartage() {
    let cartage = Number(this.cartage.value);
    this.totalValue = this.subTotal + cartage;
    this.totalTaxValue = this.subTotalTax + (cartage * 12 / 100);
    this.cartageAdded = true;
  }

  public removeCartage() {
    let cartage = Number(this.cartage.value);
    this.totalValue = this.subTotal - cartage;
    this.totalTaxValue = this.subTotalTax - (cartage * 12 / 100);
    this.cartageAdded = false;
  }

  downloadPdf() {
    let template = JSON.parse(JSON.stringify(estimateTemplate));
    template.content[0]['columns'][1][1].stack[0].columns[1].text = this.partyForm.controls['estimateNo'].value;
    template.content[0]['columns'][1][1].stack[1].columns[1].text = this.partyForm.controls['estimateDate'].value;
    template.content[2]['columns'][1].text = this.partyForm.controls['partyName'].value;
    const productTemplate = [{
      text: 'Item 1',
      border: [false, false, false, true],
      margin: [0, 5, 0, 5],
      alignment: 'left',
    },
    {
      border: [false, false, false, true],
      text: '$999.99',
      fillColor: '#f5f5f5',
      margin: [0, 5, 0, 5],
    },
    {
      border: [false, false, false, true],
      text: '$999.99',
      alignment: 'right',
      margin: [0, 5, 0, 5],
    }]

    for (let item of this.items) {
      let newTemplate = JSON.parse(JSON.stringify(productTemplate));
      newTemplate[0].text = `${item.description}, ${item.length} x ${item.breadth}, ${item.gsm} GSM, 
      ${item.noOfUnit} ${item.packagingUnit} X ${item.itemWeight} Kg @ Rs ${item.ratePerKg}/kg`;
      newTemplate[1].text = this.currencyPipe.transform(item.taxValue) as string;
      newTemplate[2].text = this.currencyPipe.transform(item.totalItemValue) as string;
      template.content[5]['table']['body'].push(newTemplate);
    }
    const subTotal = [
      {
        text: 'Subtotal',
        border: [false, true, false, true],
        alignment: 'right',
        margin: [0, 5, 0, 5],
      },
      {
        border: [false, true, false, true],
        text: this.currencyPipe.transform(this.subTotal),
        alignment: 'right',
        fillColor: '#f5f5f5',
        margin: [0, 5, 0, 5],
      },
    ];
    const cartage = [
      {
        text: 'Cartage',
        border: [false, true, false, true],
        alignment: 'right',
        margin: [0, 5, 0, 5],
      },
      {
        border: [false, true, false, true],
        text: this.currencyPipe.transform(Number(this.cartage.value)),
        alignment: 'right',
        fillColor: '#f5f5f5',
        margin: [0, 5, 0, 5],
      }
    ];
    const totalTax = [
      {
        text: 'Total Tax',
        border: [false, false, false, true],
        alignment: 'right',
        margin: [0, 5, 0, 5],
      },
      {
        text: this.currencyPipe.transform(this.totalTaxValue || this.subTotalTax),
        border: [false, false, false, true],
        fillColor: '#f5f5f5',
        alignment: 'right',
        margin: [0, 5, 0, 5],
      },
    ]

    const totalAmount = [
      {
        text: 'Total Amount',
        bold: true,
        fontSize: 20,
        alignment: 'right',
        border: [false, false, false, true],
        margin: [0, 5, 0, 5],
      },
      {
        text: this.currencyPipe.transform(this.totalValue || this.subTotal),
        bold: true,
        fontSize: 20,
        alignment: 'right',
        border: [false, false, false, true],
        fillColor: '#f5f5f5',
        margin: [0, 5, 0, 5],
      },
    ];
    template.content[8]['table']['body'].push(subTotal);
    template.content[8]['table']['body'].push(cartage);
    template.content[8]['table']['body'].push(totalTax);
    template.content[8]['table']['body'].push(totalAmount);

    pdfMake.createPdf(template as any).print();
  }
}


export function forbiddenNameValidator(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = String(control.value).trim().length < length;
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}