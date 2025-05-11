import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { GymService } from '../gym/gym.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  user: any = null;
  gyms: any[] = [];
  selectedGym: any = null;

  constructor(private http: HttpClient, private gymService: GymService) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadGyms();
    this.loadSelectedGym();
  }

  
  loadUserProfile(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado.');
      return;
    }

    this.http
      .get('http://localhost:3000/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (data: any) => {
          this.user = data;
          console.log('Usuario cargado:', this.user);
          this.loadSelectedGym(data.selectedGymId);
        },
        error: (error) => {
          console.error('Error al cargar el perfil del usuario:', error);
        },
      });
  }

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
            localStorage.setItem('selectedGymId', gym.id.toString()); // 📌 Guardar en localStorage
            console.log(`✅ Gimnasio seleccionado: ${gym.name}`);
        },
        error: (error) => {
            console.error('❌ Error al seleccionar gimnasio:', error);
        }
    });
}

  
  clearSelectedGym(): void {
    this.selectedGym = null;
    localStorage.removeItem('selectedGym');
    console.log('Gimnasio deseleccionado.');
  }
  
  loadSelectedGym(): void {
    const storedGymId = localStorage.getItem('selectedGymId');

    if (storedGymId) {
        // 📌 Buscar el gimnasio en la lista de gimnasios disponibles
        this.selectedGym = this.gyms.find(gym => gym.id === Number(storedGymId));

        if (!this.selectedGym) {
            console.warn("⚠️ Gimnasio en localStorage no coincide con la lista de gimnasios.");
        }
        return;
    }

    // 📌 Si no está en localStorage, intentar obtenerlo del usuario en la BD
    if (this.user && this.user.gym_id) {
        this.selectedGym = this.gyms.find(gym => gym.id === this.user.gym_id);
        localStorage.setItem('selectedGymId', this.user.gym_id.toString());
        console.log("✅ Gimnasio cargado desde el backend:", this.selectedGym);
    } else {
        console.warn("⚠️ No se encontró gimnasio seleccionado.");
    }
}

  getGymIndex(selectedGym: any): number {
    if (!selectedGym || !this.gyms || this.gyms.length === 0) {
      return 0; // Por defecto, evitar errores
    }
    const index = this.gyms.findIndex(gym => gym.id === selectedGym.id);
    return index !== -1 ? index : 0;
  }

  getImagePath(index: number): string {
    return `assets/static-images/gym${index + 1}.jpg`;
  }
  logout(): void {
    localStorage.removeItem('token'); // Aqui elimino el token
    this.user = null; // limpiar usuario
    window.location.href = '/login'; // redirigir al login
  }
  
  
}
