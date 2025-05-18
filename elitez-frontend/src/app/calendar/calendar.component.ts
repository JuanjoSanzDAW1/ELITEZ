import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { jwtDecode } from "jwt-decode";
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule, RouterModule, FullCalendarModule, FormsModule, CalendarModule]
})
export class CalendarComponent implements OnInit {
  eventos: any[] = [];
  horarios: any[] = [];
  selectedDate: string | null = null;
  selectedEvent: any = { titulo: '', hora_inicio: null, hora_fin: null };
  mostrarFormularioEvento: boolean = false;
  gymId: string = '';
  token: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.token = localStorage.getItem('token')!;
    if (!this.token) {
      alert("\u26A0\uFE0F No has iniciado sesi\u00F3n.");
      this.router.navigate(['/login']);
      return;
    }

    this.http.get('http://localhost:3000/auth/profile', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (user: any) => {
        this.gymId = user.gym_id;
        if (!this.gymId) {
          alert("\u26A0\uFE0F No has seleccionado un gimnasio.");
          this.router.navigate(['/sidebar']);
          return;
        }

        this.cargarEventos(this.gymId, this.token);
        this.cargarHorarios(this.gymId, this.token);
      },
      error: () => {
        alert("\u26A0\uFE0F Error al cargar el perfil. Redirigiendo a login.");
        this.router.navigate(['/login']);
      }
    });
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
    events: []
  };
   // Manejador de clic sobre un evento
  handleEventClick(info: any) {
    this.selectedEvent = {
      id: info.event.id,
      titulo: info.event.title,
      start: info.event.start?.toISOString().split("T")[0],
      hora_inicio: info.event.start?.toLocaleTimeString('es-ES', { hour12: false }),
      hora_fin: info.event.end?.toLocaleTimeString('es-ES', { hour12: false })
    };
    // Mostrar modal con detalle del evento
    let modalElement = document.getElementById('eventModal');
    if (modalElement) {
      let modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  // Manejador de clic sobre una fecha vacía
  handleDateClick(info: any) {
    this.selectedDate = info.dateStr;
    console.log("Fecha seleccionada:", this.selectedDate);

    this.cargarEventos(this.gymId, this.token);
    this.cargarHorarios(this.gymId, this.token);
    // Mostrar modal para agregar evento
    let modalElement = document.getElementById('eventModal');
    if (modalElement) {
      let modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  // Cargar eventos desde el backend
  cargarEventos(gymId: string, token: string) {
    this.http.get(`http://localhost:3000/api/eventos/${gymId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        this.eventos = data.map((evento: any) => ({
          id: evento.id,
          title: evento.titulo,
          start: `${evento.fecha}T${evento.hora_inicio}`,
          end: `${evento.fecha}T${evento.hora_fin}`,
          hora_inicio: evento.hora_inicio,
          hora_fin: evento.hora_fin,
          titulo: evento.titulo
        }));
        this.calendarOptions.events = [...this.eventos];
      },
      error: (error) => {
        console.error("\u274C Error al cargar eventos:", error);
      }
    });
  }
  // Cargar horarios del gimnasio desde el backend
  cargarHorarios(gymId: string, token: string) {
    this.http.get(`http://localhost:3000/api/horarios/${gymId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        this.horarios = data;
      },
      error: (error) => {
        console.error("\u274C Error al cargar horarios:", error);
      }
    });
  }
  // Crear un nuevo evento en el backend
  agregarEvento() {
    if (!this.gymId || !this.token) {
      alert("\u26A0\uFE0F No se ha seleccionado un gimnasio o el usuario no est\u00E1 autenticado.");
      return;
    }

    if (!this.selectedDate || !this.selectedEvent.titulo || !this.selectedEvent.hora_inicio || !this.selectedEvent.hora_fin) {
      alert("Por favor, introduce un t\u00EDtulo y selecciona una hora.");
      return;
    }

    const usuario_id = this.obtenerUsuarioID();
    if (!usuario_id) {
      alert("Error: Usuario no autenticado");
      return;
    }

    const nuevoEvento = {
      gym_id: this.gymId,
      usuario_id,
      titulo: this.selectedEvent.titulo,
      fecha: this.selectedDate,
      hora_inicio: this.formatTime(this.selectedEvent.hora_inicio),
      hora_fin: this.formatTime(this.selectedEvent.hora_fin)
    };

    this.http.post(`http://localhost:3000/api/eventos`, nuevoEvento, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        alert("\u2705 Evento guardado con \u00E9xito");
        this.cargarEventos(this.gymId, this.token);
      },
      error: (error) => {
        console.error("\u274C Error al guardar el evento:", error);
        alert("\u274C Error al guardar el evento. Verifica la consola.");
      }
    });
  }
  // Eliminar un evento
  deleteEvent(evento: any) {
    if (!evento || !evento.id) {
      alert("\u26A0\uFE0F Error: Evento no v\u00E1lido.");
      return;
    }

    if (!this.token) {
      alert("\u26A0\uFE0F Error: Usuario no autenticado.");
      return;
    }

    if (confirm(`\u00BFSeguro que quieres eliminar el evento "${evento.titulo}"?`)) {
      this.http.delete(`http://localhost:3000/api/eventos/${evento.id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).subscribe({
        next: () => {
          alert("\u2705 Evento eliminado correctamente.");
          this.cargarEventos(this.gymId, this.token);
        },
        error: (error) => {
          console.error("\u274C Error al eliminar evento:", error);
          alert("\u274C No se pudo eliminar el evento. Verifica la consola.");
        }
      });
    }
  }

  obtenerUsuarioID(): number | null {
    if (!this.token) return null;

    try {
      const decoded: any = jwtDecode(this.token);
      return decoded.id;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }
  // Formatear hora en formato HH:MM:SS
  formatTime(time: any): string {
    if (!time) return '';
    if (typeof time === 'string' && time.includes(':')) return time;
    if (time instanceof Date) return time.toLocaleTimeString('es-ES', { hour12: false });
    return '';
  }
  // Cierra sesión del usuario
  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}