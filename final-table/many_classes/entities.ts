//объявление новых типов двнных для сокращения кода
type Cell = string|number;
type CellArray = Array<Cell>;

// настройка параметров таблицы
interface TableOptions {
    renderType : number;
    hasTotalRow : boolean;
    keyNumber : number;
    columnNumber : number;
    rowSize : number;
}
const setTableOption : TableOptions = {
    renderType : 0,
    hasTotalRow : true,
    keyNumber : 3,
    columnNumber : 200,
    rowSize : 6
}
