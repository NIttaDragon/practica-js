// класс для построения таблицы
abstract class TableFragment {
    protected tableEl : HTMLTableElement;
    protected tbody : HTMLTableSectionElement;
    protected tfoot : HTMLTableSectionElement;
    protected tableEntriesIterator; //итератор для перебора значений MAP
    protected rowArray = []; //массив для значений строки
    protected globalKeyNumber : number; //глобальная переменная для хранения количества ключей
    protected globalRowLong : number; //глобальная переменная для хранения длины строк
    protected globalColumnNumber : number; //глобальная переменная для хранения количества строк вообще

    private wrapper : HTMLDivElement;
    private content : Map<CellArray, CellArray>;

    //создание элементов таблицы
    protected constructor(contentMap, hasTotalRow){
        this.createEmptyHTMLTable();
        this.content = this.sortMap(contentMap);
        this.tableEntriesIterator = this.content.entries();
        this.globalColumnNumber = this.content.size;
    }

    //создание пустой таблицы из элементов
    private createEmptyHTMLTable(){
        this.wrapper = this.createEmptyHTMLDivElement('wrapper');
        this.tableEl = this.createEmptyHTMLTableElement('table');
        this.tbody = this.createEmptyHTMLTBodyElement('tbody');
        this.tfoot = this.createEmptyHTMLTFootElement('tfoot');
        this.tableEl.appendChild(this.tbody);
        this.tableEl.appendChild(this.tfoot);
        this.wrapper.appendChild(this.tableEl);
        document.body.append(this.wrapper);
    }

    // создание пустого tfoot элемента
    private createEmptyHTMLTFootElement(className){
        const newHTMLTFootElement : HTMLTableSectionElement = document.createElement('tfoot');
        newHTMLTFootElement.className = className;
        return newHTMLTFootElement
    }
    //создание пустого table элемента
    private createEmptyHTMLTableElement(className : string) : HTMLTableElement{
        const newHTMLTable : HTMLTableElement = document.createElement('table');
        newHTMLTable.className = className;
        return newHTMLTable
    }

    //создание пустого tbody элемента
    private createEmptyHTMLTBodyElement(className : string) :HTMLTableSectionElement{
        const newHTMLTBodyElement : HTMLTableSectionElement = document.createElement('tbody');
        newHTMLTBodyElement.className = className;
        return newHTMLTBodyElement
    }

    //сортировка MAP по ключу
    private sortMap(contentMap: Map<CellArray, CellArray>): Map<CellArray, CellArray>{
        return new Map([...contentMap.entries()].sort(
            (firstKeyArray : [CellArray, CellArray], secondKeyArray : [CellArray, CellArray]) : number => firstKeyArray[0] > secondKeyArray[0] ? 1 : firstKeyArray[0] < secondKeyArray[0] ? -1 : 0
        ));
    }

    // заполнение строк
    private createHTMLCell(cell:Cell): HTMLTableCellElement{
        const htmlCell : HTMLTableCellElement = this.createEmptyHTMLCell();
        htmlCell.innerHTML = <string>cell;
        return htmlCell
    }

    //заполнение строки итогов
    protected fillTotalRow(){
        const keyArray : string[] = ['Total:'];
        for (let i : number= 1; i < this.globalKeyNumber; i++)
            keyArray[i] = '';
        const totalSummArray = Array(this.globalRowLong).fill(0);
        const rowsNumber : number = this.rowArray.length;
        for(let i : number= 0; i < rowsNumber; i++){
            const someArray = this.rowArray.shift();
            for(let j: number = 0; j < this.globalRowLong; j++)
                totalSummArray[j] += someArray[j];
        }
        return [keyArray, totalSummArray]
    }

    //создание пустого div элемента
    protected createEmptyHTMLDivElement(className:string) : HTMLDivElement{
        const newDivElement : HTMLDivElement = document.createElement('div');
        newDivElement.className = className;
        newDivElement.id = className;
        return newDivElement
    }

    //создание пустой строки tr
    protected createEmptyHTMLRow() :HTMLTableRowElement{
        return document.createElement('tr')
    }

    //создание пустой ячейки td
    protected createEmptyHTMLCell() :HTMLTableCellElement{
        return document.createElement('td');
    }

    //создание строки итогов
    protected appendTotalRow(): void {
        const totalRowCellArray = this.fillTotalRow()
        const totalRow : HTMLTableRowElement = this.createHTMLRow(totalRowCellArray[0], totalRowCellArray[1]);
        totalRow.className = 'total'; //присвоение класса
        this.tableEl.insertAdjacentElement('beforeend', totalRow);
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

    // создание строк
    protected createHTMLRow(primaryCell: CellArray, otherCellArray: CellArray): HTMLTableRowElement {
        const htmlRow :HTMLTableRowElement = this.createEmptyHTMLRow();
        primaryCell.forEach((keys : Cell) : void => {
            htmlRow.appendChild(this.createHTMLCell(keys));
        });
        otherCellArray.forEach(others => {
            htmlRow.appendChild(this.createHTMLCell(others));
        });
        return htmlRow
    }
}

// класс загрузки скроллом
class LazyTable extends TableFragment {

    constructor(content, hasTotalRow) {
        super(content, hasTotalRow);
        this.appendRows(100);
        this.addScrollListeners();
        if (hasTotalRow === true)  this.appendTotalRow();
    }

    //обработчик скролла
    private addScrollListeners(){
        document.addEventListener("scroll", ()=>{
            if (this.findCoords() === true)  this.appendRows(1);
        });
    }

    //нахождение разницы координат последней строки и экрана браузера
    private findCoords() : boolean{
        const windowHeight: number = document.documentElement.clientHeight;
        const lastRowCoord:DOMRect = this.tbody.lastElementChild.getBoundingClientRect();
        return lastRowCoord.bottom - windowHeight < 10
    }
}

// класс загрузки по кнопке
class ButtonedTable extends TableFragment {
    private totalRow : boolean;

    constructor(content, hasTotalRow) {
        super(content, hasTotalRow);
        this.totalRow = hasTotalRow;
        this.appendRows(100);
        this.createButton();
        this.addClickListener();
        if (this.totalRow === true)  this.appendTotalRow();
    }

    //кнопка для загрузки строк
    private createButton() :void{
        const htmlRow : HTMLTableRowElement = this.createEmptyHTMLRow();
        htmlRow.className = 'button';
        const htmlCell : HTMLTableCellElement = this.createEmptyHTMLCell();
        htmlCell.colSpan  = this.globalRowLong + this.globalKeyNumber;
        htmlCell.innerHTML = 'Показать ещё';
        htmlRow.appendChild(htmlCell);
        this.tfoot.appendChild(htmlRow);
    }

    //обработчик кнопки
    private addClickListener(){
        window.addEventListener('DOMContentLoaded', event =>{ //вызов обработчика событий кнопки после создания кнопки
            const tableButton:HTMLElement = document.querySelector('.button');
            const handleClick = () =>{
                this.appendRows(50);
            }
            tableButton.addEventListener('click', handleClick);
        })
    }
}

// класс загрузки по страницам
class PagintedTable extends TableFragment {
    private totalRow : boolean;
    constructor(content, hasTotalRow) {
        super(content, hasTotalRow);
        this.totalRow = hasTotalRow;
        this.createPageButton();
        this.createCellTables();
        this.addLister();
    }

    //обработчик пагинатора
    private addPaginationListener(i){
        window.addEventListener('DOMContentLoaded', event =>{ //вызов обработчика событий кнопки после создания кнопки
            let tableButton: HTMLElement = document.getElementById('button '+(i+1)+'-'+(i+100));
            const handleClick = () =>{
                let k: number = 0;
                do{
                    const htmlDiv : HTMLElement = document.getElementById('page '+(k+1)+'-'+(k+100));
                    htmlDiv.style.display = 'none';
                    const totalRow : HTMLElement = document.getElementById('total '+(k+1)+'-'+(k+100));
                    totalRow.style.display = 'none';
                    k += 100;
                }while (k < this.globalColumnNumber);
                const htmlDiv : HTMLElement = document.getElementById('page '+(i+1)+'-'+(i+100));
                htmlDiv.style.display = 'block';
                const totalRow : HTMLElement = document.getElementById('total '+(i+1)+'-'+(i+100));
                totalRow.style.display = 'block';
            }
            tableButton.addEventListener('click', handleClick);
        })
    }

    // создание "страниц" с разделами таблицы
    private createCellTables(){
        let i : number = 0;
        do{
            const newDiv = this.createEmptyHTMLDivElement('page '+(i+1)+'-'+(i+100));
            for(let k:number = 0; k< 100; k++){
                const rowEntry = this.tableEntriesIterator.next().value;
                if(rowEntry === undefined)  return; //MAP закончился
                else { //MAP не закончился
                    this.globalKeyNumber = rowEntry[0].length;
                    this.globalRowLong = rowEntry[1].length;
                    this.rowArray.push(rowEntry[1]);
                }
                const htmlRow :HTMLTableRowElement = this.createHTMLRow(rowEntry[0], rowEntry[1]);
                newDiv.appendChild(htmlRow);
            }
            if (this.totalRow === true) this.appendTotalRow(i);
            i += 100;
            newDiv.style.display = 'none';
            this.tbody.appendChild(newDiv);
        } while (i<this.globalColumnNumber);
    }

    // создание кнопок для переключения страниц
    private createPageButton(){
        const htmlRow :HTMLTableRowElement = this.createEmptyHTMLRow();
        htmlRow.className = 'buttons';
        let i : number = 0;
        do{
            const htmlCell :HTMLTableCellElement = this.createEmptyHTMLCell();
            let idNameString : string = 'button '+(i+1)+'-'+(i+100);
            htmlCell.id = idNameString;
            htmlCell.innerHTML = idNameString;
            htmlRow.appendChild(htmlCell);
            i += 100;
        } while (i<this.globalColumnNumber);
        // this.tfoot.appendChild(htmlRow);
        this.tableEl.insertAdjacentElement('afterend', htmlRow);
    }

    // присвоение обработчика событий всем кнопкам
    private addLister(){
        let i : number = 0;
        do{
            this.addPaginationListener(i);
            i +=100;
        }while (i < this.globalColumnNumber);
    }

    //создание строки итогов
    private appendTotalRow(i : number): void {
        const totalRowCellArray = this.fillTotalRow()
        const totalRow : HTMLTableRowElement = this.createHTMLRow(totalRowCellArray[0], totalRowCellArray[1]);
        totalRow.id = 'total '+(i+1)+'-'+(i+100);
        totalRow.className = 'total';//присвоение класса
        totalRow.style.display = 'none';
        this.tfoot.appendChild(totalRow);
    }
}
