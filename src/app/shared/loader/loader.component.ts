import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="lb">
      <div class="lb-card">

        <!-- Pulsing shadow under the cake -->
        <div class="lb-shadow"></div>

        <!-- Cake mascot bouncing smoothly -->
        <img
          src="images/apcake.png"
          alt="Loading Crumb &amp; Bloom"
          class="lb-cake" />

        <!-- Brand -->
        <p class="lb-brand">Crumb &amp; Bloom</p>

        <!-- Animated sub-text -->
        <p class="lb-sub">Warming up the oven<span class="lb-dots"></span></p>

        <!-- Caramel shimmer bar -->
        <div class="lb-bar-wrap">
          <div class="lb-bar"></div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .lb {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F7F0E5;
      background-image: radial-gradient(circle at 1px 1px, rgba(58,36,27,.07) 1px, transparent 1.1px);
      background-size: 24px 24px;
    }

    .lb-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: lbIn .45s ease both;
    }

    /* Shadow that shrinks when cake is high, expands on landing */
    .lb-shadow {
      width: 110px;
      height: 14px;
      border-radius: 50%;
      background: rgba(58,36,27,.12);
      animation: lbShadow 0.85s ease-in-out infinite alternate;
    }

    /* Clean bounce — no rotation, no mirror — just pure up/down */
    .lb-cake {
      width: 200px;
      height: 200px;
      object-fit: contain;
      margin-top: -6px;
      animation: lbBounce 0.85s ease-in-out infinite alternate;
      filter: drop-shadow(0 10px 22px rgba(58,36,27,.20));
    }

    .lb-brand {
      margin: 20px 0 4px;
      font-family: "Playfair Display", serif;
      font-size: 1.5rem;
      font-weight: 800;
      color: #24150F;
      letter-spacing: .01em;
    }

    .lb-sub {
      margin: 0 0 22px;
      font-family: "DM Sans", sans-serif;
      font-size: .875rem;
      font-weight: 500;
      color: #A86F45;
      letter-spacing: .03em;
    }

    /* Animated ellipsis */
    .lb-dots::after {
      content: '';
      animation: lbDots 1.5s steps(4, end) infinite;
    }

    /* Progress shimmer bar */
    .lb-bar-wrap {
      width: 160px;
      height: 4px;
      border-radius: 99px;
      background: rgba(168,111,69,.15);
      overflow: hidden;
    }

    .lb-bar {
      height: 100%;
      border-radius: 99px;
      background: linear-gradient(90deg, #A86F45 0%, #E8D7C0 50%, #A86F45 100%);
      background-size: 200% 100%;
      animation: lbShimmer 1.6s ease-in-out infinite;
    }

    @keyframes lbIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes lbBounce {
      from { transform: translateY(0);    }
      to   { transform: translateY(-18px); }
    }

    @keyframes lbShadow {
      from { transform: scaleX(1.1);  opacity: .12; }
      to   { transform: scaleX(0.65); opacity: .06; }
    }

    @keyframes lbDots {
      0%   { content: '';    }
      25%  { content: '.';   }
      50%  { content: '..';  }
      75%  { content: '...'; }
    }

    @keyframes lbShimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .lb-cake, .lb-shadow, .lb-bar, .lb-dots::after {
        animation: none !important;
      }
    }
  `]
})
export class LoaderComponent {}
