//объявление новых типов двнных для сокращения кода
type Cell = string|number;
type CellArray = Array<Cell>;

//выбор параметров таблицы
interface tableOption{
    hasLazyLoading: boolean;
    hasTotalRow: boolean;
}
let setTableOption:tableOption ={
    hasLazyLoading: false,
    hasTotalRow: false
}
