const io = require('onoff').Gpio;
const Rotary = require('onoff-rotary');
const Lcd = require('lcd');
const childProcess = require('child_process');

var lcd = new Lcd({
  rs: 4,
  e: 8,
  data: [25, 24, 23, 18],
  cols: 16,
  rows: 2
});

var encoder = Rotary(9, 10);
var count = 0;
var flag = true;
encoder.on('rotation', (d) => {
  console.log("flag: " + flag);
  if(flag) {
    console.log("Count: " + count);
    if (d > 0) {
      count++;
      console.log('Encoder rotated right');
    } else {
      count--;
      console.log('Encoder rotated left');
    }
    flag = false
    setTimeout(() => {
      flag = true;
    }, 50)
  }
})

var encoderSW = new io(11, 'in', 'both');
encoderSW.watch((err, value) => {
  if (err) throw err;
  console.log('Click: ' + value);
  
});

const menu = [{
  title: "Actions",
  type: "menu",
  children: [{
    title: "Pull from Git",
    type: "command"
  }]
}, {
  title: "Autonomous",
  type: "options",
  children: [
    "Left",
    "Bottom Left",
    "Botton Right",
    "Right"
  ]
}, {
  title: "Info",
  type: "menu",
  children: [{
    title: "IP Address",
    type: "info"
  }, {
    title: "",
    type: "info"
  }]
}, {
  title: "Settings",
  type: "menu",
  children: [{
    title: "LCD",
    type: "menu",
    children: [{
      title: "Brightness",
      type: "setting",
      setting: {
        type: "slider"
      }
    }, {
      title: "Contrast",
      type: "setting",
      setting: {
        type: "slider"
      }
    }]
  }, {
    title: "Reboot",
    type: "command"
  }]
}]

function displayMenu(menu) {
  lcd.print(menu[0], () => {
    lcd.setCursor(0, 1);
    lcd.print(menu[1]);
  });
  lcd.print(menu[1], () => {
    
  });
  for (let item of menu) {
    
  }
}
function startLcd() {
  lcd.setCursor(0, 0);
  lcd.print();
}

function runScript(scriptPath, callback = function(){}) {

    var invoked = false;

    var process = childProcess.fork(scriptPath);

    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}


runScript("/home/pi/rpi-test/displayip.js")
