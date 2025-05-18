import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-cuotas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cuotas.component.html',
  styleUrls: ['./cuotas.component.css']
})
export class CuotasComponent implements OnInit, AfterViewInit {
  cuotas: any[] = [];
  gymName: string | null = null;
  showModal = false;

  toast: any;

  formData = {
    email: '',
    nombre: '',
    direccion: '',
    tarjeta: '',
    expiracion: '',
    cvv: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.gymName = localStorage.getItem('gymName') || 'Gimnasio';
    this.cdr.detectChanges();

    this.http.get('http://localhost:3000/auth/cuotas', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        this.cuotas = data;
      },
      error: (err) => {
        console.error("Error al obtener cuotas:", err);
      }
    });
  }

  ngAfterViewInit(): void {
    const toastEl = document.getElementById('paymentToast');
    if (toastEl) {
      this.toast = new bootstrap.Toast(toastEl);
    }
  }

  abrirModal(): void {
    this.showModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.showModal = false;
  }

  confirmarPago(form: any): void {
  if (!form.valid) {
    alert('❌ Por favor, completa todos los campos obligatorios.');
    return;
  }

  console.log('💳 Datos del pago:', this.formData);
  this.showModal = false;
  this.cdr.detectChanges();

  if (this.toast) {
    this.toast.show();
  }
}

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  getPlanClass(numDisciplinas: number): string {
    switch (numDisciplinas) {
      case 1: return 'bronze';
      case 2: return 'silver';
      default: return 'gold';
    }
  }
}
