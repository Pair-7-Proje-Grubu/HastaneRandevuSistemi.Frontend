import { Routes } from '@angular/router';
import { TableComponent } from './shared/components/table/table.component';
import { authRoutes } from './routes/auth/auth.routes';
import { securedRouteGuard } from './core/auth/guards/secured-route.guard';
import { MyAccountPageComponent } from './routes/auth/my-account-page/my-account-page.component';

export const routes: Routes = [

    {
        path: 'table',
        component: TableComponent
    },
    ...authRoutes,
];
