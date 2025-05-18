// Importaciones necesarias de Angular
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Decorador del componente de Angular
@Component({
  selector: 'app-ajustes', // Nombre del componente
  standalone: true,        // Indica que este componente es independiente
  templateUrl: './ajustes.component.html', // Ruta del HTML asociado
  styleUrls: ['./ajustes.component.css'],  // Estilos CSS asociados
  imports: [CommonModule, FormsModule, RouterModule] // Módulos importados
})
export class AjustesComponent implements OnInit {
  // Objeto donde se guardan los datos del usuario que se mostrarán en el formulario
  user: any = {
    username: '',
    email: '',
    password: ''
  };

  // Controla si el formulario está en modo edición
  editando = false;

  constructor(private http: HttpClient, private router: Router) {}

  // Se ejecuta automáticamente al cargar el componente
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      // Si no hay token, se redirige al login
      this.router.navigate(['/login']);
      return;
    }

    // Se hace una petición para obtener el perfil del usuario
    this.http.get('http://localhost:3000/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        this.user = data; // Se carga la información del usuario en el formulario
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
      }
    });
  }

  // Alterna el modo de edición del formulario
  toggleEditar(): void {
    this.editando = !this.editando;
  }

  // Guarda los cambios realizados en el perfil del usuario
  guardarCambios(): void {
    const token = localStorage.getItem('token');

    this.http.put('http://localhost:3000/auth/update', this.user, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        alert('✅ Cambios guardados correctamente.');
        this.editando = false;
      },
      error: (err) => {
        console.error('Error al guardar cambios:', err);
        alert('❌ Error al guardar los cambios.');
      }
    });
  }

  // Cierra la sesión del usuario
  logout(): void {
    localStorage.removeItem('token'); // Elimina el token JWT
    window.location.href = '/login';  // Redirige al login
  }

  // Elimina la cuenta del usuario actual
  eliminarCuenta(): void {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!confirmacion) return; // Si el usuario cancela, no hace nada

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No hay sesión activa.');
      return;
    }

    // Llamada DELETE al backend para eliminar la cuenta
    this.http.delete('http://localhost:3000/auth/eliminar-cuenta', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        alert('✅ Cuenta eliminada correctamente.');
        localStorage.removeItem('token');  // Se elimina el token del almacenamiento local
        this.router.navigate(['/login']);  // Se redirige al login
      },
      error: (err) => {
        console.error('Error al eliminar cuenta:', err);
        alert('❌ Hubo un error al eliminar la cuenta.');
      }
    });
  }
}
