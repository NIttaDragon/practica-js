import {TableFragment} from "./table_debug.js";
import {TableOptionsFragment} from "./entities.js";

// класс загрузки по страницам
export class PagintedTable extends TableFragment {
    private totalRow : boolean;

    constructor(content, sto : TableOptionsFragment) {
        super(content, sto);
        this.totalRow = sto.hasTotalRow;
        this.createPageButton();
        this.createCellTables();
        this.addLister();
    }

    //обработчик пагинатора
    private addPaginationListener(i) : void {
        window.addEventListener('DOMContentLoaded', () : void =>{ //вызов обработчика событий кнопки после создания кнопки
            let tableButton: HTMLElement = document.getElementById('button '+(i+1)+'-'+(i+100));
            const handleClick = () : void =>{
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
    private createCellTables() : void {
        let i : number = 0;
        do{
            const newDiv = this.createHTMLElementWithID('div','page '+(i+1)+'-'+(i+100)/*, 'page '+(i+1)+'-'+(i+100) */)
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
    private createPageButton() : void {
        const htmlRow :HTMLTableRowElement = this.createHTMLElement('tr');
        htmlRow.className = 'buttons';
        let i : number = 0;
        do{
            const htmlCell :HTMLTableCellElement = this.createHTMLElement('td');
            let idNameString : string = 'button '+(i+1)+'-'+(i+100);
            htmlCell.id = idNameString;
            htmlCell.innerHTML = idNameString;
            htmlRow.appendChild(htmlCell);
            i += 100;
        } while (i<this.globalColumnNumber);
        this.tableEl.insertAdjacentElement('afterend', htmlRow);
    }

    // присвоение обработчика событий всем кнопкам
    private addLister() : void {
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
        totalRow.className = 'total'; //присвоение класса
        totalRow.style.display = 'none';
        this.tfoot.appendChild(totalRow);
    }
}
