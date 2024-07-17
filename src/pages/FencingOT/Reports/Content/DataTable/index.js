/* eslint-disable array-callback-return */
import * as React from "react";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Typography } from "@material-ui/core";
import {
  ColumnsDirective,
  ColumnDirective,
  TreeGridComponent,
  Inject,
} from "@syncfusion/ej2-react-treegrid";
import {
  VirtualScroll,
  Filter,
  Toolbar,
  Freeze,
  Resize,
  Reorder,
  Page,
  Sort,
  PdfExport,
  ExcelExport,
  ColumnMenu,
  ContextMenu,
} from "@syncfusion/ej2-react-treegrid";
import "./sample2.css";
import { getCdrColumnName } from "../../../../getCdrColumns";

/* tslint:disable */

var icons = `
.e-Pdf_Export:before {
    content:'\\e240';
}
.e-Excel_Export:before {
    content: '\\e242';
}
`;

let columnsinorder = [
  "answertime",
  "callingnumber",
  "callednumber",
  "calledimei",
  "calledimsi",
];

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.settings = {
      type: "Multiple",
      enableToggle: true,
      persistSelection: true,
    };
    this.toolbarOptions = [
      {
        text: "PDF",
        tooltipText: "PDF Export",
        id: "PdfExport",
        align: "Right",
        prefixIcon: "e-Pdf_Export",
      },
      {
        text: "Excel",
        tooltipText: "Excel Export",
        id: "ExcelExport",
        align: "Right",
        prefixIcon: "e-Excel_Export",
      },
    ];
    this.sortingOptions = {
      columns: [{ field: "timestampdatetime", direction: "Descending" }],
    };
    this.pageOptions = { pageSize: 500 };
    this.filterSettings = { type: "Excel" };
    this.inputStyle = { width: "150px", display: "inline-block" };
    this.contextMenuItems = ["Save"];

    this.rowSelected = this.rowSelected.bind(this);
    this.onClick = this.onClick.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.dataBound = this.dataBound.bind(this);

    this.state = {
      showSelectedCol: true,
    };

    this.answerTimeStack = [
      { field: "answerdate", headerText: "Date", textAlign: "Left" },
      { field: "answertime", headerText: "Time", textAlign: "Left" },
    ];
    this.releaseTimeStack = [
      { field: "releasedate", headerText: "Date", textAlign: "Left" },
      { field: "releasetime", headerText: "Time", textAlign: "Left" },
    ];
  }

  

  onClick() {
    const searchText = document.getElementsByClassName("searchtext")[0].value;
    if (this.treegrid) {
      this.treegrid.search(searchText);
    }
  }
  dataBound() {
    if (this.treegrid) {
      //this.treegrid.autoFitColumns(this.props.selectedColumns);
      this.treegrid.autoFitColumns();
    }
  }

  rowSelected() {
    if (this.treegrid) {
      /* Get the selected records. */
      let selectedrecords = this.treegrid.getSelectedRecords();
      let selectedRowIndex = this.treegrid.getSelectedRowIndexes();

      console.log(selectedrecords, selectedRowIndex);

      this.props.getRow(selectedrecords, selectedRowIndex);
    }
  }

  show() {
    if (this.treegrid) {
      this.treegrid.showColumns(this.props.allColumns); // show by HeaderText
    }
  }
  hide() {
    var hiddenColumns = [];
    let colName = "";
    for (var i = this.props.allColumns.length; i--; ) 
    {
      colName = getCdrColumnName(this.props.allColumns[i]);
      if (this.props.selectedColumns.indexOf(colName) === -1)
        hiddenColumns.push(colName);
    }
    if (this.treegrid) 
    {
      this.treegrid.hideColumns(hiddenColumns); // hide by HeaderText
    }
    console.log("Hide", hiddenColumns);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.selectedColumns !== this.props.selectedColumns) {
      this.hide();
    }
  }

  toolbarClick(args) {
    if (this.treegrid && args.item.id === "PdfExport") {
      this.treegrid.pdfExport();
    } else if (this.treegrid && args.item.id === "ExcelExport") {
      this.treegrid.excelExport();
    }
  }

  highlightCell(args) {
    const job = this.props.selectedJob ? this.props.selectedJob.query : null;
    const cell = args.cell;
    if (
      (args.column.field === "servedmsisdn" ||
        args.column.field === "callingnumber") &&
      cell.innerHTML === job
    ) {
      cell.setAttribute("style", "background-color:#87badb;color:black;");
    }
  }

  
  render() {
    const { allColumns, exportRight } = this.props;
    
    const dateComparer = (reference, comparer) => {
        reference = Date.parse(reference);
        comparer = Date.parse(comparer);
        if (reference < comparer) {
            return -1;
        }
        if (reference > comparer) {
            return 1;
        }
        return 0;
      };

    const sortComparer = (reference, comparer) => {
      reference = parseInt(reference.split("/").reverse().join(""));
      comparer = parseInt(comparer.split("/").reverse().join(""));

      if (reference < comparer) {
        return -1;
      }
      if (reference > comparer) {
        return 1;
      }
      return 0;
    };

    this.props.selectedJobCdrList.map((ele, index) => {
      try {
        Object.keys(ele).forEach((key) => {
          if (typeof ele[key] === "number") {
            ele[key] = ele[key].toString();
          }
        });
      } catch (err) {
        console.error(err);
      }
    });

    const selectedJobCdrList = this.props.selectedJobCdrList;

    this.toolbarClick = this.toolbarClick.bind(this);

    let exportProps = {};
    let services = [
      VirtualScroll,
      Filter,
      Freeze,
      Toolbar,
      Page,
      Sort,
      Reorder,
      ColumnMenu,
      ContextMenu,
      Resize,
    ];
    if (exportRight) {
      exportProps = {
        allowPdfExport: "true",
        allowExcelExport: "true",
        toolbar: this.toolbarOptions,
      };
      services = [
        VirtualScroll,
        Filter,
        Freeze,
        Toolbar,
        Page,
        Sort,
        Reorder,
        ColumnMenu,
        ContextMenu,
        Resize,
        ExcelExport,
        PdfExport,
      ];
    }
    //console.log("nodo",this.props.type);
    return (
      <div>
        <style>{icons}</style>
        <Typography component="h5" variant="h5">
          <strong>Tabular Data</strong>
        </Typography>
        <div
          style={{
            marginBottom: 8,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div className="e-float-input" style={this.inputStyle}>
            <input type="text" className="searchtext" />
            <span className="e-float-line" />
            <label className="e-float-text">Search text</label>
          </div>
          <ButtonComponent
            id="search"
            style={{ marginLeft: 8, height: "20%" }}
            onClick={this.onClick}
          >
            Search
          </ButtonComponent>
        </div>
        <ButtonComponent
          cssClass="e-flat"
          onClick={() => {
            this.setState({ showSelectedCol: true });
          }}
        >
          Show Selected Records
        </ButtonComponent>
        <ButtonComponent
          cssClass="e-flat"
          onClick={() => {
            this.setState({ showSelectedCol: false });
          }}
        >
          Show All Records
        </ButtonComponent>

        {console.log("selectedJobCdrList", selectedJobCdrList.toString())}
        {console.log("All columns", allColumns)}

        <div style={{ height: 700 }}>
          <TreeGridComponent
            id="tree_grid"
            dataSource={selectedJobCdrList}
            height="100%"
            enableStickyHeader={true}
            treeColumnIndex={1}
            allowReordering={true}
            idMapping="TaskID"
            childMapping="subtasks"
            parentIdMapping="parentID"
            pageSettings={this.pageOptions}
            filterSettings={this.filterSettings}
            sortSettings={this.sortingOptions}
            dataBound={this.dataBound}
            toolbarClick={this.toolbarClick}
            {...exportProps}
            selectionSettings={this.settings}
            allowPaging={true}
            ref={(g) => (this.treegrid = g)}
            rowSelected={this.rowSelected}
            rowDeselected={this.rowSelected}
            allowFiltering={true}
            allowResizing={false}
            showColumnMenu={true}
            allowSorting={true}
            allowSelection={true}
            contextMenuItems={this.contextMenuItems}
            queryCellInfo={this.highlightCell}
            selectedJob={this.props.selectedJob}
          >
            {/*dropdown filter doubt: might have to manually write date in the code*/}
            <ColumnsDirective>
              <ColumnDirective type="hidden" />
              <ColumnDirective
                field="id"
                isPrimaryKey={true}
                headerText="ID"
                textAlign="left"
                minWidth="250"
                width="250"
                visible={false}
              />
              <ColumnDirective
                field="timestampdatetime"
                headerText="Date Time"
                sortComparer={dateComparer}
                textAlign="left"
                minWidth="250"
                width="250"
              />
              {/* {
                columnsinorder.map((column, index) => {
                  let colName = getCdrColumnName(column);
                  return (
                    <ColumnDirective
                      field={column}
                      headerText={colName}
                      textAlign="left"
                      minWidth="250"
                      width="250"
                      key={index}
                    />
                  );
                })
              } */}
              {allColumns.map((column, index) => {
                let colName = getCdrColumnName(column);
                if (this.state.showSelectedCol) 
                {
                  if (this.props.selectedColumns.indexOf(colName) !== -1) 
                  {
                    if (
                      column === "timestampdate" ||
                      column === "releasedate"
                    ) {
                      return (
                        <ColumnDirective
                          field={column}
                          headerText={colName}
                          textAlign="left"
                          minWidth="250"
                          width="250"
                          sortComparer={sortComparer}
                          key={index}
                        />
                      );
                    } else {
                      return (
                        <ColumnDirective
                          field={column}
                          headerText={colName}
                          textAlign="left"
                          minWidth="250"
                          width="250"
                          key={index}
                        />
                      );
                    }
                  }
                } else {
                  if (column === "timestampdate" || column === "releasedate") {
                    return (
                      <ColumnDirective
                        field={column}
                        headerText={colName}
                        textAlign="left"
                        minWidth="250"
                        width="250"
                        sortComparer={sortComparer}
                        key={index}
                      />
                    );
                  } else {
                    return (
                      <ColumnDirective
                        field={column}
                        headerText={colName}
                        textAlign="left"
                        minWidth="250"
                        width="250"
                        key={index}
                      />
                    );
                  }
                }
              })}
            </ColumnsDirective>
            <Inject services={services} />
          </TreeGridComponent>
        </div>
      </div>
    );
  }
}
