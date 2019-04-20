var raspi = require('raspi');
var RotaryEncoder = require('raspi-rotary-encoder').RotaryEncoder;
console.log('Start')
raspi.init(function() {
  var encoder = new RotaryEncoder({
    pins: { a: 9, b: 10 },
    pullResistors: { a: "up", b: "up" }
  });
 
  encoder.addListener('change', function (evt) {
    console.log('Count', evt.value);
  })
});
