import express from 'express'
import { UserRoutes } from '../modules/Users/user.route';
import { CowRoutes } from '../modules/Cow/cow.route';
import { OrderRoutes } from '../modules/orders/order.route';
import { AdminRoute } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.route';
const router = express.Router()

const moduleRoutes = [
    {
      path: '/users',
      route: UserRoutes,
    },
    {
      path: '/admins',
      route: AdminRoute,
    },
    {
      path: '/cows',
      route: CowRoutes,
    },
    {
      path: '/orders',
      route: OrderRoutes,
    },
    {
      path: '/auth',
      route: AuthRoutes,
    },
 
  ];
  
  moduleRoutes.forEach(route => router.use(route.path, route.route));

  export default router

