// import { Grid } from "https://uicdn.toast.com/grid/latest/tui-grid.js";
import 'https://oss.sheetjs.com/sheetjs/xlsx.full.min.js';
import { html, LitElement, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import { Tabulator, DownloadModule, EditModule, ExportModule, SortModule, ResponsiveLayoutModule, InteractionModule, FormatModule } from 'https://unpkg.com/tabulator-tables@5.4.4/dist/js/tabulator_esm.min.js';
// define the component


export class TablePlugin extends LitElement {
	/*copied from tabulator.min.css*/
	static styles = css`
	.control {width:100%;}
	.control > .btn {cursor:pointer;height:var(--ntx-form-theme-control-height);color:var(--ntx-form-theme-color-primary);border:(--ntx-form-theme-color-border);}
	
	.container {position:relative;z-index:1}
	.container > .loader {position:absolute;top:0;left:0;width:100%;height:1;z-index:999}
	
	/* Spinner CSS */
	.loader {
		border: 16px solid #f3f3f3; /* Light grey */
		border-top: 16px solid #3498db; /* Blue */
		border-radius: 50%;
		width: 120px;
		height: 120px;
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	`;

	static properties = {
		// headers:{
		// 	type: String,
		// 	title: 'Table Headers as JSON'
		// },
		data: {
			type: String,
		},
		// outputKey: {
		// 	type:String
		// },
		// value: {
		// 	type:String
		// }
	};

	static getMetaConfig() {
		return {
			controlName: 'Table grid',
			fallbackDisableSubmit: false,
			version: '1.1',
			properties: {
				data: {
					type: 'string',
					title: 'data',
					description: 'Table Data as JSON'
				},
				// outputKey: {
				// 	type: 'string',
				// 	title: 'Output Key',
				// 	description: 'Specify the column name of the table. When selecting a row, the attribute of the row identified by this value becomes the value of the table.'
				// },
				// value: {
				// 	type: 'string',
				// 	title: 'Value',
				// 	isValueField: true
				// },
			},
			// events: ["ntx-value-change"]
		}
	}

	constructor() {
		super();
		this.columns = "[]";
		this.data = "[]";
		this.instance = undefined;
		this.controls = undefined;
		this.outputKey = undefined;
	}

	render() {

		return html`
		<link href="https://unpkg.com/tabulator-tables@5.5.0/dist/css/tabulator.min.css" rel="stylesheet">
		<div class='container'>
			<div class='controls'></div>
			<div id='tableGrid'></div>
		</div>
		`;
	}

	
	connectedCallback() {
		super.connectedCallback();
	}

	firstUpdated() {
		Tabulator.registerModule([DownloadModule, EditModule, ExportModule, SortModule, ResponsiveLayoutModule, InteractionModule, FormatModule]);
		this.BuildTable();
	}

	async updated() {
		// const headers = JSON.parse(this.headers);
		this.BuildTable();
	}

	UpdateControlValue(value) {
		const args = {
			bubbles: true,
			cancelable: false,
			composed: true,
			// value coming from input change event. 
			detail: value,
		};
		const event = new CustomEvent('ntx-value-change', args);
		this.dispatchEvent(event);
	}

	BuildTable() {
		const columns = JSON.parse(this.columns);
		const data = JSON.parse(this.data).filter(x=>x.caseProgress!=="dummy".toLowerCase());

		let tableOptions = {
			data: data,
			autoColumns: true,
			columnDefaults:{
				maxWidth:250,
				maxHeight:50
			}
		};
		// var outputKey = this.outputKey;
		// var updateControlValue = this.UpdateControlValue;
		tableOptions.autoColumnsDefinitions = function (definitions) {

			var editColumn = {
				formatter: function (cell, formatterParams) {
					return '<div>Edit</div>';
				},
				headerSort: false,
				maxWidth:40,
				cellClick: function (e, cell) {
					window.open(`https://aslbdemo.workflowcloud.com/forms/9704b106-7517-4881-b154-daca88c913e2?caseID=${cell.getRow().getCell("caseID").getValue()}`);
					// if (outputKey != undefined) {
					// 	console.log(cell.getRow().getCell(outputKey).getValue() || "")
					//     updateControlValue(cell.getRow().getCell(outputKey).getValue() || "");
					// }
				}
			};

			return [
				editColumn,
				...definitions
			]
		}

		if (!this.instance) {
			
			let spinner = document.createElement('div');
			spinner.class = "loader";

			this.instance = new Tabulator(this.renderRoot.querySelector("#tableGrid"), tableOptions);
			// this.instance.on('renderStarted',() => {
			// 	this.renderRoot.querySelector(".container").appendChild(spinner);
			// });
			// this.instance.on('renderComplete',() => {
			// 	setTimeout(()=>{
			// 	if(this.renderRoot.querySelector(".container .loader")!=undefined)
			// 		this.renderRoot.querySelector(".container").removeChild(this.renderRoot.querySelector(".loader"));
			// 	},1000);
			// });
		}

		if (this.instance && !this.controls) {
			this.controls = this.renderRoot.querySelector(".controls");
			this.controls.innerHTML = '<div id = "exportXLSX" class="btn">Download as Excel file</div>';
			let exportXlsxBtn = this.controls.querySelector("#exportXLSX");
			exportXlsxBtn.addEventListener('click', (e) => {
				this.instance.download("xlsx", "data.xlsx", { sheetName: "My Data" });
			});
			this.instance.setData(data);
		}

	}
}

let pluginName = "table-grid";
customElements.define(pluginName, TablePlugin);