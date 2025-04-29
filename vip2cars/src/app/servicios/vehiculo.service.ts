import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Response } from '../interfaces/response';
import { Vehiculo } from '../interfaces/vehiculo';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  formEmitter = new EventEmitter<number | null>();

  constructor(private http: HttpClient) { }

  obtenerLista(): Observable<any[]> {
    return this.http
      .get<Response>(`${environment.apiURL}vehiculo`)
      .pipe(map((response: Response) => response.data as any[]));
  }

  obtener(id: number): Observable<Vehiculo> {
    return this.http
      .get<Response>(`${environment.apiURL}vehiculo/${id}`)
      .pipe(
        map((response: Response) => response.data as Vehiculo),
        catchError((error: HttpErrorResponse) => {
          console.error(error.status)
          return [];
        })
      );
  }

  registrar(vehiculo: Vehiculo): Observable<Response> {
    if (vehiculo.id && vehiculo.id > 0) {
      return this.editar(vehiculo);
    } else {
      return this.agregar(vehiculo);
    }
  }

  private editar(vehiculo: Vehiculo): Observable<Response> {
    return this.http
      .put<Response>(`${environment.apiURL}vehiculo/${vehiculo.id}`, vehiculo)
      .pipe(catchError((error: HttpErrorResponse) => {
        return throwError(() => this.procesarErrors(error.error));
      }));
  }

  private agregar(vehiculo: Vehiculo): Observable<Response> {
    return this.http
      .post<Response>(`${environment.apiURL}vehiculo`, vehiculo)
      .pipe(catchError((error: HttpErrorResponse) => {
        return throwError(() => this.procesarErrors(error.error));
      }));
  }

  eliminar(id: number): Observable<Response> {
    return this.http.delete<Response>(`${environment.apiURL}vehiculo/${id}`);
  }

  cargarDataInicial(): Observable<{ [key: string]: any[] }> {
    return this.http
      .get<Response>(`${environment.apiURL}vehiculo/cargar-data-inicial`)
      .pipe(map((response: Response) => response.data as { [key: string]: any[] }));
  }

  private procesarErrors(error: Response) {
    if (error.errors) {
      const errorString = [];

      for (let prop in error.errors) {
        errorString.push(error.errors[prop]);
      }

      return errorString.join(',');
    } else {
      return error.message;
    }
  }
}
