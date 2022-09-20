import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
})
export class InputTextComponent implements OnInit {
  @Output() onEnter: EventEmitter<string> = new EventEmitter();
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();

  debouncer: Subject<string> = new Subject();

  termino: string = '';

  faMagnifyingGlass = faMagnifyingGlass;

  constructor() {}

  ngOnInit(): void {
    this.debouncer.pipe().subscribe((valor) => {
      if (this.termino.length > 0) {
        this.onDebounce.emit(valor);
      } else {
        return;
      }
    });
  }

  teclaPresionada() {
    this.debouncer.next(this.termino);
    this.onEnter.emit(this.termino);
    //console.log(this.termino);
  }
}
