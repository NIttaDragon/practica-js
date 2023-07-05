//объявление новых типов двнных для сокращения кода
type Cell = string|number;
type PrimaryCell = Cell;
type OtherCellArray = Array<Cell>;

// класс для построения таблицы
class Table {
  tableEl: HTMLTableElement = document.createElement('table'); //создание таблицы в DOM

  private tbody: HTMLTableSectionElement = document.createElement('tbody'); //создание тела таблицы в DOM

  //создание элементов таблицы
  constructor(tableMap: Map<PrimaryCell, OtherCellArray>){
    this.tableEl.appendChild(this.tbody); //выделение в таблице места для данных
    tableMap.forEach((value: OtherCellArray, key: PrimaryCell) => { //создание каждой строки
      this.tbody.appendChild(this.createHTMLRow(key, value));
    });
  }

  // создание строк
  private createHTMLRow(primaryCell: PrimaryCell, otherCellArray: OtherCellArray): HTMLTableRowElement {
    const htmlRow: HTMLTableRowElement = document.createElement('tr'); // создание строки (как элемента таблицы DOM)
    htmlRow.appendChild(this.createHTMLCell(primaryCell)); // заполнение первого столбца таблицы
    otherCellArray.forEach(cell => { //зполнение последующих столбцов таблицы
      htmlRow.appendChild(this.createHTMLCell(cell));
    });
    return htmlRow
  }

  // заполнение строк
  private createHTMLCell(cell:Cell): HTMLTableDataCellElement{
    const htmlCell: HTMLTableDataCellElement = document.createElement('td'); // создание ячейки строки
    htmlCell.innerHTML = <string>cell; //заполнение ячейки строки
    return htmlCell
  }
}

// создание и заполнение MAP
function createTableMap(columnNumber: number, rowSize: number): Map<PrimaryCell, OtherCellArray> {
  let tableMap = new Map(); //создание MAP
  for(let i = 0; i < columnNumber; i++){
    let data:OtherCellArray = [] // создание массива для значений строки
    for(let j = 1; j < rowSize; j++)
      data[j] = Math.floor(Math.random()*1000); // запись значений в массив
    tableMap.set(randomString(), data); //создание пар ключ-значение для данных
  }
  // console.log(sortMap(tableMap));
  return sortMap(tableMap);
}

function sortMap(oldTableMap: Map<PrimaryCell, OtherCellArray>): Map<PrimaryCell, OtherCellArray>{
  let sortArray = new Array();
  let i = 0;
  oldTableMap.forEach((value: OtherCellArray, key: PrimaryCell) => {
    sortArray[i] = key;
    i++;
  });
  sortArray.sort();
  let newTableMap = new Map();
  for(let j = 0; j < oldTableMap.size; j++){
    newTableMap.set(sortArray[j], oldTableMap.get(sortArray[j]));
  }
  return newTableMap;
}

function randomString(): string{
  const string:string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZабвгдежзийклмнопрстуфхцчшщъыьэюяАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
  let randomString:string = "";
  while (randomString.length < 20) {
    randomString += string[Math.floor(Math.random() * string.length)];
  }
  return randomString
}

let table = new Table(createTableMap(10000, 10)); // создание таблицы
document.body.append(table.tableEl); //выделение в DOM места для таблицы

// нужно больше 10 000 - скорее всего рандомизировать на больших данных
