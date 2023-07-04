class Table {
  private table = document.createElement('table');
  private tbody = document.createElement('tbody');
  private row;
  private rowData;
  private map;

  constructor(data, n){ //общее создание таблицы
    document.body.append(this.table);  //выделение в DOM места для таблицы
    this.table.appendChild(this.tbody); //выделение в таблице места для данных
    for(let i = 0; i < n; i++) //создание строк в таблице в DOM
      this.createRow(data, n, i);
  }

  private createRow(data, n, i){ // создание строк
    this.row = document.createElement('tr');
    this.tbody.appendChild(this.row)
    this.rowData = document.createElement('td');
    this.rowData.innerHTML = data[i][0]; //запись данных в первый столбец-ключ
    this.row.appendChild(this.rowData);
    this.createMap(data, n); //создание MAP по данным, которые будут в таблице
    let mapGet = this.map.get(data[i][0]);
    mapGet.forEach((elem)=>{
      this.rowData = document.createElement('td');
      this.rowData.innerHTML = elem;//mapGet[j]; //запись данных в ячейку таблицы
      this.row.appendChild(this.rowData);
    })
  }

  private createMap(data, n){ //создание MAP
      this.map = new Map();
      for(let i=0;i<n;i++){
        let arra = [data[i][1], data[i][2], data[i][3]]; //создание массива для записи нескольких элементов по одному ключу
        this.map.set(data[i][0],arra); //запись пары ключ-значение в MAP
      }
  }
}

// массив исходных данных
let array: Array<Array<string|number>> =[
  ['a', 1, 2, 3],
  ['b', 3, 2, 1],
  ['c', 1, 2, 3],
  ['d', 2, 1, 3]]

// создание таблицы
let tabley = new Table(array, 4);
