import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

/**
 * Componente que muestra el temario de una asignatura organizado por unidades.
 * Actualmente contiene datos mockeados, pendiente de reimplementarse
 * usando la entidad Task con tipo THEORY.
 */
@Component({
  selector: 'app-temario',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent],
  templateUrl: './temario.component.html',
  styleUrls: ['./temario.component.scss'] 
})
export class TemarioComponent {  

    /**
   * Listado de unidades didácticas con sus temas.
   * Datos mockeados, pendiente de sustituir por datos reales del backend.
   */
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


    /**
   * Alterna el estado abierto o cerrado de una unidad didáctica.
   * Solo permite tener una unidad abierta a la vez.
   * @param id - Identificador de la unidad a alternar
   */
  toggleUnidad(id: number) {
    this.unidades = this.unidades.map(u => {
      if (u.id === id) {
        return { ...u, abierta: !u.abierta };
      }
      return { ...u, abierta: false }; // Comenta esta línea si quieres permitir múltiples abiertas
    });
  }
}
