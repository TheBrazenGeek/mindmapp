import {Component, OnInit, ViewChild} from '@angular/core'
import {ShortcutsService} from './core/services/shortcuts.service'
import {TranslateService} from '@ngx-translate/core'
import {SettingsService} from './core/services/settings.service'
import {NotificationService} from './core/services/notification.service'
import {RouterOutlet} from '@angular/router'
import {routeAnimation} from './shared/animations/route.animation'

@Component({
    selector: 'mindmapp-root',
    templateUrl: 'root.component.html',
    styleUrls: ['./root.component.scss'],
    animations: [routeAnimation]
})
export class RootComponent implements OnInit {

    @ViewChild('outlet', {static: false}) public outlet: RouterOutlet
    public initialized: boolean

    constructor (private notificationService: NotificationService,
                 private translateService: TranslateService,
                 private settingsService: SettingsService,
                 private shortcutsService: ShortcutsService) {
    }

    public async ngOnInit () {
        const {settings, isFirstTime} = await this.settingsService.init()
        const translations = await this.initTranslations(settings.general.language)

        this.shortcutsService.init()
        this.notificationService.setMessage(translations.INITIAL_INFORMATION, 4000)

        if (isFirstTime) {
            this.notificationService.send(translations.WELCOME_MESSAGE)
        }

        this.initialized = true
    }

    private initTranslations (language: string): Promise<any> {
        this.translateService.setDefaultLang(language)
        return this.translateService.use(language).toPromise()
    }

}
