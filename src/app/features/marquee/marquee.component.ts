import { Component } from '@angular/core';

interface MarqueeItem {
  key: string;
  text: string;
  dim: boolean;
}

const STRIP: MarqueeItem[] = [
  { key: 'a', text: '100% eggless cakes',            dim: false },
  { key: 'b', text: '◆',                            dim: true  },
  { key: 'c', text: 'Freshly made to order',         dim: false },
  { key: 'd', text: '◆',                            dim: true  },
  { key: 'e', text: 'Gwalior-only delivery',         dim: false },
  { key: 'f', text: '◆',                            dim: true  },
  { key: 'g', text: 'Made for every celebration',   dim: false },
  { key: 'h', text: '◆',                            dim: true  },
];

@Component({
  selector: 'app-marquee',
  standalone: true,
  template: `
    <div class="overflow-hidden border-y border-cocoa/10 bg-cocoa py-3 text-cream">
      <div class="marquee-track flex gap-10 pr-10 text-xs font-bold uppercase tracking-[.23em]">
        @for (item of items; track item.key) {
          <span [class]="item.dim ? 'text-rosebeige' : ''">{{ item.text }}</span>
        }
      </div>
    </div>
  `
})
export class MarqueeComponent {
  /** Two copies so the CSS marquee loops seamlessly (original React pattern) */
  readonly items: MarqueeItem[] = [
    ...STRIP.map(i => ({ ...i, key: '0-' + i.key })),
    ...STRIP.map(i => ({ ...i, key: '1-' + i.key })),
  ];
}
