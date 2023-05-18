import { Grid } from "https://uicdn.toast.com/grid/latest/tui-grid.js";
import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
// define the component

export class TablePlugin extends LitElement {

    static properties = {
    	headers:{
    		type: 'string',
    		title: 'Table Headers as JSON'
    	},
        data: {
            type: 'string',
            title: 'Table Data as JSON.'
        }
    };

    static getMetaConfig() {
        return {
            controlName: 'Table grid',
            fallbackDisableSubmit: false,
            version: '1.2',
            properties: {
		    	headers:{
		    		type: 'string',
		    		title: 'headers',
		    		description: 'Table Headers as JSON'
		    	},
		        data: {
		            type: 'string',
		            title: 'data',
		            description: 'Table Data as JSON.'
				}
        	}
        }
    }

    constructor(){
    	super();
    	this.headers = [];
    	this.data = [];
    }

    render() {
    	return html`<div id='tableGrid'></div>`;
    }

    connectedCallback(){
  		super.connectedCallback();
    	let cssId = "gridStyles";

    	if(document.querySelector(`#${cssId}`)==undefined){
    		let css = document.createElement("link");
    		css.id = "gridStyles";
    		css.rel = cssId;
    		css.href = "https://uicdn.toast.com/grid/latest/tui-grid.css";
    		document.querySelector("head").appendChild(css);
    	}

    	const headers = JSON.parse(this.headers);
    	const data = JSON.parse(this.data);

    	const instance = new Grid({
    		el:document.querySelector("#tableGrid"),
    		columns:this.headers,
    		data:this.data
    	});

    	Grid.applyTheme('striped');

    }

}

let pluginName = "table-grid";
customElements.define(pluginName, TablePlugin);