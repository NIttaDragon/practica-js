//объявление новых типов двнных для сокращения кода
type Cell = string|number;
type CellArray = Array<Cell>;

// класс для построения таблицы
class Table {

  tableEl: HTMLTableElement = document.createElement('table'); //создание таблицы в DOM

  private tbody: HTMLTableSectionElement = document.createElement('tbody'); //создание тела таблицы в DOM

  //создание элементов таблицы
  constructor(tableMap: Map<CellArray, CellArray>){
    this.tableEl.appendChild(this.tbody); //выделение в таблице места для данных
    tableMap.forEach((value: CellArray, key: CellArray) => { //создание каждой строки
      this.tbody.appendChild(this.createHTMLRow(key, value));
    });
  }

  // создание строк
  private createHTMLRow(primaryCell: CellArray, otherCellArray: CellArray): HTMLTableRowElement {
    const htmlRow: HTMLTableRowElement = document.createElement('tr'); // создание строки (как элемента таблицы DOM)
    primaryCell.forEach((primcell) => {
      htmlRow.appendChild(this.createHTMLCell(primcell));
    });
    // htmlRow.appendChild(this.createHTMLCell(primaryCell)); // заполнение первого столбца таблицы
    otherCellArray.forEach(othcell => { //зполнение последующих столбцов таблицы
      htmlRow.appendChild(this.createHTMLCell(othcell));
    });
    return htmlRow
  }

  // заполнение строк
  private createHTMLCell(cell:Cell): HTMLTableDataCellElement{
    const htmlCell: HTMLTableDataCellElement = document.createElement('td'); // создание ячейки строки
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
  console.time('fullSortMap');
  let fullSort = fullSortMap(tableMap);
  console.timeEnd('fullSortMap');
  console.time('sortMap');
  let sort = sortMap(tableMap);
  console.timeEnd('sortMap');
  return tableMap;
}

//сортировка только по ключу
function sortMap(oldTableMap: Map<CellArray, CellArray>): Map<CellArray, CellArray>{
  return new Map([...oldTableMap.entries()].sort(
    (firstKeyArray, secondKeyArray) => firstKeyArray[0] > secondKeyArray[0] ? 1 : firstKeyArray[0] < secondKeyArray[0] ? -1 : 0
  ));
}
//полная сортировка таблицы
function fullSortMap(oldTableMap: Map<CellArray, CellArray>): Map<CellArray, CellArray>{
  return new Map([...oldTableMap.entries()].sort());
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
  let randomString = words[Math.floor(Math.random()*100)];
  return randomString;
}

//функция задания индекса сортировки
function keySortingIndex(){
  return 2;
}

let table = new Table(createTableMap(/*keyNumber*/3, /*columnNumber*/ 1000, /*rowSize*/100)); // создание таблицы
document.body.append(table.tableEl); //выделение в DOM места для таблицы
