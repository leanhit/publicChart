function setCookie(name, value, days) {
  var expires;

  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
  } else {
      expires = "";
  }
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = encodeURIComponent(name) + "=";
  
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
          var re = c.substring(nameEQ.length, c.length)
          return decodeURIComponent(re);
      }
  }
  return null;
}

function deleteCookie(name) {
  setCookie(name, "", -1);
}
