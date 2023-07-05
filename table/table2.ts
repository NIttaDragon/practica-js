class Table { // класс для обработки массива и построения таблицы
  tableEl:HTMLTableElement = document.createElement('table'); //создание таблицы в DOM

  private tbody:HTMLTableSectionElement = document.createElement('tbody'); //создание тела таблицы в DOM
  // id - номер строки в таблице

  constructor(map){ //общее создание таблицы
    this.tableEl.appendChild(this.tbody); //выделение в таблице места для данных
    for(let id = 0; id < map.size / 2; id++){ //создание строк в таблице в DOM
      this.createRow(map, id);
    }
  }

  private createRow(map, id:number){ // создание строк
    let row:HTMLTableRowElement = document.createElement('tr');
    this.tbody.appendChild(row);
    let cell:HTMLTableDataCellElement = document.createElement('td');
    cell.innerHTML = <string>map.get(id); //запись данных в первый столбец-ключ
    row.appendChild(cell);
    map.get(map.get(id)).forEach((element)=>{
      cell = document.createElement('td');
      cell.innerHTML = <string>element; //запись данных в ячейку таблицы
      row.appendChild(cell);
    })
  }
}

let array:Array<Array<string|number>> = [ // массив исходных данных
  ['a', 1, 2, 3],
  ['b', 3, 2, 1],
  ['c', 1, 2, 3],
  ['d', 2, 1, 3]]

function createMap(array:Array<Array<string|number>>){
  let map = new Map();
  for(let i = 0; i < array.length; i++){
    map.set(i, array[i][0]);
    let data:Array<string|number> = []
    for(let j = 1; j < array[i].length; j++)
      data[j] = array[i][j];
    map.set(array[i][0], data);
  }
  return map
}

let table = new Table(createMap(array)); // создание таблицы
document.body.append(table.tableEl); //выделение в DOM места для таблицы
