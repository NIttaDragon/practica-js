//объявление новых типов двнных для сокращения кода
type Cell = string|number;
type CellArray = Array<Cell>;

// класс для построения таблицы, которая движеться
class TableCell {
    wrapper = document.createElement('div'); //создание блока под таблицу в DOM
    private tableEl: HTMLTableElement = document.createElement('table'); //создание таблицы в DOM
    private tbody = document.createElement('tbody'); //создание тела таблицы в DOM
    private tableEntriesIterator;
    private mainMap = createTableMap(3,  1000, 12);

    //создание элементов таблицы
    constructor(){
        this.wrapper.className = 'wrapper';
        this.tableEl.appendChild(this.tbody); //выделение в таблице места для данных
        this.tableEntriesIterator = this.mainMap.entries();  //вывод на экран пользователя несколько началльных элементов таблицы
        for(let j= 0; j < 20; j++){
            const rowEntry = this.tableEntriesIterator.next().value;
            this.tbody.appendChild(this.createHTMLRow(rowEntry[0], rowEntry[1]));
            this.mainMap.delete(rowEntry[0]);
        }
        document.addEventListener("scroll", (event)=> {
            let rect = this.tbody.lastElementChild.getBoundingClientRect();
            if(rect.bottom<=740){
                const rowEntry = this.tableEntriesIterator.next().value;
                this.tbody.appendChild(this.createHTMLRow(rowEntry[0], rowEntry[1]));
                this.mainMap.delete(rowEntry[0]);
            }
        });
        this.wrapper.appendChild(this.tableEl);
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

let table = new TableCell(); // создание таблицы
document.body.append(table.wrapper); //выделение в DOM места для таблицы

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

//сортировка MAP по ключу
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
