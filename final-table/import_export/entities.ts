//объявление новых типов двнных для сокращения кода
export type Cell = string|number;
export type CellArray = Array<Cell>;

// некий элемент страницы, куда надо вставить таблицу
const tableLocation : HTMLDivElement = document.createElement('div');
tableLocation.className = 'wrapper';
document.body.appendChild(tableLocation);

// настройка параметров таблицы
export interface TableOptionsFragment {
    renderType : RenderType; // тип прогрузки страниц
    hasTotalRow : boolean; // нужна ли строка итогов
    target : HTMLElement; // в какой элемент вставляется таблица
    position? : InsertPosition; // расположение внутри target
}

export const sTO : TableOptionsFragment = { // setTableOption
    renderType : 2, // 0 - LazyLoading, 1 - ButtonLoading, 2 - PaginatedLoading
    hasTotalRow : true,
    target : tableLocation,
    position : 'beforeend'
}
export enum RenderType{
    LazyLoading,
    ButtonLoading,
    PaginatedLoading
}
