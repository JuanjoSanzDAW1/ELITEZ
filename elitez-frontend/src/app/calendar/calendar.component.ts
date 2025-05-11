import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { jwtDecode } from "jwt-decode";
import { FormsModule } from '@angular/forms';   
import { CalendarModule } from 'primeng/calendar';

// 🔹 Importar Bootstrap correctamente
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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const gymId = localStorage.getItem('selectedGymId');

    if (!gymId) {
        alert("⚠️ No has seleccionado un gimnasio. Por favor, elige uno primero.");
        return;
    }

    console.log("✅ Cargando eventos para el gimnasio ID:", gymId);
    this.cargarEventos();
    this.cargarHorarios();
}
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
    events: []
  };
  handleEventClick(info: any) {
    this.selectedEvent = {
      id: info.event.id,
      titulo: info.event.title,
      start: info.event.start?.toISOString().split("T")[0], // Fecha formateada
      hora_inicio: info.event.start?.toLocaleTimeString('es-ES', { hour12: false }),
      hora_fin: info.event.end?.toLocaleTimeString('es-ES', { hour12: false })
    };
  
    console.log("Evento seleccionado:", this.selectedEvent);
  
    // Mostrar el modal con los detalles del evento seleccionado
    let modalElement = document.getElementById('eventModal');
    if (modalElement) {
      let modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  cargarEventos() {
    const gymId = localStorage.getItem('selectedGymId');
    const token = localStorage.getItem('token');

    if (!gymId || !token) {
        console.error("⚠️ No se encontró el gimnasio o el token.");
        return;
    }

    this.http.get(`http://localhost:3000/api/eventos/${gymId}`, {
        headers: { Authorization: `Bearer ${token}` } // 📌 Enviar el token
    }).subscribe({
        next: (data: any) => {
            this.eventos = data.map((evento: any) => ({
                id: evento.id,
                title: evento.titulo,
                start: `${evento.fecha}T${evento.hora_inicio}`,
                end: `${evento.fecha}T${evento.hora_fin}`,
                hora_inicio: evento.hora_inicio,
                hora_fin: evento.hora_fin,
                titulo: evento.titulo // 📌 Asegurar que el título se almacena correctamente
            }));
            console.log("✅ Eventos cargados:", this.eventos);
            this.calendarOptions.events = [...this.eventos];
        },
        error: (error) => {
            console.error("❌ Error al cargar eventos:", error);
        }
    });
}

cargarHorarios() {
  const gymId = localStorage.getItem('selectedGymId');
  const token = localStorage.getItem('token');

  if (!gymId || !token) {
      console.error("⚠️ No se encontró el gimnasio o el token.");
      return;
  }

  this.http.get(`http://localhost:3000/api/horarios/${gymId}`, {
      headers: { Authorization: `Bearer ${token}` } // 📌 Enviar el token
  }).subscribe({
      next: (data: any) => {
          this.horarios = data;
          console.log("✅ Horarios cargados:", this.horarios);
      },
      error: (error) => {
          console.error("❌ Error al cargar horarios:", error);
      }
  });
}


  handleDateClick(info: any) {
    this.selectedDate = info.dateStr;
    console.log("Fecha seleccionada:", this.selectedDate);
  
    this.cargarEventos(); // Cargar eventos del día
    this.cargarHorarios(); // 🔹 Cargar horarios del gimnasio para este día
  
    let modalElement = document.getElementById('eventModal');
    if (modalElement) {
      let modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  
  agregarEvento() {
    const gymId = localStorage.getItem('selectedGymId');
    const token = localStorage.getItem('token');

    if (!gymId || !token) {
        alert("⚠️ No se ha seleccionado un gimnasio o el usuario no está autenticado.");
        return;
    }

    if (!this.selectedDate || !this.selectedEvent.titulo || !this.selectedEvent.hora_inicio || !this.selectedEvent.hora_fin) {
        alert("Por favor, introduce un título y selecciona una hora.");
        return;
    }

    const usuario_id = this.obtenerUsuarioID();
    if (!usuario_id) {
        alert("Error: Usuario no autenticado");
        return;
    }

    const nuevoEvento = {
        gym_id: gymId,
        usuario_id: usuario_id,
        titulo: this.selectedEvent.titulo,
        fecha: this.selectedDate,
        hora_inicio: this.formatTime(this.selectedEvent.hora_inicio),
        hora_fin: this.formatTime(this.selectedEvent.hora_fin)
    };

    console.log("✅ Enviando evento al backend:", nuevoEvento);

    this.http.post(`http://localhost:3000/api/eventos`, nuevoEvento, {
        headers: { Authorization: `Bearer ${token}` } // 📌 Enviar el token
    }).subscribe({
        next: () => {
            alert("✅ Evento guardado con éxito");
            this.cargarEventos();
        },
        error: (error) => {
            console.error("❌ Error al guardar el evento:", error);
            alert("❌ Error al guardar el evento. Verifica la consola.");
        }
    });
}



  obtenerUsuarioID(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }

  formatTime(time: any): string {
    if (!time) return '';

    if (typeof time === 'string' && time.includes(':')) {
      return time;
    }

    if (time instanceof Date) {
      return time.toLocaleTimeString('es-ES', { hour12: false });
    }

    return '';
  }

  deleteEvent(evento: any) {
    if (!evento || !evento.id) {
        alert("⚠️ Error: Evento no válido.");
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert("⚠️ Error: Usuario no autenticado.");
        return;
    }

    if (confirm(`¿Seguro que quieres eliminar el evento "${evento.titulo}"?`)) {
        this.http.delete(`http://localhost:3000/api/eventos/${evento.id}`, {
            headers: { Authorization: `Bearer ${token}` } // 📌 Enviar el token
        }).subscribe({
            next: () => {
                alert("✅ Evento eliminado correctamente.");
                this.cargarEventos(); // 📌 Recargar eventos para actualizar la lista
            },
            error: (error) => {
                console.error("❌ Error al eliminar evento:", error);
                alert("❌ No se pudo eliminar el evento. Verifica la consola.");
            }
        });
    }
}

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
