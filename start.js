const io = require('onoff').Gpio;
const Lcd = require('lcdi2c');
const childProcess = require('child_process')
const os = require('os');

const ifaces = os.networkInterfaces();
console.log(ifaces);

var lcd = new Lcd(3, 0x27, 16, 2);
lcd.clear();
var menu = {
  data: [{
    title: "Autonomous"
  }, {
    title: "Info"
  }],
  fns: {},
  pos: {
    cursor: 0,
    scroll: 0,
    maxScroll: 0
  }
}
menu.down = () => {
  if(cursor < maxScroll) {
    cursor++;
    if(cursor > scroll) {
      scroll++;
      displayMenu(menu, scroll)

}
menu.up = () => {
  
}
function initLcd() {
  displayMenu(menu);
  lcd.println(String.fromCharCode(126), 1);
  var flag = false;
  setInterval(() => {
    if(flag) {
      lcd.println(String.fromCharCode(126), 1);
      lcd.println(" ", 2);
    } else {
      lcd.println(" ", 1);
      lcd.println(String.fromCharCode(126), 2);
    }
    flag = !flag
  }, 50);
}
function displayMenu(menu, index = 0) {
  for(let i = 0; i < 2 || i; i++)
    lcd.println(" " + menu[i + index].title, i + 1);
  this.menu.pos.maxScroll = menu.length();
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
