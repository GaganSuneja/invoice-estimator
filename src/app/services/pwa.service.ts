import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { take, timer } from 'rxjs';
import { PromptComponent } from '../prompt-component/prompt-component.component';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private promptEvent: any;

  constructor(
    private bottomSheet: MatBottomSheet,
    private platform: Platform
  ) { }

  public initPwaPrompt() {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.promptEvent = event;
        this.openPromptComponent('android');
      });
    if (this.platform.IOS) {
      const isInStandaloneMode =   ('standalone' in (window as any).navigator) && ((window as any).navigator.standalone);
      if (!isInStandaloneMode) {
        this.openPromptComponent('ios');
      }
    }

  }

  private openPromptComponent(mobileType: 'ios' | 'android' | 'web') {
    timer(3000)
      .pipe(take(1))
      .subscribe(() => this.bottomSheet.open(PromptComponent, { data: { mobileType, promptEvent: this.promptEvent } }));
  }
}