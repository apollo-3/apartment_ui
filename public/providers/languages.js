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
      'level': 'level',
      /* Top page */
      'sign_out': 'sign out',
      'welcome': 'welcome',
      'projects': 'projects',
      'workplace': 'workplace',
      /* Projects page*/      
      'private': 'private',
      'shared': 'shared',
      'type': 'type',
      'created': 'created',
      'owners': 'owners',
      'currency': 'currency',
      'exchange_rate': 'exchange rate',
      'description': 'description',
      'project_name': 'title',
      'users': 'users',
      'friend': 'friend',
      'rate': 'rate',
      'no_projects': 'You don\'t have any projects yet. Create one now!',
      'warning': 'warning',
      'are_you_sure_delete': 'Are you sure you wanna delete',
      'sort': 'sort',
      'new': 'new',
      'added': 'added',
      /* Project Page */
      'filters': 'filters',
      'info': 'information',      
      'empty_project': 'This project is empty. Add something into it!',
      'phone': 'phone',
      'map': 'map',
      'address': 'address',
      'scrolling': 'scrolling',
      'link': 'link',
      'display': 'display',
      'hide': 'hide',
      'contact': 'contact',
      'floor': 'floor',
      'year': 'year',
      'price': 'price',
      'converter': 'converter',
      'call': 'call',
      'to_call': 'to call',
      'called': 'called',
      'call_back': 'call back',
      'stars': 'rating',
      'owner': 'owner',
      'subway': 'subway',
      'shop': 'shop',
      'park': 'park',
      'school': 'school',
      'day_care': 'day care',
      'last_floor': 'last floor',
      'other': 'other',
      'photos': 'photos',
      'upload': ' upload',
      'table': 'table',
      'no_location_set': 'no location set on map!',
      'address_repeat': 'this address already exist in your project!',
      'account_limit': 'Change your account level. You reached the limit for ',
      'actions': 'actions',
      'furniture': 'furniture',
      'electronics': 'electronics',
      'all': 'all',
      'enable': 'enbale',
      'disable': 'disable',
      'modified': 'modified',
      'from': 'from',
      'to': 'to'
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
      'level': 'уровень',     
      /* Top page */
      'sign_out': 'выйти',
      'welcome': 'привет',
      'projects': 'проекты',
      'workplace': 'кабинет',
      /* Projects page*/      
      'private': 'приватный',
      'shared': 'общий',
      'type': 'тип',
      'created': 'создан',
      'owners': 'владельцы',
      'currency': 'валюта',
      'exchange_rate': 'коэф. конвертации',
      'description': 'описание',
      'project_name': 'название',
      'users': 'пользватели',
      'friend': 'друг',
      'rate': 'курс',
      'no_projects': 'У вас пока не ни одного проекта. Создайте первый сейчас!',
      'warning': 'внимание',
      'are_you_sure_delete': 'Вы уверены, что хотите удалить',
      'sort': 'сортировать',
      'new': 'новый',
      'added': 'добавлено',
      /* Project Page */
      'filters': 'фильтры',
      'info': 'информация',
      'empty_project': 'Этот проект пока пустой. Начни добавлять сюда варианты!',
      'phone': 'телефон',
      'map': 'карта',
      'address': 'адрес',
      'scrolling': 'скроллинг',
      'link': 'ссылка',
      'display': 'отображать',
      'hide': 'прятать',
      'contact': 'контакт',
      'floor': 'этаж',
      'year': 'год',
      'price': 'цена',
      'converter': 'конвертер',
      'call': 'звонок',
      'to_call': 'позвонить',
      'called': 'звонил',
      'call_back': 'перезвонить',
      'stars': 'рейтинг',
      'owner': 'владелец',
      'subway': 'метро',
      'shop': 'магазин',
      'park': 'парк',
      'school': 'школа',
      'day_care': 'детский сад',
      'last_floor': 'верхний этаж',
      'other': 'другое',
      'photos': 'фото',
      'upload': ' звгрузить',
      'table': 'таблица',
      'no_location_set': 'не выбрано место на карте!',
      'address_repeat': 'этот адрес уже существует в вашем проекте!',
      'account_limit': 'Измените уровень аккаунта. Вы достигли лимита для ',
      'actions': 'действия',
      'furniture': 'мебель',
      'electronics': 'электроприборы',
      'all': 'все',
      'enable': 'включить',
      'disable': 'выключить',
      'modified': 'изменен',
      'from': 'с',
      'to': 'по'  
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