import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  showPopup: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  
  openPopup() {
    this.showPopup = true;
  }

  
  closePopup() {
    this.showPopup = false;
  }


  register(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirm_password'),
    };

    console.log('Datos enviados al backend:', payload);

    this.http.post('http://localhost:3000/auth/register', payload).subscribe(
      (response) => {
        console.log('Registro exitoso:', response);
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error al registrar:', error);
        alert('Error al registrar. Por favor, intenta de nuevo.');
      }
    );
  }

  
  login(event: Event): void {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  const payload = {
    username: formData.get('username'),
    password: formData.get('password'),
  };

  this.http.post('http://localhost:3000/auth/login', payload).subscribe(
    (response: any) => {
      console.log('Inicio de sesión exitoso:', response);
      console.log('📦 selectedGymId recibido del backend:', response.selectedGymId);
      alert('Inicio de sesión exitoso');

      // ✅ Guarda el token
      localStorage.setItem('token', response.token);

      // ✅ Guarda el gym_id si viene del backend
      if (response.selectedGymId) {
        localStorage.setItem('selectedGymId', response.selectedGymId);
      } else {
        localStorage.removeItem('selectedGymId');
      }

      this.router.navigate(['/sidebar']);
    },
    (error) => {
      console.error('Error al iniciar sesión:', error);
      alert(error.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
  );
}

}

