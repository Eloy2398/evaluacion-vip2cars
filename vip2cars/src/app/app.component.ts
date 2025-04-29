import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VehiculoComponent } from "./modulos/vehiculo/vehiculo.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VehiculoComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'vip2cars';
}
