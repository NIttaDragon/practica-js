var Table = /** @class */ (function () {
    function Table(data, n) {
        this.table = document.createElement('table');
        this.tbody = document.createElement('tbody');
        document.body.append(this.table); //выделение в DOM места для таблицы
        this.table.appendChild(this.tbody); //выделение в таблице места для данных
        for (var i = 0; i < n; i++) //создание строк в таблице в DOM
            this.createRow(data, n, i);
    }
    Table.prototype.createRow = function (data, n, i) {
        var _this = this;
        this.row = document.createElement('tr');
        this.tbody.appendChild(this.row);
        this.rowData = document.createElement('td');
        this.rowData.innerHTML = data[i][0]; //запись данных в первый столбец-ключ
        this.row.appendChild(this.rowData);
        this.createMap(data, n); //создание MAP по данным, которые будут в таблице
        var mapGet = this.map.get(data[i][0]);
        mapGet.forEach(function (elem) {
            _this.rowData = document.createElement('td');
            _this.rowData.innerHTML = elem; //mapGet[j]; //запись данных в ячейку таблицы
            _this.row.appendChild(_this.rowData);
        });
    };
    Table.prototype.createMap = function (data, n) {
        this.map = new Map();
        for (var i = 0; i < n; i++) {
            var arra = [data[i][1], data[i][2], data[i][3]]; //создание массива для записи нескольких элементов по одному ключу
            this.map.set(data[i][0], arra); //запись пары ключ-значение в MAP
        }
    };
    return Table;
}());
// массив исходных данных
var array = [
    ['a', 1, 2, 3],
    ['b', 3, 2, 1],
    ['c', 1, 2, 3],
    ['d', 2, 1, 3]
];
// создание таблицы
var tabley = new Table(array, 4);
