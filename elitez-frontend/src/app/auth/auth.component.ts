import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  messageLogin = '';
  messageRegister = '';

  constructor(private http: HttpClient) {}

  login(usernameInput: HTMLInputElement, passwordInput: HTMLInputElement) {
    const username = usernameInput.value;
    const password = passwordInput.value;

    const payload = { username, password };

    
    this.http.post('/auth/login', payload).subscribe(
      (response: any) => {
        this.messageLogin = 'Inicio de sesión exitoso';
        console.log('Respuesta del servidor:', response);
      },
      (error) => {
        this.messageLogin = 'Error al iniciar sesión';
        console.error('Error:', error);
      }
    );
  }

  register(usernameInput: HTMLInputElement, passwordInput: HTMLInputElement, emailInput: HTMLInputElement) {
    const username = usernameInput.value;
    const password = passwordInput.value;
    const email = emailInput.value;

    const payload = { username, password, email };

    
    this.http.post('/auth/register', payload).subscribe(
      (response: any) => {
        this.messageRegister = 'Registro exitoso';
        console.log('Respuesta del servidor:', response);
      },
      (error) => {
        this.messageRegister = 'Error al registrarse';
        console.error('Error:', error);
      }
    );
  }
}
