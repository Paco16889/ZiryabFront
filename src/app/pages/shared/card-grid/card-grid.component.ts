import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CardItem {
  id: number | string;
  title: string;
  subtitleTopLabel?: string;
  subtitleTopValue?: string;
  subtitleBottomLabel?: string;
  subtitleBottomValue?: string;
  actionLabel?: string;
}

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-grid.component.html',
  styleUrls: []
})
export class CardGridComponent {
  @Input() title: string = '';
  @Input() loadingMessage: string = 'Cargando...';
  @Input() emptyMessage: string = 'No hay elementos para mostrar.';
  @Input() loading: boolean = false;
  @Input() errorMessage: string = '';
  @Input() items: CardItem[] = [];

  @Output() actionClicked = new EventEmitter<CardItem>();

  public colorThemes = [
    { bg: 'from-blue-100 via-blue-50 to-blue-200 border-blue-200', line: 'border-blue-300', text: 'text-blue-600', btn: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { bg: 'from-purple-100 via-purple-50 to-purple-200 border-purple-200', line: 'border-purple-300', text: 'text-purple-600', btn: 'bg-purple-500 hover:bg-purple-600 text-white' },
    { bg: 'from-emerald-100 via-emerald-50 to-emerald-200 border-emerald-200', line: 'border-emerald-300', text: 'text-emerald-600', btn: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
    { bg: 'from-rose-100 via-rose-50 to-rose-200 border-rose-200', line: 'border-rose-300', text: 'text-rose-600', btn: 'bg-rose-500 hover:bg-rose-600 text-white' },
    { bg: 'from-amber-100 via-amber-50 to-amber-200 border-amber-200', line: 'border-amber-300', text: 'text-amber-600', btn: 'bg-amber-500 hover:bg-amber-600 text-white' },
    { bg: 'from-cyan-100 via-cyan-50 to-cyan-200 border-cyan-200', line: 'border-cyan-300', text: 'text-cyan-600', btn: 'bg-cyan-500 hover:bg-cyan-600 text-white' }
  ];

  onAction(item: CardItem): void {
    this.actionClicked.emit(item);
  }
}
