import {TableFragment} from "./table_debug.js";
import {TableOptionsFragment} from "./entities.js";

// класс загрузки по кнопке
export class ButtonedTable extends TableFragment {

    constructor(content, sto : TableOptionsFragment) {
        super(content, sto);
        this.appendRows(100);
        this.createButton();
        this.addClickListener();
        if (sto.hasTotalRow === true)  this.appendTotalRow();
    }

    //кнопка для загрузки строк
    private createButton() : void{
        const htmlRow : HTMLTableRowElement = this.createHTMLElement('tr');
        htmlRow.className = 'button';
        const htmlCell : HTMLTableCellElement = this.createHTMLElement('td');
        htmlCell.colSpan  = this.globalRowLong + this.globalKeyNumber;
        htmlCell.innerHTML = 'Показать ещё';
        htmlCell.colSpan = this.globalKeyNumber + this.globalRowLong;
        htmlRow.appendChild(htmlCell);
        this.tfoot.appendChild(htmlRow);
    }

    //обработчик кнопки
    private addClickListener() : void {
        window.addEventListener('DOMContentLoaded', (): void =>{ //вызов обработчика событий кнопки после создания кнопки
            const tableButton:HTMLElement = document.querySelector('.button');
            const handleClick = () =>{
                this.appendRows(50);
            }
            tableButton.addEventListener('click', handleClick);
        })
    }
}
