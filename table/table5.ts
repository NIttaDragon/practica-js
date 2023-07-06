//объявление новых типов двнных для сокращения кода
type Cell = string|number;
// type PrimaryCell = Cell;
// type OtherCellArray = Array<Cell>;
type CellArray = Array<Cell>;

// класс для построения таблицы
class Table {
  tableEl: HTMLTableElement = document.createElement('table'); //создание таблицы в DOM

  private tbody: HTMLTableSectionElement = document.createElement('tbody'); //создание тела таблицы в DOM

  //создание элементов таблицы
  constructor(tableMap: Map<CellArray, CellArray>){
    this.tableEl.appendChild(this.tbody); //выделение в таблице места для данных
    tableMap.forEach((value: CellArray, key: CellArray) => { //создание каждой строки
      this.tbody.appendChild(this.createHTMLRow(key, value));
    });
  }

  // создание строк
  private createHTMLRow(primaryCell: CellArray, otherCellArray: CellArray): HTMLTableRowElement {
    const htmlRow: HTMLTableRowElement = document.createElement('tr'); // создание строки (как элемента таблицы DOM)
    primaryCell.forEach(primcell => { //зполнение последующих столбцов таблицы
      htmlRow.appendChild(this.createHTMLCell(primcell));
    });
    // htmlRow.appendChild(this.createHTMLCell(primaryCell)); // заполнение первого столбца таблицы
    otherCellArray.forEach(othcell => { //зполнение последующих столбцов таблицы
      htmlRow.appendChild(this.createHTMLCell(othcell));
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
function createTableMap(keyNumber: number, columnNumber: number, rowSize: number): Map<CellArray, CellArray> {
  let tableMap = new Map(); //создание MAP
  for(let i = 0; i < columnNumber; i++){
    let primaryCellDataArray:CellArray = []; // создание массива для значений строки
    for(let j=0; j<keyNumber; j++)
      primaryCellDataArray[j] = randomString();
    let otherCellDataArray:CellArray = [];
    for(let j = 0; j < rowSize; j++)
      otherCellDataArray[j] = Math.floor(Math.random()*1000); // запись значений в массив
    tableMap.set(primaryCellDataArray, otherCellDataArray); //создание пар ключ-значение для данных
  }
  return sortMap(tableMap,keyNumber);
}

function sortMap(oldTableMap: Map<CellArray, CellArray>, keyNumber:number): Map<CellArray, CellArray>{
  let notSortedKeyArray = new Array(oldTableMap.size); //неотсортированный массив ключей
  let notSortedValueArray = new Array(oldTableMap.size); //начальный массив переменных
  let keyArray = new Array(oldTableMap.size); // массив для выборочной сортировки ключей
  let sortedKeyArray = new Array(oldTableMap.size); //отсортированный массив ключей
  for(let j = 0; j < oldTableMap.size; j++)
    sortedKeyArray[j] = new Array(keyNumber);
  let sortedValueArray = new Array(oldTableMap.size); //сопоставленный ему массив значений
  let newTableMap = new Map(); //отсортированный MAP
  const sortingIndex: number = 0;  //меняется в зависимости от того столбца сортировки
  let i: number = 0; //индексация для .forEach
  //вытаскивание массивов ключей и значений из MAP
  oldTableMap.forEach((value: CellArray, key: CellArray) => {
    notSortedKeyArray[i] = key;
    notSortedValueArray[i] = value;
    i++;
  });
  for(let j = 0; j < oldTableMap.size; j++) // перевод ключей по индексации в новый массив
    keyArray[j] = notSortedKeyArray[j][sortingIndex];
  keyArray.sort(); //сортировка индексированных ключей
  i = 0;
  //перезапись массивов ключей и значений с учётом сортировки
  keyArray.forEach((sortedKey) => {
    for(let j = 0; j < oldTableMap.size; j++)
      if(sortedKey == notSortedKeyArray[j][sortingIndex]){
        sortedValueArray[i] = notSortedValueArray[j];
        for(let k = 0; k < keyNumber; k++)
          sortedKeyArray[i][k] = notSortedKeyArray[j][k];
      }
    newTableMap.set(sortedKeyArray[i], sortedValueArray[i]); //перезапись MAP
    i++;
  });
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

let table = new Table(createTableMap(3, 100, 10)); // создание таблицы
document.body.append(table.tableEl); //выделение в DOM места для таблицы
