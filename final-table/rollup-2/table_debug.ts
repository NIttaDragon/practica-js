import {TableOptionsFragment, Cell, CellArray} from './entities.js';

// класс для построения таблицы
export abstract class TableFragment {
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
    protected constructor(contentMap, sto : TableOptionsFragment){
        this.createEmptyHTMLTable(sto.target, sto.position);
        this.content = this.sortMap(contentMap);
        this.tableEntriesIterator = this.content.entries();
        this.globalColumnNumber = this.content.size;
    }

    //создание пустой таблицы из элементов
    private createEmptyHTMLTable(tableLocation, position) : void {
        this.tableEl = this.createHTMLElementWithClass('table', 'table');
        this.tbody = this.createHTMLElementWithClass('tbody', 'tbody');
        this.tfoot = this.createHTMLElementWithClass('tfoot', 'tfoot');
        this.tableEl.appendChild(this.tbody);
        this.tableEl.appendChild(this.tfoot);
        if(!!position)
            tableLocation.insertAdjacentElement(position, this.tableEl)
        else
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
    private createHTMLCell(cell : Cell): HTMLTableCellElement{
        const htmlCell : HTMLTableCellElement = this.createHTMLElement('td');
        htmlCell.innerHTML = <string>cell;
        return htmlCell
    }

    //заполнение строки итогов
    protected fillTotalRow(){
        const totalSummArray = Array(this.globalRowLong).fill(0);
        const rowsNumber : number = this.rowArray.length;
        for(let i : number= 0; i < rowsNumber; i++){
            const someArray = this.rowArray.shift();
            for(let j: number = 0; j < this.globalRowLong; j++)
                totalSummArray[j] += someArray[j];
        }
        return totalSummArray
    }

    //создание строки итогов
    protected appendTotalRow() {
        const totalRowCellArray = this.fillTotalRow()
        const totalRow : HTMLTableRowElement = this.createHTMLTotalRow('Total', totalRowCellArray);
        totalRow.className = 'total'; //присвоение класса
        return totalRow;
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

    protected createHTMLTotalRow(stringName, cells){
        const htmlRow :HTMLTableRowElement = this.createHTMLElement('tr');
        const htmlCell : HTMLTableCellElement = this.createHTMLElement('td');
        htmlCell.innerHTML = stringName;
        htmlCell.colSpan = this.globalKeyNumber;
        htmlRow.appendChild(htmlCell);
        cells.forEach((others : Cell) => {
            htmlRow.appendChild(this.createHTMLCell(others));
        });
        return htmlRow
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