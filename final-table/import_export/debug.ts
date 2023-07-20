import {RenderType, sTO, CellArray} from './entities.js';
import {LazyTable} from "./LazyLoading.js";
import {ButtonedTable} from "./ButtonLoading.js";
import {PagintedTable} from "./PaginatedTable.js";

// выбор загрузки таблицы
const newTable : LazyTable | ButtonedTable | PagintedTable  = (sTO.renderType === RenderType.LazyLoading) ?
    new LazyTable(createContentMap(), sTO) : (sTO.renderType === RenderType.ButtonLoading) ?
        new ButtonedTable(createContentMap(), sTO) :
        new PagintedTable(createContentMap(), sTO);

// создание и заполнение MAP
function createContentMap(keysSize: number = 2, valuesSize: number = 5, height: number = 300): Map<CellArray, CellArray> {
    const contentMap: Map<CellArray, CellArray>  = new Map(); //создание MAP
    for(let i : number = 0; i < height; i++){
        const primaryCellDataArray: CellArray = []; //создание массива для значений ключа
        for(let j : number = 0; j < keysSize; j++)
            primaryCellDataArray[j] = randomWord(); //заполнение массива значений ключа
        const otherCellDataArray: CellArray = [] // создание массива для значений строки
        for(let j : number = 0; j < valuesSize; j++) //заполнение массива значений строки
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
