app.factory('languages', function(values, $cookies) {
  LNGS = {
    'en': {
      'sign_in': 'Sign In',
      'forgot_password': 'Forgot Password',
      'error': 'Error',
      'email': 'email',
      'password': 'password',
      'remember': 'Remember',
      'sign_up': 'Sign Up',
      'reset': 'Reset',
      'no_account': 'Don\'t have an account'
    },
    'ru': {
      'sign_in': '�����',
      'forgot_password': '������ ������',
      'error': '������',
      'email': '�����',
      'password': '������',
      'remember': '���������',
      'sign_up': '������������������',
      'reset': '��������',
      'no_account': '���� ��������'
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