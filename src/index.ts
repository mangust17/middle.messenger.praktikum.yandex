import router from './core/router';
import Block from './core/block';
import * as Pages from './pages';
import Handlebars from 'handlebars';

Handlebars.registerHelper('eq', (a, b) => a === b);
Handlebars.registerHelper('neq', (a, b) => a !== b);
Handlebars.registerHelper('range', (start, end) => Array.from({ length: end - start }, (_, i) => start + i));
Handlebars.registerHelper('lookup', (obj, field) => obj[field]);

// Регистрация маршрутов
router
  .use('/', Pages.LoginPage as unknown as typeof Block)
  .use('/sign-up', Pages.RegistrationPage as unknown as typeof Block)
  .use('/messenger', Pages.ChatsPage as unknown as typeof Block)
  .use('/settings', Pages.ProfilePage as unknown as typeof Block)
  .use('/500', Pages.Error_500 as unknown as typeof Block)
  .use('*', Pages.Error_404 as unknown as typeof Block)
  .start();
