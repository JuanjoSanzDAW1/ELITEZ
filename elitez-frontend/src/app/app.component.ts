import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';

declare global {
  interface Window {
    botpressWebChat?: any;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const onLoginPage = event.urlAfterRedirects.includes('/login');// Detectamos si estamos en /login
        // Si NO estamos en la página de login, inyectamos el chatbot
        if (!onLoginPage) {
          this.injectBotpress();
        }
      }
    });
  }
   // Inyectamos el script del chatbot de Botpress
  injectBotpress() {
    if (!document.getElementById('bp-webchat-script')) {
      const injectScript = document.createElement('script');
      injectScript.id = 'bp-webchat-script';
      injectScript.src = 'https://cdn.botpress.cloud/webchat/v2.5/inject.js';
      injectScript.async = true;
      injectScript.onload = () => {
        this.loadBotpressConfig();
      };
      document.body.appendChild(injectScript);
    } else {  
      // Si ya existe el script, solo cargamos la configuración
      this.loadBotpressConfig();
    }
  }
  // Cargamos el script de configuración del Webchat
  loadBotpressConfig() {
    if (!document.getElementById('bp-webchat-config')) {
      const configScript = document.createElement('script');
      configScript.id = 'bp-webchat-config';
      configScript.src = 'https://files.bpcontent.cloud/2025/05/14/08/20250514085014-3UHJLOM1.js';
      configScript.async = true;
      document.body.appendChild(configScript);
    }
  }
}
