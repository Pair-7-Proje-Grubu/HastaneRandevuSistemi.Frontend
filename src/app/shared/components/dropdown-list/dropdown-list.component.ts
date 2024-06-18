import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-dropdown-list',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './dropdown-list.component.html',
    styleUrl: './dropdown-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownListComponent implements OnChanges{ 
    @Input() items: string[] = [];
    selectedItem: string | null = null; 
    filteredItems: string[] = [];
    searchTerm: string = '';

    constructor(private ref: ElementRef) {}

    onSelect(item: string): void {
        this.selectedItem = item;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['items'] && changes['items'].currentValue) {
          this.items = changes['items'].currentValue;
          this.filteredItems = this.items;
        }
      }

    onSearch(event: Event): void {
        this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
        if (this.searchTerm === '') {
          this.filteredItems = this.items; 
        } else {
          this.filteredItems = this.items.filter(item => item.toLowerCase().includes(this.searchTerm));
        }
        console.log(this.filteredItems);
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event): void{
      const targetElement = event.target as HTMLElement;
      if(targetElement && !this.ref.nativeElement.contains(targetElement)){
        this.clearSearch();
      }
    }

    clearSearch(): void{
      this.searchTerm = '';
      this.filteredItems = this.items;
    }
}
