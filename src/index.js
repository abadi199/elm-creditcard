'use strict';

require('./index.html');
var Elm = require('./CreditCardForm');

var elm = Elm.CreditCardForm.fullscreen();

//interop
elm.ports.alert.subscribe(function(message) {
  alert(message);
  elm.ports.log.send('Alert called: ' + message);
});