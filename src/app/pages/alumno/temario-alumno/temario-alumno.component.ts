import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

/**
 * Componente que muestra el temario de una asignatura para el alumno.
 */
@Component({
    selector: 'app-temario-alumno',
    standalone: true,
    imports: [CommonModule, BotonAtrasComponent],
    templateUrl: './temario-alumno.component.html',
    styleUrls: ['./temario-alumno.component.scss']
})
export class TemarioAlumnoComponent {

    unidades = [
        { id: 1, titulo: 'Conceptos Básicos', abierta: true, temas: ['1. Variables y tipos de datos primitivos', '2. Operadores aritméticos y de asignación', '3. Entrada y salida de datos por consola'] },
        { id: 2, titulo: 'Control de Flujo', abierta: false, temas: ['1. Estructuras condicionales (if, else, switch)', '2. Operadores lógicos y relacionales', '3. Manejo de errores básicos'] },
        { id: 3, titulo: 'Bucles e Iteraciones', abierta: false, temas: ['1. Bucle For y sus variantes', '2. Bucles While y Do-While', '3. Break y Continue: Controlando el ciclo'] },
        { id: 4, titulo: 'Funciones', abierta: false, temas: ['1. Declaración y expresión de funciones', '2. Parámetros, argumentos y retorno', '3. Scope (Alcance) de variables'] },
    ];

    toggleUnidad(id: number): void {
        this.unidades = this.unidades.map(u => ({
            ...u,
            abierta: u.id === id ? !u.abierta : false,
        }));
    }
}
