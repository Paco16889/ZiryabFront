import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentsServiceService {

   //url de la api
    private apiUrl = 'http://localhost:3000/characters';

    
  constructor(private http: HttpClient) { }


  //Método que pide todos los personajes al servidor
  getCharacters(): Observable<Student[]> {
     //Devuelve un Observable ( una respuesta que lleva con el tiempo)
     return this.http.get<Student[]>(this.apiUrl);
  }
}
