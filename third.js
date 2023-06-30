//переменные

let square = document.querySelector('.square');
let circle = document.querySelector('.circle');
// let elem = circle.cloneNode(true);

//функции

function setColor1(e){
  if(e.type == 'mouseover')
    e.target.style.backgroundColor = 'red';
  else if(e.type == 'mouseout')
    e.target.style.backgroundColor = 'orange';
}

function setColor2(e){
  if(e.type == 'mouseover')
    e.target.style.backgroundColor = 'yellow';
  else if(e.type == 'mouseout')
    e.target.style.backgroundColor = 'green';
}

document.querySelector('.circle').onclick = function clonei(event){
  let elem = circle.cloneNode(true);
  document.body.appendChild(elem);
}

document.querySelector('.square').onclick = function dely(event){
  square.parentNode.removeChild(square);
}

//применение

square.addEventListener('mouseover', setColor1);
square.addEventListener('mouseout', setColor1);

circle.addEventListener('mouseover', setColor2);
circle.addEventListener('mouseout', setColor2);
