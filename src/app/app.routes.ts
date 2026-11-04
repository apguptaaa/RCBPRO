import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { CategoryPageComponent } from './features/category-page/category-page.component';
import { FavoritesPageComponent } from './features/favorites/favorites-page.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Crumb & Bloom | Fresh Eggless Cakes' },
  { path: 'cakes', component: CategoryPageComponent, title: 'Cakes | Crumb & Bloom' },
  { path: 'cakes/:category', component: CategoryPageComponent, title: 'Shop Cakes | Crumb & Bloom' },
  {
    path: 'best-sellers',
    loadComponent: () => import('./features/best-sellers/best-sellers-page.component').then(module => module.BestSellersPageComponent),
    title: 'Best Sellers | Crumb & Bloom'
  },
  {
    path: 'occasions',
    loadComponent: () => import('./features/occasions/occasions-page.component').then(module => module.OccasionsPageComponent),
    title: 'Shop by Occasion | Crumb & Bloom'
  },
  {
    path: 'customize',
    loadComponent: () => import('./features/customize/customize-page.component').then(module => module.CustomizePageComponent),
    title: 'Custom Cakes | Crumb & Bloom'
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about-page.component').then(module => module.AboutPageComponent),
    title: 'About Us | Crumb & Bloom'
  },
  {
    path: 'reviews',
    loadComponent: () => import('./features/reviews/reviews.component').then(module => module.ReviewsComponent),
    title: 'Customer Reviews | Crumb & Bloom'
  },
  {
    path: 'support',
    loadComponent: () => import('./features/support/support-page.component').then(module => module.SupportPageComponent),
    title: 'Help & Support | Crumb & Bloom'
  },
  { path: 'favorites', component: FavoritesPageComponent, title: 'Your Favourites | Crumb & Bloom' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login-page.component').then(module => module.LoginPageComponent),
    title: 'Login | Crumb & Bloom'
  },
  {
    path: 'admin/login',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-dashboard.component').then(module => module.AdminDashboardComponent),
    title: 'Admin Dashboard | Crumb & Bloom'
  },
  { path: 'products/:id', component: ProductDetailComponent, title: 'Cake Details | Crumb & Bloom' },
  { path: '**', redirectTo: '' }
];
