class Figures {
  constructor(name){
    this.name = name;
  }
  showName(){
    alert(`${this.name}`);
  }

}

class Triangle extends Figures{
  showName(){
    alert('Triangle');
  }
}

let fig = new Figures("abstract");
fig.showName();
let trig = new Triangle();
trig.showName();


const student = {
  firstName: 'Alice',
  get getName(){
    return this.firstName;
  },
  set changeName(newName){
    this.firstName = newName;
  }
};
console.log(student.getName);
student.changeName = 'Chelsy';
console.log(student.getName);
