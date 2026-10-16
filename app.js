// Splash screen hide
setTimeout(function(){
  document.getElementById('splash').classList.add('done');
  document.getElementById('app').hidden = false;
}, 2400);

// Screen navigation
function showScreen(id){
  var screens = document.querySelectorAll('.screen');
  for(var i=0;i<screens.length;i++){
    screens[i].classList.add('hidden');
  }
  var target = document.getElementById(id);
  if(target) target.classList.remove('hidden');
}

// Back buttons
var backs = document.querySelectorAll('[data-go]');
for(var i=0;i<backs.length;i++){
  backs[i].addEventListener('click', function(){
    showScreen(this.getAttribute('data-go'));
  });
}

// Home buttons
document.getElementById('goCreate').addEventListener('click', function(){
  generateNewPin();
  showScreen('create');
});

document.getElementById('goEnter').addEventListener('click', function(){
  showScreen('enter');
});

// PIN generation
var currentPin = '';
var pinExpiry = 0;
var pinTimer = null;

function generateNewPin(){
  var arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  currentPin = String(arr[0] % 1000000).padStart(6, '0');
  document.getElementById('pinValue').textContent = currentPin;
  pinExpiry = Date.now() + 5*60*1000;

  if(pinTimer) clearInterval(pinTimer);
  updatePinTimer();
  pinTimer = setInterval(updatePinTimer, 1000);
}

function updatePinTimer(){
  var left = pinExpiry - Date.now();
  if(left < 0) left = 0;
  var m = Math.floor(left / 60000);
  var s = Math.floor((left % 60000) / 1000);
  document.getElementById('pinTimer').textContent =
    String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  if(left === 0){
    clearInterval(pinTimer);
    document.getElementById('pinTimer').textContent = 'EXPIRED';
  }
}

document.getElementById('regenPin').addEventListener('click', generateNewPin);

document.getElementById('copyPin').addEventListener('click', function(){
  if(navigator.clipboard && currentPin){
    navigator.clipboard.writeText(currentPin);
    var btn = this;
    btn.textContent = 'Copied!';
    setTimeout(function(){ btn.textContent = 'Copy'; }, 1500);
  }
});

// PIN input boxes - auto advance
var cells = document.querySelectorAll('.pin-cell');
for(var i=0;i<cells.length;i++){
  (function(idx){
    var cell = cells[idx];
    cell.addEventListener('input', function(){
      cell.value = cell.value.replace(/\D/g,'');
      if(cell.value){
        cell.classList.add('filled');
        if(idx < cells.length-1) cells[idx+1].focus();
      } else {
        cell.classList.remove('filled');
      }
    });
    cell.addEventListener('keydown', function(e){
      if(e.key === 'Backspace' && !cell.value && idx > 0){
        cells[idx-1].focus();
      }
    });
  })(i);
}

// Connect button
document.getElementById('connect').addEventListener('click', function(){
  var pin = '';
  for(var i=0;i<cells.length;i++) pin += cells[i].value;
  var err = document.getElementById('pinError');

  if(pin.length !== 6){
    err.textContent = 'Enter all 6 digits';
    return;
  }
  err.textContent = '';

  // Demo: open chat
  document.getElementById('peerName').textContent = 'KRISTO-' + pin.slice(0,4);
  document.getElementById('chatStatus').textContent = '● Connected (demo)';
  showScreen('chat');
  addMessage('Connection established (demo mode)', 'sys');
});

// Messages
function addMessage(text, type){
  var box = document.getElementById('messages');
  var el = document.createElement('div');
  el.className = 'msg ' + type;
  el.textContent = text;
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
}

document.getElementById('composer').addEventListener('submit', function(e){
  e.preventDefault();
  var input = document.getElementById('msgInput');
  var text = input.value.trim();
  if(!text) return;
  addMessage(text, 'out');
  input.value = '';

  // Demo auto reply
  setTimeout(function(){
    addMessage('(demo reply) ' + text, 'in');
  }, 900);
});

console.log('KRISTO MESH CHAT ready');
