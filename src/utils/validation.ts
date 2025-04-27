export const VALIDATION_RULES = {
  name: /^[А-ЯЁA-Z][а-яёa-z-]*$/,
  login: /^(?!\d+$)[a-zA-Z0-9-_]{3,20}$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
  password: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
  phone: /^\+?\d{1,3}[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
  message: /.+/,
  first_name: /^[А-ЯЁA-Z][а-яёa-z-]*$/,
  second_name: /^[А-ЯЁA-Z][а-яёa-z-]*$/,
  display_name: /^.{3,30}$/,
};

type ValidationRule = keyof typeof VALIDATION_RULES;

export function validateField(value: string, rule: ValidationRule): string | null {
  if (!value && rule !== 'message') {
    return 'Поле не может быть пустым';
  }

  const pattern = VALIDATION_RULES[rule];

  if (!pattern) {
    console.error(`Неизвестное правило валидации: ${rule}`);
    return 'Ошибка валидации';
  }

  if (!pattern.test(value)) {
    switch (rule) {
      case 'name':
        return 'Первая буква должна быть заглавной, допустимы только буквы и дефис';
      case 'login':
        return 'От 3 до 20 символов, латиница, допустимы цифры, дефис и подчёркивание';
      case 'email':
        return 'Неверный формат email';
      case 'password':
        return 'От 8 до 40 символов, обязательны заглавная буква и цифра';
      case 'phone':
        return 'От 10 до 15 цифр, может начинаться с плюса';
      case 'message':
        return 'Сообщение не может быть пустым';
      default:
        return 'Неверный формат';
    }
  }

  return null;
}
