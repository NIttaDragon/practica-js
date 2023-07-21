import {TableFragment} from "./table_debug.js";
import {TableOptionsFragment} from "./entities.js";

// класс загрузки по страницам
export class PagintedTable extends TableFragment {
    private readonly totalRow : boolean;
    private pageArray;
    private totalArray;
    private tableMap;

    constructor(content, sto : TableOptionsFragment) {
        super(content, sto);
        this.tableMap = content;
        this.totalRow = sto.hasTotalRow;
        this.createPageButton();
        this.createCellTables();
        this.addLister();
    }

    // создание "страниц" со строками таблицы
    private createCellTables() : void {
        let i : number = 0;
        this.pageArray = new Array(Math.floor(this.tableMap.size/100)); // i - номер страницы, j - строка на странице
        this.totalArray = new Array(Math.floor(this.tableMap.size/100));
        do{
            this.pageArray[i] = new Array(100);
            for(let k : number = 0; k < 100; k++){
                this.pageArray[i][k] = this.fillPageArray();
            }
            if (this.totalRow === true){
                this.totalArray[i] = new Array(2);
                this.totalArray[i][0] = 'Total';
                this.totalArray[i][1] = this.fillTotalRow();
            }
            i++;
        } while (i < Math.floor(this.tableMap.size / 100));
        this.addPage(0);
    }

    // заполнение "страницы"
    private fillPageArray() : HTMLTableRowElement {
        const rowEntry = this.tableEntriesIterator.next().value;
        if(rowEntry === undefined)  return; //MAP закончился
        else { //MAP не закончился
            this.globalKeyNumber = rowEntry[0].length;
            this.globalRowLong = rowEntry[1].length;
            this.rowArray.push(rowEntry[1]);
        }
        return rowEntry;
    }

    // добавление содержимого на страницу
    private addPage(i : number) : void {
        for(let j : number = 0; j < 100; j++){
            let cells = this.pageArray[i][j];
            this.tbody.appendChild(this.createHTMLRow(cells[0], cells[1]));
        }
        if (this.totalRow === true) {
            let newTRow: HTMLTableRowElement = this.createHTMLTotalRow(this.totalArray[i][0], this.totalArray[i][1]);
            newTRow.className = 'total';
            this.tfoot.insertAdjacentElement('afterbegin', newTRow);
        }
    }

    // создание кнопок для переключения страниц
    private createPageButton() : void {
        const buttonDiv = this.createHTMLElementWithClass('div', 'butDiv');
        let i : number = 0; let k : number = 0;
        do{
            const buttons = this.createHTMLElement('button');
            buttons.className = 'button'
            buttons.id = 'button '+i;
            buttons.innerHTML = 'button '+(k+1)+'-'+(k+100);
            buttonDiv.appendChild(buttons);
            i++; k += 100;
        } while (i < Math.floor(this.tableMap.size / 100));
        this.tfoot.appendChild(buttonDiv);
    }

    //обработчик пагинатора
    private addPaginationListener(i) : void {
        window.addEventListener('DOMContentLoaded', () : void =>{ //вызов обработчика событий кнопки после создания кнопки
            let tableButton: HTMLElement = document.getElementById('button '+i);
            const handleClick = () : void =>{
                this.tbody.innerHTML = '';  // удаляет все дочерние элементы
                                            // но если бы были обработчики памяти - привело бы к утечке информации
                if (this.totalRow === true) {
                    const htmlTRow : HTMLElement = document.querySelector('.total');
                    this.tfoot.removeChild(htmlTRow);
                    this.addPage(i);
                }
            }
            tableButton.addEventListener('click', handleClick);
        })
    }

    // присвоение обработчика событий всем кнопкам
    private addLister() : void {
        let i : number = 0;
        do{
            this.addPaginationListener(i);
            i ++;
        }while (i < Math.floor(this.tableMap.size / 100));
    }
}
