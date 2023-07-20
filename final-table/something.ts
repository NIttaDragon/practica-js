//объявление новых типов двнных для сокращения кода
type Cell = string|number;
type CellArray = Array<Cell>;

// класс для построения таблицы
abstract class TableFragment {
    protected tableEl : HTMLTableElement;
    protected tbody : HTMLTableSectionElement;
    protected tfoot : HTMLTableSectionElement;
    protected tableEntriesIterator; //итератор для перебора значений MAP
    protected rowArray = []; //массив для значений строки
    protected globalKeyNumber : number; //глобальная переменная для хранения количества ключей
    protected globalRowLong : number; //глобальная переменная для хранения длины строк
    protected globalColumnNumber : number; //глобальная переменная для хранения количества строк вообще

    private content : Map<CellArray, CellArray>;

    //создание элементов таблицы
    protected constructor(contentMap, hasTotalRow, tableLocation){
        this.createEmptyHTMLTable(tableLocation);
        this.content = this.sortMap(contentMap);
        this.tableEntriesIterator = this.content.entries();
        this.globalColumnNumber = this.content.size;
    }

    //создание пустой таблицы из элементов
    private createEmptyHTMLTable(tableLocation){
        this.tableEl = this.createHTMLElementWithClass('table', 'table');
        this.tbody = this.createHTMLElementWithClass('tbody', 'tbody');
        this.tfoot = this.createHTMLElementWithClass('tfoot', 'tfoot');
        this.tableEl.appendChild(this.tbody);
        this.tableEl.appendChild(this.tfoot);
        tableLocation.appendChild(this.tableEl);
    }

    // создание пустых элементов
    protected createHTMLElementWithClass(tagName, className){
        const newHTMLElement = this.createHTMLElement(tagName);
        newHTMLElement.className = className;
        return newHTMLElement;
    }
    protected createHTMLElementWithID(tagName, idName){
        const newHTMLElement = this.createHTMLElement(tagName);
        newHTMLElement.id = idName;
        return newHTMLElement;
    }
    protected createHTMLElement(tagName){
        return document.createElement(tagName);
    }

    //сортировка MAP по ключу
    private sortMap(contentMap: Map<CellArray, CellArray>): Map<CellArray, CellArray>{
        return new Map([...contentMap.entries()].sort(
            (firstKeyArray : [CellArray, CellArray], secondKeyArray : [CellArray, CellArray]) : number => firstKeyArray[0] > secondKeyArray[0] ? 1 : firstKeyArray[0] < secondKeyArray[0] ? -1 : 0
        ));
    }

    // заполнение строк
    private createHTMLCell(cell:Cell): HTMLTableCellElement{
        const htmlCell : HTMLTableCellElement = this.createHTMLElement('td');
        htmlCell.innerHTML = <string>cell;
        return htmlCell
    }

    //заполнение строки итогов
    protected fillTotalRow(){
        const keyArray : string[] = ['Total:'];
        for (let i : number= 1; i < this.globalKeyNumber; i++)
            keyArray[i] = '';
        const totalSummArray = Array(this.globalRowLong).fill(0);
        const rowsNumber : number = this.rowArray.length;
        for(let i : number= 0; i < rowsNumber; i++){
            const someArray = this.rowArray.shift();
            for(let j: number = 0; j < this.globalRowLong; j++)
                totalSummArray[j] += someArray[j];
        }
        return [keyArray, totalSummArray]
    }

    //создание строки итогов
    protected appendTotalRow(): void {
        const totalRowCellArray = this.fillTotalRow()
        const totalRow : HTMLTableRowElement = this.createHTMLRow(totalRowCellArray[0], totalRowCellArray[1]);
        totalRow.className = 'total'; //присвоение класса
        this.tableEl.insertAdjacentElement('beforeend', totalRow);
    }

    //добавление новых строк в таблицу
    protected appendRows(size: number): void {
        for (let j : number = 0; j < size; j++){
            const rowEntry = this.tableEntriesIterator.next().value;
            if(rowEntry === undefined)  return; //MAP закончился
            else { //MAP не закончился
                this.globalKeyNumber = rowEntry[0].length;
                this.globalRowLong = rowEntry[1].length;
                this.rowArray.push(rowEntry[1]);
                this.tbody.appendChild(this.createHTMLRow(rowEntry[0], rowEntry[1]));
            }
        }
    }

    // создание строк
    protected createHTMLRow(primaryCell: CellArray, otherCellArray: CellArray): HTMLTableRowElement {
        const htmlRow :HTMLTableRowElement = this.createHTMLElement('tr');
        primaryCell.forEach((keys : Cell) : void => {
            htmlRow.appendChild(this.createHTMLCell(keys));
        });
        otherCellArray.forEach((others : Cell) => {
            htmlRow.appendChild(this.createHTMLCell(others));
        });
        return htmlRow
    }
}

// класс загрузки скроллом
class LazyTable extends TableFragment {

    constructor(content, hasTotalRow, tableLocation) {
        super(content, hasTotalRow, tableLocation);
        this.appendRows(100);
        this.addScrollListeners();
        if (hasTotalRow === true)  this.appendTotalRow();
    }

    //обработчик скролла
    private addScrollListeners(){
        document.addEventListener("scroll", () : void =>{
            if (this.findCoords() === true)  this.appendRows(1);
        });
    }

    //нахождение разницы координат последней строки и экрана браузера
    private findCoords() : boolean{
        const windowHeight : number = document.documentElement.clientHeight;
        const lastRowCoord : DOMRect = this.tbody.lastElementChild.getBoundingClientRect();
        return lastRowCoord.bottom - windowHeight < 10
    }
}

// класс загрузки по кнопке
class ButtonedTable extends TableFragment {

    constructor(content, hasTotalRow, tableLocation) {
        super(content, hasTotalRow, tableLocation);
        this.appendRows(100);
        this.createButton();
        this.addClickListener();
        if (hasTotalRow === true)  this.appendTotalRow();
    }

    //кнопка для загрузки строк
    private createButton() : void{
        const htmlRow : HTMLTableRowElement = this.createHTMLElement('tr');
        htmlRow.className = 'button';
        const htmlCell : HTMLTableCellElement = this.createHTMLElement('td');
        htmlCell.colSpan  = this.globalRowLong + this.globalKeyNumber;
        htmlCell.innerHTML = 'Показать ещё';
        htmlRow.appendChild(htmlCell);
        this.tfoot.appendChild(htmlRow);
    }

    //обработчик кнопки
    private addClickListener() : void {
        window.addEventListener('DOMContentLoaded', (): void =>{ //вызов обработчика событий кнопки после создания кнопки
            const tableButton:HTMLElement = document.querySelector('.button');
            const handleClick = () =>{
                this.appendRows(50);
            }
            tableButton.addEventListener('click', handleClick);
        })
    }
}

// класс загрузки по страницам
class PagintedTable extends TableFragment {
    private totalRow : boolean;

    constructor(content, hasTotalRow, tableLocation) {
        super(content, hasTotalRow, tableLocation);
        this.totalRow = hasTotalRow;
        this.createPageButton();
        this.createCellTables();
        this.addLister();
    }

    //обработчик пагинатора
    private addPaginationListener(i) : void {
        window.addEventListener('DOMContentLoaded', () : void =>{ //вызов обработчика событий кнопки после создания кнопки
            let tableButton: HTMLElement = document.getElementById('button '+(i+1)+'-'+(i+100));
            const handleClick = () : void =>{
                let k: number = 0;
                do{
                    const htmlDiv : HTMLElement = document.getElementById('page '+(k+1)+'-'+(k+100));
                    htmlDiv.style.display = 'none';
                    const totalRow : HTMLElement = document.getElementById('total '+(k+1)+'-'+(k+100));
                    totalRow.style.display = 'none';
                    k += 100;
                }while (k < this.globalColumnNumber);
                const htmlDiv : HTMLElement = document.getElementById('page '+(i+1)+'-'+(i+100));
                htmlDiv.style.display = 'block';
                const totalRow : HTMLElement = document.getElementById('total '+(i+1)+'-'+(i+100));
                totalRow.style.display = 'block';
            }
            tableButton.addEventListener('click', handleClick);
        })
    }

    // создание "страниц" с разделами таблицы
    private createCellTables() : void {
        let i : number = 0;
        do{
            const newDiv = this.createHTMLElementWithID('div','page '+(i+1)+'-'+(i+100)/*, 'page '+(i+1)+'-'+(i+100) */)
            for(let k:number = 0; k< 100; k++){
                const rowEntry = this.tableEntriesIterator.next().value;
                if(rowEntry === undefined)  return; //MAP закончился
                else { //MAP не закончился
                    this.globalKeyNumber = rowEntry[0].length;
                    this.globalRowLong = rowEntry[1].length;
                    this.rowArray.push(rowEntry[1]);
                }
                const htmlRow :HTMLTableRowElement = this.createHTMLRow(rowEntry[0], rowEntry[1]);
                newDiv.appendChild(htmlRow);
            }
            if (this.totalRow === true) this.appendTotalRow(i);
            i += 100;
            newDiv.style.display = 'none';
            this.tbody.appendChild(newDiv);
        } while (i<this.globalColumnNumber);
    }

    // создание кнопок для переключения страниц
    private createPageButton() : void {
        const htmlRow :HTMLTableRowElement = this.createHTMLElement('tr');
        htmlRow.className = 'buttons';
        let i : number = 0;
        do{
            const htmlCell :HTMLTableCellElement = this.createHTMLElement('td');
            let idNameString : string = 'button '+(i+1)+'-'+(i+100);
            htmlCell.id = idNameString;
            htmlCell.innerHTML = idNameString;
            htmlRow.appendChild(htmlCell);
            i += 100;
        } while (i<this.globalColumnNumber);
        this.tableEl.insertAdjacentElement('afterend', htmlRow);
    }

    // присвоение обработчика событий всем кнопкам
    private addLister() : void {
        let i : number = 0;
        do{
            this.addPaginationListener(i);
            i +=100;
        }while (i < this.globalColumnNumber);
    }

    //создание строки итогов
    private appendTotalRow(i : number): void {
        const totalRowCellArray = this.fillTotalRow()
        const totalRow : HTMLTableRowElement = this.createHTMLRow(totalRowCellArray[0], totalRowCellArray[1]);
        totalRow.id = 'total '+(i+1)+'-'+(i+100);
        totalRow.className = 'total'; //присвоение класса
        totalRow.style.display = 'none';
        this.tfoot.appendChild(totalRow);
    }
}

// некий элемент страницы, куда надо вставить таблицу
const tableLocation : HTMLDivElement = document.createElement('div');
tableLocation.className = 'wrapper';
document.body.appendChild(tableLocation);

// настройка параметров таблицы
interface TableOptions {
    renderType : number; // тип прогрузки страниц
    hasTotalRow : boolean; // нужна ли строка итогов
    keyNumber : number; // количество ключей
    columnNumber : number; // количество строк
    rowSize : number; // длина строки без ключа
    location : HTMLElement; // в какой элемент вставляется таблица
 }
const sTO : TableOptions = { // setTableOption
    renderType : 1, // 0 - LazyLoading, 1 - ButtonLoading, 2 - PaginatedLoading
    hasTotalRow : true,
    keyNumber : 3,
    columnNumber : 200,
    rowSize : 6,
    location : tableLocation
}

// выбор загрузки таблицы
const newTable : LazyTable | ButtonedTable | PagintedTable  = (sTO.renderType === 0) ?
    new LazyTable(createContentMap(sTO.keyNumber, sTO.columnNumber, sTO.rowSize), sTO.hasTotalRow, sTO.location) : (sTO.renderType === 1) ?
        new ButtonedTable(createContentMap(sTO.keyNumber, sTO.columnNumber, sTO.rowSize), sTO.hasTotalRow, sTO.location) :
        new PagintedTable(createContentMap(sTO.keyNumber, sTO.columnNumber, sTO.rowSize), sTO.hasTotalRow, sTO.location);

// создание и заполнение MAP
function createContentMap(keyNumber: number, columnNumber: number, rowSize: number): Map<CellArray, CellArray> {
    const contentMap: Map<CellArray, CellArray>  = new Map(); //создание MAP
    for(let i : number = 0; i < columnNumber; i++){
        const primaryCellDataArray: CellArray = []; //создание массива для значений ключа
        for(let j : number = 0; j < keyNumber; j++)
            primaryCellDataArray[j] = randomWord(); //заполнение массива значений ключа
        const otherCellDataArray: CellArray = [] // создание массива для значений строки
        for(let j : number = 0; j < rowSize; j++) //заполнение массива значений строки
            otherCellDataArray[j] = Math.floor(Math.random()*1000); // запись значений в массив
        contentMap.set(primaryCellDataArray, otherCellDataArray); //создание пар ключ-значение для данных
    }
    return contentMap;
}

//рандомная строка
function randomWord():string {
    const words :string [] = ['Вахта','Вакцина','Отечество','Владения','Овца','Решительность',
        'Рана','Опасность','Производство','Коммерция','Звание','Начало','Институт',
        'Происшествие','Икона','Полнота','Консерва','Доставка','Адмирал','Ассамблея',
        'Избыток','Муниципалитет','Руководство','Мышцы','Заболевание','Отзыв','Натура',
        'Дискотека','Монахиня','Биржа','Национализм','Претендент','Водитель','Пепел',
        'Продолжение','Забава','Диаметр','Огонь','Предание','Конверт','Всполох','Калий',
        'Барокко','Вертолёт','Добропорядочность','Закон','Пурпур','Наконечник','Республика',
        'Реклама','Единство','Истина','Попрошайка','Ветер','Намётка','Город','Благодарность',
        'Дом','Захоронение','Предпосылка','Мероприятие','Черпак','Лад','Ощущение','Вексель',
        'Купальник','Прикосновение','Приступ','Депо','Езда','Кольцо','Превышение','Факт',
        'Управление','Мгновенность','Достижение','Наличка','Вести','Регион','Пациент',
        'Орлан','Вывих','Низ','Плуг','Осторожность','Кадр','Горечь','Лиса','Инвестиции',
        'Деление','Интервал','Клуб','Понятие','Надежда','Равенство','Рубеж','Направление',
        'Мина','Прошлое','Построение'];
    return words[Math.floor(Math.random()*100)];
}
