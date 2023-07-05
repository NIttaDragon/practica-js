var canvas = document.getElementById('can');
var context = canvas.getContext('2d');

context.fillStyle = "darkgreen";
context.fillRect(0, 0, 250, 250);

canvas.onmousemove = function(event){
  var x = event.offsetX;
  var y = event.offsetY;
  if((x>=0 && x<=250)&&(y>=0 && y<=250)){
    context.fillStyle = "green";
    context.fillRect(0, 0, 250, 250);
  }
  else{
    context.fillStyle = "darkgreen";
    context.fillRect(0, 0, 250, 250);
  }
}

context.fillStyle = "orange";
context.arc(350, 350, 100, 0, Math.PI*2, false);
context.fill();

canvas.onmousedown = function(event){
  var x = event.offsetX;
  var y = event.offsetY;
  if(event.button == 0){
    context.fillStyle = "white";
    context.arc(350, 350, 101, 0, Math.PI*2, false);
    context.fill();
  } else if(event.button == 2){
    if((x>=250 && x<=450)&&(y>=250 && y<=450)){
      context.fillStyle = "darkorange";
      context.arc(400, 350, 100, 0, Math.PI*2, false);
      context.fill();
    }
  }
}
