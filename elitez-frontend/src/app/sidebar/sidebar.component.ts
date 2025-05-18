import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { GymService } from '../gym/gym.service';
import { forkJoin } from 'rxjs';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  user: any = null;
  gyms: any[] = [];
  selectedGym: any = null;

  constructor(private http: HttpClient, private gymService: GymService) {}

  ngOnInit(): void {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token no encontrado.');
    return;
  }
  // Carga simultánea del perfil del usuario y la lista de gimnasios
  forkJoin({
    user: this.http.get('http://localhost:3000/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }),
    gyms: this.gymService.getGyms()
  }).subscribe({
    next: ({ user, gyms }: any) => {
      this.user = user;
      this.gyms = gyms;
      console.log('✅ Usuario cargado:', this.user);
      console.log('✅ Gimnasios cargados:', this.gyms);

      this.loadSelectedGym(); //busca el gym del usuario
    },
    error: (error) => {
      console.error('❌ Error al cargar datos iniciales:', error);
    }
  });
}

  // Cargar perfil de usuario individualmente
  loadUserProfile(): void {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token no encontrado.');
    return;
  }

  this.http.get('http://localhost:3000/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  }).subscribe({
    next: (data: any) => {
      this.user = data;
      console.log('Usuario cargado:', this.user);

      this.loadGyms(); // Primero carga los gimnasios
      setTimeout(() => {
        this.loadSelectedGym(); 
      }, 500); 
    },
    error: (error) => {
      console.error('Error al cargar el perfil del usuario:', error);
    },
  });
}
  // Cargar lista de gimnasios usando el servicio
  loadGyms(): void {
    this.gymService.getGyms().subscribe({
      next: (data) => {
        this.gyms = data;
        console.log('Gimnasios cargados:', this.gyms);
      },
      error: (error) => {
        console.error('Error al cargar gimnasios:', error);
      },
    });
  }
  // Selección de gimnasio por parte del usuario
  selectGym(gym: any): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No se encontró el token');
        return;
    }

    this.http.post('http://localhost:3000/auth/select-gym', { gymId: gym.id }, {
        headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
        next: () => {
            this.selectedGym = gym;
            localStorage.setItem('gymName', gym.name);
            console.log(`✅ Gimnasio seleccionado: ${gym.name}`);
        },
        error: (error) => {
            console.error('❌ Error al seleccionar gimnasio:', error);
        }
    });
}
  

  // Deseleccionar el gimnasio actual
  clearSelectedGym(): void {
    console.log('🧪 CLICK detectado en botón');
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ Token no encontrado.');
    return;
  }

  this.http.post('http://localhost:3000/auth/deselect-gym', {}, {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: () => {
      this.selectedGym = null;
      localStorage.removeItem('selectedGymId');
      console.log('✅ Gimnasio deseleccionado correctamente');
    },
    error: (error) => {
      console.error('❌ Error al deseleccionar gimnasio:', error);
    }
  });
}
  // Cargar el gimnasio asociado al usuario
  loadSelectedGym(): void {
  if (this.user && this.user.gym_id) {
    this.selectedGym = this.gyms.find(gym => gym.id === this.user.gym_id);
    if (this.selectedGym) {
      localStorage.setItem('gymName', this.selectedGym.name); 
    }
  } else {
    console.warn("⚠️ No se encontró gimnasio asociado al usuario.");
  }
}
  // Obtener el índice del gimnasio para mostrar su imagen
  getGymIndex(selectedGym: any): number {
    if (!selectedGym || !this.gyms || this.gyms.length === 0) {
      return 0; // Por defecto, evitar errores
    }
    const index = this.gyms.findIndex(gym => gym.id === selectedGym.id);
    return index !== -1 ? index : 0;
  }
  // Obtener la ruta de la imagen del gimnasio
  getImagePath(index: number): string {
    return `assets/static-images/gym${index + 1}.jpg`;
  }
  logout(): void {
    localStorage.removeItem('token'); // Aqui elimino el token
    this.user = null; // limpiar usuario
    window.location.href = '/login'; // redirigir al login
  }
  
  
}
