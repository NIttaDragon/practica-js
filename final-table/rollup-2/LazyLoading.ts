import {TableFragment} from "./table_debug.js";
import {TableOptionsFragment} from "./entities.js";

// класс загрузки скроллом
export class LazyTable extends TableFragment {

    constructor(content, sto : TableOptionsFragment) {
        super(content, sto);
        this.appendRows(100);
        this.addScrollListeners();
        if (sto.hasTotalRow === true){
            const totalRow : HTMLTableRowElement = this.appendTotalRow();
            this.tfoot.insertAdjacentElement('beforeend', totalRow);
        }
    }

    //обработчик скролла
    private addScrollListeners(){
        document.addEventListener("scroll", () : void =>{
            if (this.findCoords() === true)  this.appendRows(1);
        });
    }

    //нахождение разницы координат последней строки и экрана браузера
    private findCoords() : boolean{
        const windowHeight : number = document.documentElement.clientHeight;
        const lastRowCoord : DOMRect = this.tbody.lastElementChild.getBoundingClientRect();
        return lastRowCoord.bottom - windowHeight < 10
    }
}
