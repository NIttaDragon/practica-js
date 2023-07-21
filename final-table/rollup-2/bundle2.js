'use strict';

// некий элемент страницы, куда надо вставить таблицу
const tableLocation = document.createElement('div');
tableLocation.className = 'wrapper';
document.body.appendChild(tableLocation);
const sTO = {
    renderType: 2,
    hasTotalRow: true,
    target: tableLocation,
    position: 'beforeend'
};
var RenderType;
(function (RenderType) {
    RenderType[RenderType["LazyLoading"] = 0] = "LazyLoading";
    RenderType[RenderType["ButtonLoading"] = 1] = "ButtonLoading";
    RenderType[RenderType["PaginatedLoading"] = 2] = "PaginatedLoading";
})(RenderType || (RenderType = {}));

// класс для построения таблицы
class TableFragment {
    //создание элементов таблицы
    constructor(contentMap, sto) {
        this.rowArray = []; //массив для значений строки
        this.createEmptyHTMLTable(sto.target, sto.position);
        this.content = this.sortMap(contentMap);
        this.tableEntriesIterator = this.content.entries();
        this.globalColumnNumber = this.content.size;
    }
    //создание пустой таблицы из элементов
    createEmptyHTMLTable(tableLocation, position) {
        this.tableEl = this.createHTMLElementWithClass('table', 'table');
        this.tbody = this.createHTMLElementWithClass('tbody', 'tbody');
        this.tfoot = this.createHTMLElementWithClass('tfoot', 'tfoot');
        this.tableEl.appendChild(this.tbody);
        this.tableEl.appendChild(this.tfoot);
        if (!!position)
            tableLocation.insertAdjacentElement(position, this.tableEl);
        else
            tableLocation.appendChild(this.tableEl);
    }
    // создание пустых элементов
    createHTMLElementWithClass(tagName, className) {
        const newHTMLElement = this.createHTMLElement(tagName);
        newHTMLElement.className = className;
        return newHTMLElement;
    }
    createHTMLElementWithID(tagName, idName) {
        const newHTMLElement = this.createHTMLElement(tagName);
        newHTMLElement.id = idName;
        return newHTMLElement;
    }
    createHTMLElement(tagName) {
        return document.createElement(tagName);
    }
    //сортировка MAP по ключу
    sortMap(contentMap) {
        return new Map([...contentMap.entries()].sort((firstKeyArray, secondKeyArray) => firstKeyArray[0] > secondKeyArray[0] ? 1 : firstKeyArray[0] < secondKeyArray[0] ? -1 : 0));
    }
    // заполнение строк
    createHTMLCell(cell) {
        const htmlCell = this.createHTMLElement('td');
        htmlCell.innerHTML = cell;
        return htmlCell;
    }
    //заполнение строки итогов
    fillTotalRow() {
        const totalSummArray = Array(this.globalRowLong).fill(0);
        const rowsNumber = this.rowArray.length;
        for (let i = 0; i < rowsNumber; i++) {
            const someArray = this.rowArray.shift();
            for (let j = 0; j < this.globalRowLong; j++)
                totalSummArray[j] += someArray[j];
        }
        return totalSummArray;
    }
    //создание строки итогов
    appendTotalRow() {
        const totalRowCellArray = this.fillTotalRow();
        const totalRow = this.createHTMLTotalRow('Total', totalRowCellArray);
        totalRow.className = 'total'; //присвоение класса
        return totalRow;
    }
    //добавление новых строк в таблицу
    appendRows(size) {
        for (let j = 0; j < size; j++) {
            const rowEntry = this.tableEntriesIterator.next().value;
            if (rowEntry === undefined)
                return; //MAP закончился
            else { //MAP не закончился
                this.globalKeyNumber = rowEntry[0].length;
                this.globalRowLong = rowEntry[1].length;
                this.rowArray.push(rowEntry[1]);
                this.tbody.appendChild(this.createHTMLRow(rowEntry[0], rowEntry[1]));
            }
        }
    }
    createHTMLTotalRow(stringName, cells) {
        const htmlRow = this.createHTMLElement('tr');
        const htmlCell = this.createHTMLElement('td');
        htmlCell.innerHTML = stringName;
        htmlCell.colSpan = this.globalKeyNumber;
        htmlRow.appendChild(htmlCell);
        cells.forEach((others) => {
            htmlRow.appendChild(this.createHTMLCell(others));
        });
        return htmlRow;
    }
    // создание строк
    createHTMLRow(primaryCell, otherCellArray) {
        const htmlRow = this.createHTMLElement('tr');
        primaryCell.forEach((keys) => {
            htmlRow.appendChild(this.createHTMLCell(keys));
        });
        otherCellArray.forEach((others) => {
            htmlRow.appendChild(this.createHTMLCell(others));
        });
        return htmlRow;
    }
}

// класс загрузки скроллом
class LazyTable extends TableFragment {
    constructor(content, sto) {
        super(content, sto);
        this.appendRows(100);
        this.addScrollListeners();
        if (sto.hasTotalRow === true) {
            const totalRow = this.appendTotalRow();
            this.tfoot.insertAdjacentElement('beforeend', totalRow);
        }
    }
    //обработчик скролла
    addScrollListeners() {
        document.addEventListener("scroll", () => {
            if (this.findCoords() === true)
                this.appendRows(1);
        });
    }
    //нахождение разницы координат последней строки и экрана браузера
    findCoords() {
        const windowHeight = document.documentElement.clientHeight;
        const lastRowCoord = this.tbody.lastElementChild.getBoundingClientRect();
        return lastRowCoord.bottom - windowHeight < 10;
    }
}

// класс загрузки по кнопке
class ButtonedTable extends TableFragment {
    constructor(content, sto) {
        super(content, sto);
        this.appendRows(100);
        this.createButton();
        this.addClickListener();
        if (sto.hasTotalRow === true) {
            const totalRow = this.appendTotalRow();
            this.tfoot.insertAdjacentElement('beforeend', totalRow);
        }
    }
    //кнопка для загрузки строк
    createButton() {
        const htmlRow = this.createHTMLElement('tr');
        htmlRow.className = 'button';
        const htmlCell = this.createHTMLElement('td');
        htmlCell.colSpan = this.globalRowLong + this.globalKeyNumber;
        htmlCell.innerHTML = 'Показать ещё';
        htmlCell.colSpan = this.globalKeyNumber + this.globalRowLong;
        htmlRow.appendChild(htmlCell);
        this.tfoot.appendChild(htmlRow);
    }
    //обработчик кнопки
    addClickListener() {
        window.addEventListener('DOMContentLoaded', () => {
            const tableButton = document.querySelector('.button');
            const handleClick = () => {
                this.appendRows(50);
            };
            tableButton.addEventListener('click', handleClick);
        });
    }
}

// класс загрузки по страницам
class PagintedTable extends TableFragment {
    constructor(content, sto) {
        super(content, sto);
        this.tableMap = content;
        this.totalRow = sto.hasTotalRow;
        this.createPageButton();
        this.createCellTables();
        this.addLister();
    }
    // создание "страниц" со строками таблицы
    createCellTables() {
        let i = 0;
        this.pageArray = new Array(Math.floor(this.tableMap.size / 100)); // i - номер страницы, j - строка на странице
        this.totalArray = new Array(Math.floor(this.tableMap.size / 100));
        do {
            this.pageArray[i] = new Array(100);
            for (let k = 0; k < 100; k++) {
                this.pageArray[i][k] = this.fillPageArray();
            }
            if (this.totalRow === true) {
                this.totalArray[i] = new Array(2);
                this.totalArray[i][0] = 'Total';
                this.totalArray[i][1] = this.fillTotalRow();
            }
            i++;
        } while (i < Math.floor(this.tableMap.size / 100));
        this.addPage(0);
    }
    // заполнение "страницы"
    fillPageArray() {
        const rowEntry = this.tableEntriesIterator.next().value;
        if (rowEntry === undefined)
            return; //MAP закончился
        else { //MAP не закончился
            this.globalKeyNumber = rowEntry[0].length;
            this.globalRowLong = rowEntry[1].length;
            this.rowArray.push(rowEntry[1]);
        }
        return rowEntry;
    }
    // добавление содержимого на страницу
    addPage(i) {
        for (let j = 0; j < 100; j++) {
            let cells = this.pageArray[i][j];
            this.tbody.appendChild(this.createHTMLRow(cells[0], cells[1]));
        }
        if (this.totalRow === true) {
            let newTRow = this.createHTMLTotalRow(this.totalArray[i][0], this.totalArray[i][1]);
            newTRow.className = 'total';
            this.tfoot.insertAdjacentElement('afterbegin', newTRow);
        }
    }
    // создание кнопок для переключения страниц
    createPageButton() {
        const buttonDiv = this.createHTMLElementWithClass('div', 'butDiv');
        let i = 0;
        let k = 0;
        do {
            const buttons = this.createHTMLElement('button');
            buttons.className = 'button';
            buttons.id = 'button ' + i;
            buttons.innerHTML = 'button ' + (k + 1) + '-' + (k + 100);
            buttonDiv.appendChild(buttons);
            i++;
            k += 100;
        } while (i < Math.floor(this.tableMap.size / 100));
        this.tfoot.appendChild(buttonDiv);
    }
    //обработчик пагинатора
    addPaginationListener(i) {
        window.addEventListener('DOMContentLoaded', () => {
            let tableButton = document.getElementById('button ' + i);
            const handleClick = () => {
                this.tbody.innerHTML = ''; // удаляет все дочерние элементы
                // но если бы были обработчики памяти - привело бы к утечке информации
                if (this.totalRow === true) {
                    const htmlTRow = document.querySelector('.total');
                    this.tfoot.removeChild(htmlTRow);
                    this.addPage(i);
                }
            };
            tableButton.addEventListener('click', handleClick);
        });
    }
    // присвоение обработчика событий всем кнопкам
    addLister() {
        let i = 0;
        do {
            this.addPaginationListener(i);
            i++;
        } while (i < Math.floor(this.tableMap.size / 100));
    }
}

// выбор загрузки таблицы
(sTO.renderType === RenderType.LazyLoading) ?
    new LazyTable(createContentMap(), sTO) : (sTO.renderType === RenderType.ButtonLoading) ?
    new ButtonedTable(createContentMap(), sTO) :
    new PagintedTable(createContentMap(), sTO);
// создание и заполнение MAP
function createContentMap(keysSize = 2, valuesSize = 5, height = 300) {
    const contentMap = new Map(); //создание MAP
    for (let i = 0; i < height; i++) {
        const primaryCellDataArray = []; //создание массива для значений ключа
        for (let j = 0; j < keysSize; j++)
            primaryCellDataArray[j] = randomWord(); //заполнение массива значений ключа
        const otherCellDataArray = []; // создание массива для значений строки
        for (let j = 0; j < valuesSize; j++) //заполнение массива значений строки
            otherCellDataArray[j] = Math.floor(Math.random() * 1000); // запись значений в массив
        contentMap.set(primaryCellDataArray, otherCellDataArray); //создание пар ключ-значение для данных
    }
    return contentMap;
}
//рандомная строка
function randomWord() {
    const words = ['Вахта', 'Вакцина', 'Отечество', 'Владения', 'Овца', 'Решительность',
        'Рана', 'Опасность', 'Производство', 'Коммерция', 'Звание', 'Начало', 'Институт',
        'Происшествие', 'Икона', 'Полнота', 'Консерва', 'Доставка', 'Адмирал', 'Ассамблея',
        'Избыток', 'Муниципалитет', 'Руководство', 'Мышцы', 'Заболевание', 'Отзыв', 'Натура',
        'Дискотека', 'Монахиня', 'Биржа', 'Национализм', 'Претендент', 'Водитель', 'Пепел',
        'Продолжение', 'Забава', 'Диаметр', 'Огонь', 'Предание', 'Конверт', 'Всполох', 'Калий',
        'Барокко', 'Вертолёт', 'Добропорядочность', 'Закон', 'Пурпур', 'Наконечник', 'Республика',
        'Реклама', 'Единство', 'Истина', 'Попрошайка', 'Ветер', 'Намётка', 'Город', 'Благодарность',
        'Дом', 'Захоронение', 'Предпосылка', 'Мероприятие', 'Черпак', 'Лад', 'Ощущение', 'Вексель',
        'Купальник', 'Прикосновение', 'Приступ', 'Депо', 'Езда', 'Кольцо', 'Превышение', 'Факт',
        'Управление', 'Мгновенность', 'Достижение', 'Наличка', 'Вести', 'Регион', 'Пациент',
        'Орлан', 'Вывих', 'Низ', 'Плуг', 'Осторожность', 'Кадр', 'Горечь', 'Лиса', 'Инвестиции',
        'Деление', 'Интервал', 'Клуб', 'Понятие', 'Надежда', 'Равенство', 'Рубеж', 'Направление',
        'Мина', 'Прошлое', 'Построение'];
    return words[Math.floor(Math.random() * 100)];
}
