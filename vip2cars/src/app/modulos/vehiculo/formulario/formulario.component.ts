import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { VehiculoService } from '../../../servicios/vehiculo.service';
import { Subscription } from 'rxjs';
import { Vehiculo } from '../../../interfaces/vehiculo';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormularioComponent as FormularioComponentCliente } from '../../cliente/formulario/formulario.component';
import { ClienteService } from '../../../servicios/cliente.service';

@Component({
  selector: 'app-formulario',
  imports: [CommonModule, FormsModule, FormularioComponentCliente],
  templateUrl: './formulario.component.html'
})
export class FormularioComponent {
  @Output() notificarListaActualizada = new EventEmitter<string>();
  @ViewChild('mdlForm') mdlForm!: ElementRef;
  @ViewChild('modalTitle') modalTitle!: ElementRef;
  @ViewChild('vehiculoForm') vehiculoForm!: NgForm;
  private formEmitterSubscription!: Subscription;
  private modalInstance: any;
  private id: number | null = null;
  vehiculo!: Vehiculo;
  clienteList: any[] = [];

  constructor(private vehiculoService: VehiculoService, private clienteService: ClienteService) { }

  ngOnInit() {
    this.initVehiculo();
    this.cargarDataInicial();
    this.formEmitterSubscribe();
  }

  ngAfterViewInit() {
    this.modalInstance = new (window as any).bootstrap.Modal(this.mdlForm.nativeElement);

    this.mdlForm.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.modalTitle.nativeElement.innerText = 'Agregar Vehículo';
      this.id = null;
      this.vehiculoForm.resetForm();
      this.initVehiculo();
    });
  }

  private initVehiculo() {
    this.vehiculo = {
      placa: '',
      marca: '',
      modelo: '',
      anio_fabricacion: '',
      id_cliente: 0
    }
  }

  cargarDataInicial(id: number | null = null) {
    this.vehiculoService.cargarDataInicial().subscribe((data) => {
      if (id) this.vehiculo.id_cliente = id;
      this.clienteList = data['clienteList'];
    });
  }

  private formEmitterSubscribe() {
    this.formEmitterSubscription = this.vehiculoService.formEmitter.subscribe((id) => {
      if (id && id > 0) {
        this.obtener(id);
      }

      this.modalInstance.show();
    });
  }

  private obtener(id: number) {
    this.vehiculoService.obtener(id).subscribe((response) => {
      if (response) {
        this.id = id;
        this.vehiculo = response;
        this.modalTitle.nativeElement.innerText = 'Editar Vehículo';
      }
    });
  }

  guardar(vehiculoForm: NgForm) {
    const { value, valid } = vehiculoForm;
    if (valid) {
      value.id = this.id;
      this.vehiculoService.registrar(value).subscribe({
        next: (response) => {
          this.notificarListaActualizada.emit(response.message);
          this.modalInstance.hide();
        },
        error: (err) => alert(err)
      });
    }
  }

  ngOnDestroy() {
    if (this.formEmitterSubscription) {
      this.formEmitterSubscription.unsubscribe();
    }
  }

  nuevoCliente() {
    this.clienteService.formEmitter.emit();
  }

  mostrarClienteEditar(id: number) {
    if (id > 0) {
      this.clienteService.formEmitter.emit(id);
    } else {
      alert('Seleccione un cliente par editar');
    }
  }
}
