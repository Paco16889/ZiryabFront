import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
@Component({
  selector: 'app-temario',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent],
  templateUrl: './temario.component.html',
  styleUrls: ['./temario.component.scss'] 
})
export class TemarioComponent {  
  unidades = [
    {
      id: 1,
      titulo: 'Conceptos Básicos',
      abierta: true,
      temas: [
        '1. Variables y tipos de datos primitivos',
        '2. Operadores aritméticos y de asignación',
        '3. Entrada y salida de datos por consola'
      ]
    },
    {
      id: 2,
      titulo: 'Control de Flujo',
      abierta: false,
      temas: [
        '1. Estructuras condicionales (if, else, switch)',
        '2. Operadores lógicos y relacionales',
        '3. Manejo de errores básicos'
      ]
    },
    {
      id: 3,
      titulo: 'Bucles e Iteraciones',
      abierta: false,
      temas: [
        '1. Bucle For y sus variantes',
        '2. Bucles While y Do-While',
        '3. Break y Continue: Controlando el ciclo'
      ]
    },
    {
      id: 4,
      titulo: 'Funciones',
      abierta: false,
      temas: [
        '1. Declaración y expresión de funciones',
        '2. Parámetros, argumentos y retorno',
        '3. Scope (Alcance) de variables'
      ]
    }
  ];

  toggleUnidad(id: number) {
    this.unidades = this.unidades.map(u => {
      if (u.id === id) {
        return { ...u, abierta: !u.abierta };
      }
      return { ...u, abierta: false }; // Comenta esta línea si quieres permitir múltiples abiertas
    });
  }
}
