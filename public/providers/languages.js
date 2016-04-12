app.factory('languages', function(values, $cookies) {
  LNGS = {
    'en': {
      /* Login page*/
      'sign_in': 'sign in',
      'forgot_password': 'forgot password',
      'error': 'error',
      'email': 'email',
      'password': 'password',
      'remember': 'remember',
      'sign_up': 'sign up',
      'reset': 'reset',
      'no_account': 'Don\'t have an account',
      /* Settings page*/
      'settings': 'settings',
      'del_account': 'delete account',
      'change_data': 'change data',
      'change_password': 'change password',
      'name': 'name',
      'birth_year': 'birth year',
      'phone': 'phone',
      'country': 'country',
      'state': 'state',
      'city': 'city',
      'language': 'language',
      'new_password': 'new password',
      'confirm': 'confirm',
      'cancel': 'cancel',
      'wrong_fields_value': 'some input values are incorrect',
      /* Top page */
      'sign_out': 'sign out',
      'welcome': 'welcome',
      'projects': 'projects',
      'workplace': 'workplace'
    },
    'ru': {
      /* Login page*/      
      'sign_in': 'войти',
      'forgot_password': 'забыли пароль',
      'error': 'ошибка',
      'email': 'почта',
      'password': 'пароль',
      'remember': 'запомнить',
      'sign_up': 'зарегистрироваться',
      'reset': 'сбросить',
      'no_account': 'нету аккаунта',
      /* Settings page*/      
      'settings': 'настройки',
      'del_account': 'удалить аккаунт',
      'change_data': 'изменить данные',
      'change_password': 'изменить пароль',
      'name': 'имя',
      'birth_year': 'год рождения',
      'phone': 'телефон',
      'country': 'страна',
      'state': 'область',
      'city': 'город',
      'language': 'язык',
      'new_password': 'новый пароль',
      'confirm': 'подтвердить',
      'cancel': 'отмена',
      'wrong_fields_value': 'не все поля заполнены верно',      
      /* Top page */
      'sign_out': 'выйти',
      'welcome': 'привет',
      'projects': 'проекты',
      'workplace': 'кабинет'     
    },
    availableLng: function() {
      lan = values.def_lang;
      if ($cookies.get('lang') !== undefined) {
        lan = $cookies.get('lang');
      }
      return lan;
    }
  }
  return LNGS
});