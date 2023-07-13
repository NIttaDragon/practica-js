//объявление новых типов двнных для сокращения кода
type Cell = string|number;
type CellArray = Array<Cell>;

//выбор параметров таблицы
interface tableOptions {
    hasLazyLoading: boolean;
    hasTotalRow: boolean;
}
let setTableOption:tableOptions = {
    hasLazyLoading: false,
    hasTotalRow: false
}
