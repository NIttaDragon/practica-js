// класс для построения таблицы
class TableFragment {
    private wrapper : HTMLDivElement;
    private tableEl : HTMLTableElement;
    private tbody : HTMLTableSectionElement;
    private tableEntriesIterator; //итератор для перебора значений MAP
    private rowArray = []; //массив для значений строки
    private globalKeyNumber : number; //глобальная переменная для хранения количества ключей
    private globalRowLong : number; //глобальная переменная для хранения длины строк
    private globalColumnNumber : number; //глобальная переменная для хранения количества строк вообще

    //создание элементов таблицы
    constructor(contentMap, option: TableOptions){
        this.createEmptyHTMLTable();
        const content = this.sortMap(contentMap);
        this.tableEntriesIterator = content.entries();
        this.globalColumnNumber = content.size;
        if (option.setLoading === 0) { //кнопка
            this.appendRows(100);
            this.createButton();
            this.addClickListener();
        }
        else if(option.setLoading === 1){
            this.appendRows(100);
            this.addScrollListeners(); //скролл
        } else if(option.setLoading === 2){
            this.createPageButton();
            this.createCellTables();
            this.addLister();
        }
        if (option.hasTotalRow === true)  this.appendTotalRow();
    }

    //создание пустой таблицы из элементов
    private createEmptyHTMLTable(){
        this.wrapper = this.createEmptyHTMLDivElement('wrapper');
        this.tableEl = this.createEmptyHTMLTableElement('table');
        this.tbody = this.createEmptyHTMLTBodyElement('tbody')
        this.tableEl.appendChild(this.tbody);
        this.wrapper.appendChild(this.tableEl);
        document.body.append(this.wrapper);
    }

    //создание пустого div элемента
    private createEmptyHTMLDivElement(className:string) : HTMLDivElement{
        const newDivElement : HTMLDivElement = document.createElement('div');
        newDivElement.className = className;
        newDivElement.id = className;
        return newDivElement
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

    //создание пустой строки tr
    private createEmptyHTMLRow() :HTMLTableRowElement{
        return document.createElement('tr')
    }

    //создание пустой ячейки td
    private createEmptyHTMLCell() :HTMLTableCellElement{
        return document.createElement('td');
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

    //обработчик скролла
    private addScrollListeners(){
        document.addEventListener("scroll", ()=>{
            if (this.findCoords() === true)  this.appendRows(1);
        });
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
                    k += 100;
                }while (k < this.globalColumnNumber);
                const htmlDiv : HTMLElement = document.getElementById('page '+(i+1)+'-'+(i+100));
                htmlDiv.style.display = 'block';
            }
            tableButton.addEventListener('click', handleClick);
        })
    }

    // присвоение обработчика событий всем кнопкам
    private addLister(){
        let i : number = 0;
        do{
            this.addPaginationListener(i);
            i +=100;
        }while (i < this.globalColumnNumber);
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
        this.tableEl.insertAdjacentElement('afterend', htmlRow);

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
            i += 100;
            newDiv.style.display = 'none';
            this.tbody.appendChild(newDiv);
        } while (i<this.globalColumnNumber);
    }

    //нахождение разницы координат последней строки и экрана браузера
    private findCoords() : boolean{
        const windowHeight: number = document.documentElement.clientHeight;
        const lastRowCoord:DOMRect = this.tbody.lastElementChild.getBoundingClientRect();
        return lastRowCoord.bottom - windowHeight < 10
    }

    //кнопка для загрузки строк, чтобы корректно работал скролл
    private createButton() :void{
        const htmlRow : HTMLTableRowElement = this.createEmptyHTMLRow();
        htmlRow.className = 'button';
        const htmlCell : HTMLTableCellElement = this.createEmptyHTMLCell();
        htmlCell.colSpan  = this.globalRowLong + this.globalKeyNumber;
        htmlCell.innerHTML = 'Показать ещё';
        htmlRow.appendChild(htmlCell);
        this.tableEl.appendChild(htmlRow);
    }

    //сортировка MAP по ключу
    private sortMap(contentMap: Map<CellArray, CellArray>): Map<CellArray, CellArray>{
        return new Map([...contentMap.entries()].sort(
            (firstKeyArray : [CellArray, CellArray], secondKeyArray : [CellArray, CellArray]) : number => firstKeyArray[0] > secondKeyArray[0] ? 1 : firstKeyArray[0] < secondKeyArray[0] ? -1 : 0
        ));
    }

    //добавление новых строк в таблицу
    private appendRows(size: number): void {
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

    //создание строки итогов
    private appendTotalRow(): void {
        const totalRowCellArray = this.fillTotalRow()
        const totalRow : HTMLTableRowElement = this.createHTMLRow(totalRowCellArray[0], totalRowCellArray[1]);
        totalRow.className = 'total'; //присвоение класса
        this.tableEl.insertAdjacentElement('beforeend', totalRow);
    }

    //заполнение строки итогов
    private fillTotalRow(){
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

    // создание строк
    private createHTMLRow(primaryCell: CellArray, otherCellArray: CellArray): HTMLTableRowElement {
        const htmlRow :HTMLTableRowElement = this.createEmptyHTMLRow();
        primaryCell.forEach((keys : Cell) : void => {
            htmlRow.appendChild(this.createHTMLCell(keys));
        });
        otherCellArray.forEach(others => {
            htmlRow.appendChild(this.createHTMLCell(others));
        });
        return htmlRow
    }

    // заполнение строк
    private createHTMLCell(cell:Cell): HTMLTableCellElement{
        const htmlCell : HTMLTableCellElement = this.createEmptyHTMLCell();
        htmlCell.innerHTML = <string>cell;
        return htmlCell
    }
}
