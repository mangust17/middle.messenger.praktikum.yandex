import router from './core/router';
import Block from './core/block';
import * as Pages from './pages';
import Handlebars from 'handlebars';

Handlebars.registerHelper('eq', (a, b) => a === b);
Handlebars.registerHelper('neq', (a, b) => a !== b);
Handlebars.registerHelper('range', (start, end) => Array.from({ length: end - start }, (_, i) => start + i));
Handlebars.registerHelper('lookup', (obj, field) => obj[field]);

// Делаем роутер доступным глобально
(window as any).router = router;

// Регистрация маршрутов
router
  .use('/', Pages.LoginPage as unknown as typeof Block)
  .use('/register', Pages.RegistrationPage as unknown as typeof Block)
  .use('/chats', Pages.ChatsPage as unknown as typeof Block)
  .use('/profile', Pages.ProfilePage as unknown as typeof Block)
  .use('/500', Pages.Error_500 as unknown as typeof Block)
  .use('*', Pages.Error_404 as unknown as typeof Block)
  .start();
