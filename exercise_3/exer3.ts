//интерфейсы объектов
interface IUser {
  id: number;
  name: string;
  // age?: number;  необязательное свойство
  // readonly sex: string;  только для чтения
}
let employee: IUser = {
  id: 1,
  name: 'Tom'
}
function printUser (user: IUser): void{
  console.log('function');
  console.log('id: ', user.id);
  console.log('name: ', user.name);
}
printUser(employee);

function buildUser(userID: number, userName: string): IUser {
  return {id: userID, name: userName};
}
let newUser = buildUser(2, 'Bill');
console.log('id: ', newUser.id, 'name: ', newUser.name);

// определение методов
interface IUsers {
  id: number;
  name: string;
  sayWords(words:string): void;
}
let employer: IUsers = {
  id: 1,
  name: 'Alice',
  sayWords: function (words:string): void {
    console.log(`${employer.name} say '${words}'`);
  }
}
employer.sayWords('Hi, nice to meet you!');

//интерфейсы классов
interface UserInfo{
  id: number;
  name: string;
  getFullName(surname:string):string;
}
class InfoUser implements UserInfo{
  id: number;
  name:string;
  age: number;
  constructor(userId: number, userName: string, userAge: number){
    this.id = userId;
    this.name = userName;
    this.age = userAge;
  }
  getFullName(surname: string): string {
    return this.name+' '+surname;
  }
}
let eva = new InfoUser(5, 'Eva', 22);
console.log(eva.getFullName('Simpson'));

// расширение интерфейсов
interface Man{
  age: number;
  name: string;
}
interface Man{
  surname: string;
}
let man: Man = {
  age: 48,
  name: 'Leon',
  surname: 'Kravich'
}
function printMen(men:Man):void {
  console.log(`age: ${men.age} name: ${men.name} surname: ${men.surname}`);
}
printMen(man);

// наследование интерфейса
interface Transport{
  speed: number;
  move():void;
}
interface Car extends Transport{
  fill(): void;
}
class MyCar implements Car {
  speed: number;
  move(): void{
    console.log("Car speed is " + this.speed + ' mph');
  }
  fill(): void{
    console.log('filling the car with gasoline');
  }
}
let auto = new MyCar();
auto.speed = 47;
auto.fill();
auto.move();

class Base{
  private hiddenA = 7;
  printInternals(){
    console.log(this.hiddenA);
  }
}
const obj = new Base();
obj.printInternals();
// console.log(obj.hiddenA);  отсутствует доступ вне класса

//type в ts
