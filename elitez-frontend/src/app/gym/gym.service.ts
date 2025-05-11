import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GymService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  
  getGyms(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/auth/gyms', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  
  selectGym(gymId: number) {
    return this.http.post('http://localhost:3000/selectGym', { gymId });
  }
  

  
  getMartialArts(gymId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gyms/${gymId}/martial-arts`);
  }

  
  selectMartialArt(martialArtId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/martial-arts/select`, { martialArtId });
  }
}
