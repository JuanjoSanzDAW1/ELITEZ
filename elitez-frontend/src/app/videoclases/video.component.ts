import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../shared/safe.pipe'; 
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-video-clases',
  standalone: true,
  imports: [CommonModule, FormsModule, SafePipe, RouterModule,],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoClasesComponent implements OnInit {
  user: any = null;
  videos: any[] = [];
  disciplinasUnicas: string[] = [];
  selectedDisciplina: string | null = null;
  selectedGymId: string | null = null;

  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("⚠️ Debes iniciar sesión.");
      this.router.navigate(['/login']);
      return;
    }

    // Obtener el gym_id desde el backend
    this.http.get('http://localhost:3000/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (user: any) => {
        this.selectedGymId = user.gym_id;
        // Si no tiene gimnasio seleccionado, redirige al inicio
        if (!this.selectedGymId) {
          alert("⚠️ Debes seleccionar un gimnasio antes de ver videoclases.");
          this.router.navigate(['/sidebar']);
          return;
        }
        //Cargar los vídeos
        this.cargarVideos(token);
      },
      error: () => {
        alert("⚠️ Sesión inválida. Inicia sesión de nuevo.");
        this.router.navigate(['/login']);
      }
    });
  }
  // Cambia la disciplina seleccionada
  seleccionarDisciplina(disciplina: string) {
    this.selectedDisciplina = disciplina;
  }
  // Extrae el ID del vídeo de YouTube desde una URL
  extractYouTubeId(url: string): string {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^\s&]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }
  // Cierra la sesión, elimina el token y redirige al login
  logout(): void {
    localStorage.removeItem('token'); 
    this.user = null; 
    window.location.href = '/login'; 
  }
  // Vuelve al inicio
  volverAlInicio() {
  this.router.navigate(['/sidebar']);
}
  // Carga los vídeos del gimnasio actual desde la API
cargarVideos(token: string): void {
    this.http.get<any[]>(`http://localhost:3000/api/videos/${this.selectedGymId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        this.videos = data.map(video => {
          const isYouTube = video.url_video.includes("youtube.com") || video.url_video.includes("youtu.be");
          const embedUrl = isYouTube ? `https://www.youtube.com/embed/${this.extractYouTubeId(video.url_video)}` : null;

          return {
            ...video,
            isYouTube,
            embedUrl
          };
        });

        this.disciplinasUnicas = [...new Set(this.videos.map(video => video.disciplina))];
        this.selectedDisciplina = this.disciplinasUnicas[0] || null;
      },
      error: (error) => {
        console.error("❌ Error al cargar videos:", error);
      }
    });
  }
}
