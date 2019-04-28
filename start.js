const io = require('onoff').Gpio;
const Lcd = require('lcdi2c');
const childProcess = require('child_process')
const os = require('os');
const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
try {
  process.stdin.setRawMode(true);

  process.stdin.on('keypress', (str, key) => {
    console.log(key.name);
    if (key.ctrl && key.name == 'c') {
      process.exit();
    } else if(key.name == "up") {
      menu.up();
    } else if(key.name == "down") {
      menu.down();
    }
  });
} catch(e) {
 console.log(e);
}

const ifaces = os.networkInterfaces();
console.log(ifaces);

var leds = [new io(5, 'out'), new io(6, 'out'), new io(13, 'out')];
function initLeds() {
  for(var led of leds) {
    led.writeSync(0);
  }
  setTimeout(() => {
    for(var led of leds) {
      led.writeSync(1);
    }
  }, 500);
}
initLeds();
var lcd = new Lcd(3, 0x27, 16, 2);
lcd.clear();
var menu = {
  data: [{
    title: "Autonomous"
  }, {
    title: "Info"
  }, {
    title: "Settings"
  }],
  fns: {},
  pos: {
    arrow: 0,
    scroll: 0,
    maxScroll: 0
  }
}
menu.down = () => {
  console.log('\n\nmenu down');
  console.log(`
menu.pos.arrow: ${menu.pos.arrow},
menu.pos.scroll: ${menu.pos.scroll},
menu.pos.maxScroll: ${menu.pos.maxScroll},
menu.pos.arrow (${menu.pos.arrow}) < menu.pos.maxScroll (${menu.pos.maxScroll}): ${menu.pos.arrow < menu.pos.maxScroll},
menu.pos.arrow > menu.pos.scroll + 1: ${menu.pos.arrow > menu.pos.scroll + 1}`);
  if(menu.pos.arrow < menu.pos.maxScroll) {
    menu.pos.arrow++;
    if(menu.pos.arrow > menu.pos.scroll + 1) {
      menu.pos.scroll++;
      displayMenu();
    }
  }
  setArrow();
  console.log(`
menu.pos.arrow: ${menu.pos.arrow},
menu.pos.scroll: ${menu.pos.scroll},
menu.pos.maxScroll: ${menu.pos.maxScroll}`);
}
menu.up = () => {
  if(menu.pos.arrow > 0) {
    menu.pos.arrow--;
    if(menu.pos.arrow < menu.pos.scroll) {
      menu.pos.scroll--;
      displayMenu();
    }
  }
  setArrow();
}

function initLcd() {
  displayMenu(menu.data);
  setArrow(1);
  //lcd.println(String.fromCharCode(126), 1);

}
function setArrow(position = menu.pos.arrow - menu.pos.scroll + 1) {
  console.log(`
setArrow(position: ${position})
position % 2 + 1: ${position % 2 + 1}`);
  lcd.println(String.fromCharCode(126), position);
  lcd.println(" ", position % 2 + 1);
}
function displayMenu(dir = menu.data, index = menu.pos.scroll, prefix = " ") {
  lcd.clear();
  for(let i = 0; i < 2 && i < dir.length; i++)
    lcd.println(prefix + dir[i + index].title, i + 1);
  menu.pos.maxScroll = dir.length - 1;
  console.log(`menu.pos.maxScroll: ${menu.pos.maxScroll}`);
}

function lcdChars() {
  for(let i = 0; i < 2; i++) {
    let str = "";
    for(let j = 0; j < 16; j++)
      str += String.fromCharCode(j * (i + 1));
    lcd.println(str, i + 1);
    console.log(str);
  }
}
lcd.on();
//lcdChars();
initLcd(); 
