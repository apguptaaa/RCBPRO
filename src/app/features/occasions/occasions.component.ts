import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Occasion } from '../../core/models/product.model';
import { OCCASIONS } from '../../core/data/catalog.data';
import { LucideArrowRight } from '@lucide/angular';

const OCCASION_CATEGORIES = ['Birthday Cakes', 'Anniversary Cakes', 'Custom Cakes'];

@Component({
  selector: 'app-occasions',
  standalone: true,
  imports: [LucideArrowRight],
  templateUrl: './occasions.component.html'
})
export class OccasionsComponent {
  private readonly router = inject(Router);
  readonly occasions: Occasion[] = OCCASIONS;

  pick(index: number): void {
    void this.router.navigate(['/cakes', OCCASION_CATEGORIES[index]]);
  }
}
