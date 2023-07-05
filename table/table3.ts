//объявление новых типов двнных для сокращения кода
type Cell = string|number;
type PrimaryCell = Cell;
type OtherCellArray = Array<Cell>;

// класс для обработки массива и построения таблицы
class Table {
  tableEl:HTMLTableElement = document.createElement('table'); //создание таблицы в DOM

  private tbody:HTMLTableSectionElement = document.createElement('tbody'); //создание тела таблицы в DOM

  //общее создание таблицы
  constructor(tableMap:Map<PrimaryCell, OtherCellArray>){
    this.tableEl.appendChild(this.tbody); //выделение в таблице места для данных
    tableMap.forEach((value:OtherCellArray, key: PrimaryCell) => { //создание каждой строки
      this.tbody.appendChild(this.createHTMLRow(key, value));
    });
  }

  // создание строк
  private createHTMLRow(primaryCell:PrimaryCell, otherCellArray:OtherCellArray):HTMLTableRowElement{
    const htmlRow:HTMLTableRowElement = document.createElement('tr');
    htmlRow.appendChild(this.createHTMLCell(primaryCell)); // заполнение первого столбца таблицы
    otherCellArray.forEach(cell => { //зполнение последующих столбцов таблицы
      htmlRow.appendChild(this.createHTMLCell(cell));
    });
    return htmlRow
  }

  // заполнение строк
  private createHTMLCell(cell:Cell):HTMLTableDataCellElement{
    const htmlCell:HTMLTableDataCellElement = document.createElement('td');
    htmlCell.innerHTML = <string>cell;
    return htmlCell
  }
}

// создание MAP
function createTableMap(columnNumber:number, rowSize:number):Map<PrimaryCell, OtherCellArray>{
  let tableMap = new Map();
  for(let i = 0; i < columnNumber; i++){
    let data:OtherCellArray = [] // создание массива для значений строки
    for(let j = 0; j < rowSize-1; j++)
      data[j] = Math.floor(Math.random()*1000); // запись знаяений в массив
    tableMap.set(randomWord(i), data); //создание пар ключ-значение для данных
  }
  console.log(tableMap);
  return tableMap
}

//рандомные слова
function randomWord(i:number):string {
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
  return words[i];
}

let table = new Table(createTableMap(100, 10)); // создание таблицы
document.body.append(table.tableEl); //выделение в DOM места для таблицы
