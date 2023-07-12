//объявление новых типов двнных для сокращения кода
type Cell = string|number;
type CellArray = Array<Cell>;

// класс для построения таблицы
class CreateTable {
    wrapper = document.createElement('div'); //создание блока под таблицу в DOM
    private tableEl: HTMLTableElement = document.createElement('table'); //создание таблицы в DOM
    private tbody = document.createElement('tbody'); //создание тела таблицы в DOM
    private tableEntriesIterator; //итератор для перебора значений MAP
    private hasTotalRow = false; //итоговая строка таблицы
    private rowArray = []; //массив для значений строки
    private globalKeyNumber; //глобальная переменная для хранения количества ключей
    private globalRowLong; //глобальная переменная для хранения длины строк

    //создание элементов таблицы
    constructor(contentMap, hasLazyLoading){
        this.wrapper.className = 'wrapper'; //присвоение класса блоку под таблицу
        this.tableEl.appendChild(this.tbody); //выделение в таблице места для данных
        const content = this.sortMap(contentMap); //сортировка входных данных
        this.tableEntriesIterator = content.entries(); //присвоение итератору значения
        this.appendRows(20); //создание нескольких начальных строк
        if(hasLazyLoading === true){
            this.createButton(); //создание кнопки для подгузки дополнительных строк
            this.addClickListener(); //подключение события кнопки
        }
        else  this.addScrollListeners(); //подключение скролла
        this.wrapper.appendChild(this.tableEl); //вставка в блок таблицы
        document.body.append(this.wrapper); //выделение в DOM места для таблицы
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
            const tableButton:HTMLElement = document.querySelector('.button'); //поиск кнопки
            const handleClick = () =>{ //функция по нажатию
                this.appendRows(20);
            }
            tableButton.addEventListener('click', handleClick); //конект объекта, действия и функции
        })
    }

    //обработчик скролла
    private addScrollListeners(){
        document.addEventListener("scroll", ()=>{
            if(this.findCoords()===true)
                this.appendRows(1); //добавление строки по необходимости
        });
    }

    //нахождение разницы координат последней строки и экрана браузера
    private findCoords():boolean{
        let windowHeight = document.documentElement.clientHeight; //нахождение высоты окна браузера
        let lastRowCoord = this.tbody.lastElementChild.getBoundingClientRect(); // получение координат последней строки
        return lastRowCoord.bottom-windowHeight < 10 //последний элемент близко к границе экрана
    }

    //кнопка для загрузки строк, чтобы корректно работал скролл
    private createButton(){
        let htmlRow = this.createEmptyHTMLRow(); //создание строки
        htmlRow.className = 'button'; //присвоение класса
        let htmlCell = this.createEmptyHTMLCell(); // создание ячейки строки
        htmlCell.colSpan  = this.globalRowLong + this.globalKeyNumber;
        htmlCell.innerHTML = 'Показать ещё'; //заполнение ячейки строки
        htmlRow.appendChild(htmlCell); //запись ячейки в строку
        this.tableEl.appendChild(htmlRow); //добавление кнопки в таблицу
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
            const rowEntry = this.tableEntriesIterator.next().value; //получение значений для новой строки
            if(this.hasTotalRow === false){ //строки с итогами ещё нет
                if(rowEntry === undefined){ //MAP закончился
                    this.appendTotalRow(); //добавление строки итогов
                    this.hasTotalRow = true; //переключение флага наличия строки итогов
                }
                else { //MAP не закончился
                    this.globalKeyNumber = rowEntry[0].length; //запись количества ключей в глобальную переменную
                    this.globalRowLong = rowEntry[1].length; //запись длины строки в глобальную переменную
                    this.rowArray.push(rowEntry[1]); //запись данных строки в массив строк
                    this.tbody.appendChild(this.createHTMLRow(rowEntry[0], rowEntry[1])); //добавление новой строки в таблицу
                }
            } else break; //появилась строка итогов
        }
    }

    //создание строки итогов
    private appendTotalRow(){
        let totalRowAfterFill = this.fillTotalRow()
        let totalRow = this.createHTMLRow(totalRowAfterFill[0], totalRowAfterFill[1]); //создание и заполнение строки итогов
        totalRow.className = 'total'; //присвоение класса
        this.tableEl.insertAdjacentElement('beforeend', totalRow); //вставка строки итогов в таблицу после основных строк
        if(hasLazyLoading()===true){
            const tableButton:HTMLElement = document.querySelector('.button');
            tableButton.parentNode.removeChild(tableButton);
        }
    }

    //заполнение строки итогов
    private fillTotalRow(){
        let keyArray = ['Total:']; //ключ в первом столбце
        for (let i= 1; i < this.globalKeyNumber; i++) //остальные ключи пустые
            keyArray[i] = '';
        let totalSummArray = Array(this.globalRowLong).fill(0); //массив для суммирования значений таблицы
        let lengh = this.rowArray.length; //вычисление количества строк
        for(let i= 0; i < lengh; i++){
            let someArray = this.rowArray.shift(); //взятие первого элемента из массива строк с последующим удалением
            for(let j= 0; j < this.globalRowLong; j++)
                totalSummArray[j] += someArray[j]; //суммирование по всем строкам
        }
        return [keyArray, totalSummArray]
    }

    // создание строк
    private createHTMLRow(primaryCell: CellArray, otherCellArray: CellArray): HTMLTableRowElement {
        const htmlRow = this.createEmptyHTMLRow(); // создание строки (как элемента таблицы DOM)
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
        const htmlCell = this.createEmptyHTMLCell(); // создание ячейки строки
        htmlCell.innerHTML = <string>cell; //заполнение ячейки строки
        return htmlCell
    }
}

//выбор кнопки или скролла
function hasLazyLoading(){
    return true
}
let table = new CreateTable(createContentMap(3,100, 6), hasLazyLoading()); // создание таблицы

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
