//объявление новых типов двнных для сокращения кода
type Cell = string|number;
type CellArray = Array<Cell>;

//выбор параметров таблицы
enum RenderType{
    LAZY,
    BUTTON,
    PAGINATION}
interface TableOptions {
    setLoading: RenderType.PAGINATION;
    hasTotalRow: boolean;
}
let setTableOption : TableOptions = {
    setLoading: RenderType.PAGINATION,
    hasTotalRow: false
}
