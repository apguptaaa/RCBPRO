import { Component } from '@angular/core';
import { LucideStar } from '@lucide/angular';

interface Review {
  quote: string;
  name: string;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [LucideStar],
  templateUrl: './reviews.component.html'
})
export class ReviewsComponent {
  readonly stars = [1, 2, 3, 4, 5];

  readonly reviews: Review[] = [
    { quote: 'The vintage bento cake looked exactly like the photo and tasted even better. Beautiful packaging too!', name: 'Aarohi S.' },
    { quote: 'The custom design process was seamless. Everyone at the anniversary dinner loved the cake.',            name: 'Meera K.'  },
    { quote: 'Fresh roses, rich brownies and delivery right on time. A genuinely premium experience.',               name: 'Rohan M.'  },
    { quote: 'Not overly sweet, wonderfully soft and elegant. This is now our family celebration bakery.',           name: 'Naina P.'  },
  ];
}
