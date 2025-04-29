import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Cliente } from '../../../interfaces/cliente';
import { ClienteService } from '../../../servicios/cliente.service';

@Component({
  selector: 'app-formulario-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html'
})
export class FormularioComponent {
  @Output() notificarListaActualizada = new EventEmitter<number>();
  @ViewChild('mdlForm') mdlForm!: ElementRef;
  @ViewChild('modalTitle') modalTitle!: ElementRef;
  @ViewChild('clienteForm') clienteForm!: NgForm;
  private formEmitterSubscription!: Subscription;
  private modalInstance: any;
  private id: number | null = null;
  cliente!: Cliente;

  constructor(private clienteService: ClienteService) { }

  ngOnInit() {
    this.initVehiculo();
    this.formEmitterSubscribe();
  }

  ngAfterViewInit() {
    this.modalInstance = new (window as any).bootstrap.Modal(this.mdlForm.nativeElement);

    this.mdlForm.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.modalTitle.nativeElement.innerText = 'Agregar Cliente';
      this.id = null;
      this.clienteForm.resetForm();
      this.initVehiculo();
    });
  }

  private initVehiculo() {
    this.cliente = {
      nrodocumento: '',
      nombre: '',
      apellido: '',
      correo: '',
      telefono: ''
    }
  }

  private formEmitterSubscribe() {
    this.formEmitterSubscription = this.clienteService.formEmitter.subscribe((id) => {
      if (id && id > 0) {
        this.obtener(id);
      }

      this.modalInstance.show();
    });
  }

  private obtener(id: number) {
    this.clienteService.obtener(id).subscribe((response) => {
      if (response) {
        this.id = id;
        this.cliente = response;
        this.modalTitle.nativeElement.innerText = 'Editar Cliente';
      }
    });
  }

  guardar(clienteForm: NgForm) {
    const { value, valid } = clienteForm;
    if (valid) {
      value.id = this.id;
      this.clienteService.registrar(value).subscribe({
        next: (response) => {
          const data = response.data as { [key: string]: any };
          this.notificarListaActualizada.emit(Number(data['id']));
          this.modalInstance.hide();
        },
        error: (err) => {
          alert(err);
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.formEmitterSubscription) {
      this.formEmitterSubscription.unsubscribe();
    }
  }
}
