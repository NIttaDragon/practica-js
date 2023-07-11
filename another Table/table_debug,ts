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
    private globalKeyNumber;
    private globalRowLong;

    //создание элементов таблицы
    constructor(contentMap, keyNumber, rowLong){
        this.wrapper.className = 'wrapper';
        this.tableEl.appendChild(this.tbody); //выделение в таблице места для данных
        this.globalKeyNumber = keyNumber;
        this.globalRowLong = rowLong;
        //вывод на экран пользователя несколько началльных элементов таблицы
        this.tableEntriesIterator = contentMap.entries();
        this.appendRows(20/*, keyNumber, rowLong*/);
        //обработчик скролла
        document.addEventListener("scroll", ()=>{
            let windowHeight = document.documentElement.clientHeight; //нахождение высоты окна браузера
            let lastRowCoord = this.tbody.lastElementChild.getBoundingClientRect(); // получение координат последней строки
            let isNeedToAddRow = Math.abs(windowHeight - lastRowCoord.bottom) < 10; //проверка расстояния между окном браузера и концом таблицы
            if(isNeedToAddRow)  this.appendRows(1/*, keyNumber, rowLong*/); //добавление строки по необходимости
        });
        this.wrapper.appendChild(this.tableEl);
    }

    private appendRows(size: number/*, keyNumber, rowLong*/){
        for(let j= 0; j < size; j++){
            const rowEntry = this.tableEntriesIterator.next().value; //получение значений для новой строки
            if(this.hasTotalRow == false && rowEntry == undefined) { //создание строки с итогами
                this.hasTotalRow = true;
                this.appendTotalRow(/*keyNumber, rowLong*/);
            }
            else if(this.hasTotalRow != true){
                this.rowArray.push(rowEntry[1]);
                this.tbody.appendChild(this.createHTMLRow(rowEntry[0], rowEntry[1])); //добавление новой строки в таблицу
            } else if(this.hasTotalRow == true)
                break;
        }
    }

    private appendTotalRow(/*keyNumber, rowlong*/){
        let totalRow = document.createElement('tr');
        const zeroKey: HTMLTableCellElement = document.createElement('td'); // создание ячейки строки
        zeroKey.innerHTML = 'Total:';
        totalRow.appendChild(zeroKey);
        for(let i= 1; i < this.globalKeyNumber; i++){
            const zeroKey: HTMLTableCellElement = document.createElement('td'); // создание ячейки строки
            zeroKey.innerHTML = '';
            totalRow.appendChild(zeroKey);
        }
        let someArray2 = [];
        for(let j = 0; j < this.globalRowLong; j++)
            someArray2[j] = 0;
        let lengh = this.rowArray.length;
        for(let i= 0; i < lengh; i++){
            let someArray = this.rowArray.shift();
            for(let j= 0; j < this.globalRowLong; j++)
                someArray2[j] += someArray[j];
        }
        for(let i= 0; i < this.globalRowLong; i++){
            const totalColumnSumm: HTMLTableCellElement = document.createElement('td'); // создание ячейки строки
            totalColumnSumm.innerHTML = <string>(<unknown>someArray2[i]);
            totalRow.appendChild(totalColumnSumm);
        }
        this.tbody.insertAdjacentElement('beforeend', totalRow);
    }

    // создание строк
    createHTMLRow(primaryCell: CellArray, otherCellArray: CellArray): HTMLTableRowElement {
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

let table = new CreateTable(createContentMap(3,100, 12), 3,12); // создание таблицы
document.body.append(table.wrapper); //выделение в DOM места для таблицы

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
    return sortMap(contentMap); // сортировка полученного MAP
}

//сортировка MAP по ключу
function sortMap(contentMap: Map<CellArray, CellArray>): Map<CellArray, CellArray>{
    return new Map([...contentMap.entries()].sort(
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
