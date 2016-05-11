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
      'about': 'about',
      'contacts': 'contacts',
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
      'to': 'to',
      'log': 'log',
      'enter_comment': 'Enter your comment',
      /* About Page */      
      'whats_for': 'what\'s for',
      'whats_for_description': 'The goal of this project is to provide an easy, convinient, portable service for end users to manage estate offers on the market.',
      'future_tenants': 'future tenants',
      'future_owners': 'future owners',
      'realtors': 'real estate agents',
      'targets': 'targets',
      'apartments': 'apartments',
      'houses': 'house',
      'country_houses': 'country house',
      'other_property': 'any other kind of property',
      'advantages': 'advantages',
      'display_on_map': 'display on map',
      'group_editing': 'group editing',
      'contact_log': 'contact log',
      'money_converter': 'money converter',
      'call_history_tracker': 'call history tracker',
      'bunch_of_filters': 'bunch of filters',
      'cvs_reports': 'cvs reports',
      'free_account': 'free standard account',
      /* Contacts Page */
      'contacts_description': 'The project is under development, so we are glad to hear any ideas from you. Please feel free to contact us on different questions.',
      'premium_features': 'premium features',      
      'possible_questions': 'possible questions',
      'improvements': 'improvements',
      'bug_reports': 'bug reports',
      'business_offers': 'business offers'
      
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
      'about': 'о проекте',
      'contacts': 'контакты', 
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
      'to': 'по',
      'log': 'журнал',
      'enter_comment': 'Введите комментарий', 
      /* About Page */      
      'whats_for': 'для чего',
      'whats_for_description': 'Цель проекта - предоставить легкий, удобный, мобильный сервис по управлению предложениями недвижимости на рынке для пользователей.',
      'future_tenants': 'будущие арендаторы',
      'future_owners': 'будущие владельцы',
      'realtors': 'агенты по недвижимости',
      'targets': 'цели',
      'apartments': 'квартиры',
      'houses': 'дома',
      'country_houses': 'дачи',
      'other_property': 'любая другая недвижимость',
      'advantages': 'преимущества',
      'display_on_map': 'отображение на карте',
      'group_editing': 'групповое редактирование',
      'contact_log': 'журнал переговоров',
      'money_converter': 'конвертер валюты',
      'call_history_tracker': 'отслеживание звонков',
      'bunch_of_filters': 'набор фильтров',
      'cvs_reports': 'cvs отчеты',
      'free_account': 'бесплатный стандартный аккаунт',
      /* Contacts Page */
      'contacts_description': 'Проект находится в стадии разработки, поэтому мы рады узнать ваше мнение и идеи. Вы можете связаться с нами по разным вопросам.',
      'possible_questions': 'возможные вопросы',
      'premium_features': 'премиум возможности',
      'improvements': 'улучшения',
      'bug_reports': 'найденные ошибки',
      'business_offers': 'бизнес предложения'
    },
    availableLng: function() {
      lan = values.def_lang;
      if ($cookies.get('lang') !== undefined) {
        lan = $cookies.get('lang');
      }
      if (['en', 'ru'].indexOf(lan) === -1) {lan = 'en';}
      return lan;
    }
  }
  return LNGS
});