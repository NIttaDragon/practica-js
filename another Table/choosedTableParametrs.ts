//объявление новых типов двнных для сокращения кода
type Cell = string|number;
type CellArray = Array<Cell>;

// класс для построения таблицы
class CreateTable {
    wrapper = document.createElement('div');
    private tableEl: HTMLTableElement = document.createElement('table');
    private tbody = document.createElement('tbody');
    private tableEntriesIterator; //итератор для перебора значений MAP
    private rowArray = []; //массив для значений строки
    private globalKeyNumber; //глобальная переменная для хранения количества ключей
    private globalRowLong; //глобальная переменная для хранения длины строк

    //создание элементов таблицы
    constructor(contentMap, hasLazyLoading, hasTotalRow){
        this.wrapper.className = 'wrapper';
        this.tableEl.appendChild(this.tbody);
        const content = this.sortMap(contentMap);
        this.tableEntriesIterator = content.entries();
        this.appendRows(20);
        if(hasLazyLoading === false){ //кнопка
            this.createButton();
            this.addClickListener();
        }
        else    this.addScrollListeners(); //скролл
        if(hasTotalRow===true)  this.appendTotalRow();
        this.wrapper.appendChild(this.tableEl);
        document.body.append(this.wrapper);
    }

    //создание пустой строки tr
    private createEmptyHTMLRow(){
        return document.createElement('tr')
    }

    //создание пустой ячейки td
    private createEmptyHTMLCell(){
        return document.createElement('td');
    }

    //обработчик кнопки
    private addClickListener(){
        window.addEventListener('DOMContentLoaded', event =>{ //вызов обработчика событий кнопки после создания кнопки
            const tableButton:HTMLElement = document.querySelector('.button');
            const handleClick = () =>{
                this.appendRows(20);
            }
            tableButton.addEventListener('click', handleClick);
        })
    }

    //обработчик скролла
    private addScrollListeners(){
        document.addEventListener("scroll", ()=>{
            if(this.findCoords()===true)  this.appendRows(1);
        });
    }

    //нахождение разницы координат последней строки и экрана браузера
    private findCoords():boolean{
        let windowHeight = document.documentElement.clientHeight;
        let lastRowCoord = this.tbody.lastElementChild.getBoundingClientRect();
        return lastRowCoord.bottom - windowHeight < 10
    }

    //кнопка для загрузки строк, чтобы корректно работал скролл
    private createButton(){
        let htmlRow = this.createEmptyHTMLRow();
        htmlRow.className = 'button';
        let htmlCell = this.createEmptyHTMLCell();
        htmlCell.colSpan  = this.globalRowLong + this.globalKeyNumber;
        htmlCell.innerHTML = 'Показать ещё';
        htmlRow.appendChild(htmlCell);
        this.tableEl.appendChild(htmlRow);
    }

    //сортировка MAP по ключу
    private sortMap(contentMap: Map<CellArray, CellArray>): Map<CellArray, CellArray>{
        return new Map([...contentMap.entries()].sort(
            (firstKeyArray, secondKeyArray) => firstKeyArray[0] > secondKeyArray[0] ? 1 : firstKeyArray[0] < secondKeyArray[0] ? -1 : 0
        ));
    }

    //добавление новых строк в таблицу
    private appendRows(size: number){
        for(let j= 0; j < size; j++){
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

    //создание строки итогов
    private appendTotalRow(){
        let totalRowAfterFill = this.fillTotalRow()
        let totalRow = this.createHTMLRow(totalRowAfterFill[0], totalRowAfterFill[1]);
        totalRow.className = 'total'; //присвоение класса
        this.tableEl.insertAdjacentElement('beforeend', totalRow);
    }

    //заполнение строки итогов
    private fillTotalRow(){
        let keyArray = ['Total:'];
        for (let i= 1; i < this.globalKeyNumber; i++)
            keyArray[i] = '';
        let totalSummArray = Array(this.globalRowLong).fill(0);
        let rowsNumber = this.rowArray.length;
        for(let i= 0; i < rowsNumber; i++){
            let someArray = this.rowArray.shift();
            for(let j= 0; j < this.globalRowLong; j++)
                totalSummArray[j] += someArray[j];
        }
        return [keyArray, totalSummArray]
    }

    // создание строк
    private createHTMLRow(primaryCell: CellArray, otherCellArray: CellArray): HTMLTableRowElement {
        const htmlRow = this.createEmptyHTMLRow();
        primaryCell.forEach((keys) => {
            htmlRow.appendChild(this.createHTMLCell(keys));
        });
        otherCellArray.forEach(others => {
            htmlRow.appendChild(this.createHTMLCell(others));
        });
        return htmlRow
    }

    // заполнение строк
    private createHTMLCell(cell:Cell): HTMLTableCellElement{
        const htmlCell = this.createEmptyHTMLCell();
        htmlCell.innerHTML = <string>cell;
        return htmlCell
    }
}

//выбор параметров таблицы
interface tableOption{
    hasLazyLoading: boolean;
    hasTotalRow: boolean;
}
let setTableOption:tableOption ={
    hasLazyLoading: false,
    hasTotalRow: false
}

// создание таблицы
let table = new CreateTable(createContentMap(3,100, 6), setTableOption.hasLazyLoading, setTableOption.hasTotalRow);

// создание и заполнение MAP
function createContentMap(keyNumber: number, columnNumber: number, rowSize: number): Map<CellArray, CellArray> {
    let contentMap = new Map(); //создание MAP
    for(let i = 0; i < columnNumber; i++){
        let primaryCellDataArray: CellArray = []; //создание массива для значений ключа
        for(let j = 0; j < keyNumber; j++)
            primaryCellDataArray[j] = randomWord(); //заполнение массива значений ключа
        let otherCellDataArray: CellArray = [] // создание массива для значений строки
        for(let j = 0; j < rowSize; j++) //заполнение массива значений строки
            otherCellDataArray[j] = Math.floor(Math.random()*1000); // запись значений в массив
        contentMap.set(primaryCellDataArray, otherCellDataArray); //создание пар ключ-значение для данных
    }
    return contentMap;
}

//рандомная строка
function randomWord():string {
    const words = ['Вахта','Вакцина','Отечество','Владения','Овца','Решительность',
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
