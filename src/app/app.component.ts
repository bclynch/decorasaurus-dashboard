import { Component } from '@angular/core';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'decorasaurus-dashboard';

  constructor(
    private settingsService: SettingsService
  ) {
    this.settingsService.appInit();
  }
}
