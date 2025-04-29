import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Cliente } from '../interfaces/cliente';
import { environment } from '../../environments/environment';
import { Response } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  formEmitter = new EventEmitter<number | null>();

  constructor(private http: HttpClient) { }

  obtener(id: number): Observable<Cliente> {
    return this.http
      .get<Response>(`${environment.apiURL}cliente/${id}`)
      .pipe(
        map((response: Response) => response.data as Cliente),
        catchError((error: HttpErrorResponse) => {
          console.error(error.status)
          return [];
        })
      );
  }

  registrar(cliente: Cliente): Observable<Response> {
    if (cliente.id && cliente.id > 0) {
      return this.editar(cliente);
    } else {
      return this.agregar(cliente);
    }
  }

  private editar(cliente: Cliente): Observable<Response> {
    return this.http
      .put<Response>(`${environment.apiURL}cliente/${cliente.id}`, cliente)
      .pipe(catchError((error: HttpErrorResponse) => {
        return throwError(() => this.procesarErrors(error.error));
      }));
  }

  private agregar(cliente: Cliente): Observable<Response> {
    return this.http
      .post<Response>(`${environment.apiURL}cliente`, cliente)
      .pipe(catchError((error: HttpErrorResponse) => {
        return throwError(() => this.procesarErrors(error.error));
      }));
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
