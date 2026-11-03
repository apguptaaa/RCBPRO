# RCBPRO

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.29.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Demo admin dashboard

Open `/admin/login` after starting the development server and use:

- Email: `admin@crumbandbloom.com`
- Password: `admin123`
- Customer demo: `customer@crumbandbloom.com` / `user123`

The demo dashboard supports adding, editing, and deleting products, categories, subcategories, add-ons, and banners. Categories and subcategories appear in the storefront's **Shop by category** strip. Changes and uploaded demo images are stored in the current browser's local storage and update the storefront, but are not sent to an API or backend. The Admin panel navbar item appears only for the demo admin account. This client-side demo login is not suitable for production; replace it with backend authentication and persistence before deployment.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
