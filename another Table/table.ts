//объявление новых типов двнных для сокращения кода
type Cell = string|number;
type CellArray = Array<Cell>;

class HeaderTable{
    divTableHead = document.createElement('div');
    private tableEl: HTMLTableElement = document.createElement('table'); //создание таблицы в DOM

    private thead: HTMLTableSectionElement = document.createElement('tbody'); //создание тела таблицы в DOM
    constructor(keyNumber, rowSize){
        this.tableEl.appendChild(this.thead); //выделение в таблице места для данных
        const htmlRow: HTMLTableRowElement = document.createElement('tr');
        for(let i = 0; i < keyNumber; i++){
            let htmlCell: HTMLTableCellElement = document.createElement('th'); // создание ячейки строки
            htmlCell.innerHTML = 'key: '+(i+1);
            htmlRow.appendChild(htmlCell);
        }
        for(let i = 0; i<rowSize;i++){
            let htmlCell: HTMLTableCellElement = document.createElement('th'); // создание ячейки строки
            htmlCell.innerHTML = randomWord();
            htmlRow.appendChild(htmlCell);
        }
        this.thead.appendChild(htmlRow);
        this.divTableHead.className = 'scroll-table';
        this.divTableHead.appendChild(this.tableEl);
    }
}

// класс для построения таблицы
class TableCell {
    divTableBody = document.createElement('div');
    private tableEl: HTMLTableElement = document.createElement('table'); //создание таблицы в DOM

    private tbody: HTMLTableSectionElement = document.createElement('tbody'); //создание тела таблицы в DOM

    //создание элементов таблицы
    constructor(tableMap: Map<CellArray, CellArray>){
        this.tableEl.appendChild(this.tbody); //выделение в таблице места для данных
        tableMap.forEach((value: CellArray, key: CellArray) => { //создание каждой строки
            this.tbody.appendChild(this.createHTMLRow(key, value));
        });
        this.divTableBody.className = 'scroll-table-body';
        this.divTableBody.appendChild(this.tableEl);
    }

    // создание строк
    private createHTMLRow(primaryCell: CellArray, otherCellArray: CellArray): HTMLTableRowElement {
        const htmlRow: HTMLTableRowElement = document.createElement('tr'); // создание строки (как элемента таблицы DOM)
        primaryCell.forEach((keys) => { // заполнение первого столбца таблицы
            htmlRow.appendChild(this.createHTMLCell(keys));
        });
        otherCellArray.forEach(others => { //зполнение последующих столбцов таблицы
            htmlRow.appendChild(this.createHTMLCell(others));
        });
        return htmlRow
    }

    // заполнение строк
    private createHTMLCell(cell:Cell): HTMLTableCellElement{
        const htmlCell: HTMLTableCellElement = document.createElement('td'); // создание ячейки строки
        htmlCell.innerHTML = <string>cell; //заполнение ячейки строки
        return htmlCell
    }
}

// создание и заполнение MAP
function createTableMap(keyNumber: number, columnNumber: number, rowSize: number): Map<CellArray, CellArray> {
    let tableMap = new Map(); //создание MAP
    for(let i = 0; i < columnNumber; i++){
        let primaryCellDataArray: CellArray = []; //создание массива для значений ключа
        for(let j = 0; j < keyNumber; j++)
            primaryCellDataArray[j] = randomWord(); //заполнение массива значений ключа
        let otherCellDataArray: CellArray = [] // создание массива для значений строки
        for(let j = 0; j < rowSize; j++) //заполнение массива значений строки
            otherCellDataArray[j] = Math.floor(Math.random()*1000); // запись значений в массив
        tableMap.set(primaryCellDataArray, otherCellDataArray); //создание пар ключ-значение для данных
    }
    return sortMap(tableMap);
}

//сортировка только по ключу
function sortMap(oldTableMap: Map<CellArray, CellArray>): Map<CellArray, CellArray>{
    return new Map([...oldTableMap.entries()].sort(
        (firstKeyArray, secondKeyArray) => firstKeyArray[0] > secondKeyArray[0] ? 1 : firstKeyArray[0] < secondKeyArray[0] ? -1 : 0
    ));
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
    // let randomWord = words[Math.floor(Math.random()*100)];
    // return randomWord;
    return words[Math.floor(Math.random()*100)];
}

let keyNumber = 3;
let rowSize = 5;
let tableHead = new HeaderTable(keyNumber, rowSize);
let tableBody = new TableCell(createTableMap(keyNumber, /*columnNumber*/ 100, rowSize)); // создание таблицы
tableHead.divTableHead.appendChild(tableBody.divTableBody);
document.body.append(tableHead.divTableHead); //выделение в DOM места для таблицы-заголовка
// document.body.append(tableBody.divTable); //выделение в DOM места для таблицы-тела
