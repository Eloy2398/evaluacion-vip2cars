import { Component } from '@angular/core';
import { FormularioComponent } from "./formulario/formulario.component";
import { VehiculoService } from '../../servicios/vehiculo.service';

@Component({
  selector: 'app-vehiculo',
  imports: [FormularioComponent],
  templateUrl: './vehiculo.component.html'
})
export class VehiculoComponent {
  vehiculoList: any[] = [];
  constructor(private vehiculoService: VehiculoService) { }

  ngOnInit() {
    this.obtenerListaServicio();
  }

  obtenerListaServicio() {
    this.vehiculoService.obtenerLista().subscribe((data) => this.vehiculoList = data);
  }

  abrirFormulario(id: number | null = null) {
    this.vehiculoService.formEmitter.emit(id);
  }

  eliminar(id: number) {
    if (confirm('¿Está seguro de que desea eliminar el registro?')) {
      this.vehiculoService.eliminar(id).subscribe((response) => {
        this.obtenerListaServicio();
      });
    }
  }
}
