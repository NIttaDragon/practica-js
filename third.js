function setColor1(e){
  if(e.type == 'mouseover')
    e.target.style.backgroundColor = 'red';
  else if(e.type == 'mouseout')
    e.target.style.backgroundColor = 'orange';
}
var square = document.querySelector('.square');
square.addEventListener('mouseover', setColor1);
square.addEventListener('mouseout', setColor1);

function setColor2(e){
  if(e.type == 'mouseover')
    e.target.style.backgroundColor = 'yellow';
  else if(e.type == 'mouseout')
    e.target.style.backgroundColor = 'green';
}
var circle = document.querySelector('.circle');
circle.addEventListener('mouseover', setColor2);
circle.addEventListener('mouseout', setColor2);

document.querySelector('.circle').onclick = function clonei(event){
  var fig = document.querySelector('.figures');
  var elemy = document.querySelector('.circle');
  var elem = elemy.cloneNode(true);
  document.body.appendChild(elem);
}

document.querySelector('.square').onclick = function dely(event){
  var elemy = document.querySelector('.square');
  elemy.parentNode.removeChild(elemy);
}
