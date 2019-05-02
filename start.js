const io = require('onoff').Gpio;
const Lcd = require('lcdi2c');
const childProcess = require('child_process')
const fs = require('fs');
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
    } else if(key.name == "return") {
      menu.enter();
    }
  });
} catch(e) {
 console.log(e);
}

const ifaces = os.networkInterfaces();
console.log(ifaces);

const autoFile = "/home/pi/Autonomous/autonomous_motor-paths.json"

var leds = [new io(2, 'out'), new io(3, 'out'), new io(4, 'out')];
function setRgb(rgb) {
  for(let i in rgb){
    leds[i].writeSync((rgb[i] + 1) % 2);
  }
}
function initLeds() {
  setRgb([1, 0, 0]);
  setTimeout(() => {
    setRgb([0, 1, 0]);
  }, 2000);
  setTimeout(() => {
    setRgb([0, 0, 1]);
  }, 2500);
  setTimeout(() => {
    setRgb([1, 1, 1])
  }, 3000);
  setTimeout(() => {
    setRgb([0, 0, 0])
  }, 3500);

}
initLeds();
var lcd = new Lcd(3, 0x27, 16, 2);
lcd.clear();

var menu = {
  data: [{
    title: "Autonomous",
    type: "option",
    select: (option) => {
      
    },
    update: () => {
      return JSON.parse(fs.readFileSync(autoFile)).map((x) => {
        return {
          title: x.title,
          selected: x.selected
        }
      })
    },
    options: []
  }, {
    title: "Actions",
    type: "menu"
  }, {
    title: "Info"
  }, {
    title: "Settings",
    type: "menu",
    items: [{
      title: "LCD",
      type: "menu",
      items: [{
        title: "Brightness",
        type: "setting",
        setting: {
          type: "slider",
          change: (value, total = 16) => {
            
          },
          get: () => {
            
          }
        },
      }
        
    }, {
      
    }]
  }],
  fns: {},
  pos: {
    arrow: 0,
    scroll: 0,
    maxScroll: 0
  },
  trail: ["data"]
}
menu.current = () => {
  current = menu;
  for(crumb of menu.trail) {
    current = current[crumb]
  }
  return current;
}
menu.parent = (depth = 1) => {
  current = menu;
  for(let i = 0; i < menu.trail - depth; i++) {
    current = current[menu.trail[i]];
  }
  return current;
}
menu.down = () => {
  console.log('\n\nmenu down');
//   console.log(`
// menu.pos.arrow: ${menu.pos.arrow},
// menu.pos.scroll: ${menu.pos.scroll},
// menu.pos.maxScroll: ${menu.pos.maxScroll},
// menu.pos.arrow (${menu.pos.arrow}) < menu.pos.maxScroll (${menu.pos.maxScroll}): ${menu.pos.arrow < menu.pos.maxScroll},
// menu.pos.arrow > menu.pos.scroll + 1: ${menu.pos.arrow > menu.pos.scroll + 1}`);
  if(menu.pos.arrow < menu.pos.maxScroll) {
    menu.pos.arrow++;
    if(menu.pos.arrow > menu.pos.scroll + 1) {
      menu.pos.scroll++;
      displayMenu();
    }
  }
  setArrow();
//   console.log(`
// menu.pos.arrow: ${menu.pos.arrow},
// menu.pos.scroll: ${menu.pos.scroll},
// menu.pos.maxScroll: ${menu.pos.maxScroll}`);
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
menu.enter = () => {
  selected = menu.current()[menu.pos.arrow];
  if (menu.parent().type == "option") {
    menu.current().select(menu.pos.arrow);
    menu.back();
  } else if (selected.type == "option") {
    menu.trail.push(menu.pos.arrow);
    menu.current().options = menu.current().update();
    menu.trail.push("options");
    displayMenu();
  }
}
menu.back = (depth = 2) => {
  for (let i = 0; i < 2; i++) 
    menu.trail.pop();
  displayMenu();
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
function displayMenu(dir = menu.current(), index = menu.pos.scroll, prefix = menu.prefix) {
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
