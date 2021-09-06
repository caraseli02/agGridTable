var gridOptions = {
  // define grid columns
  columnDefs: [
    // using default ColDef
    { headerName: 'Athlete', field: 'athlete' },
    { headerName: 'Sport', field: 'sport' },

    // using number column type
    { headerName: 'Age', field: 'age', type: 'numberColumn' },
    { headerName: 'Year', field: 'year', type: 'numberColumn' },

    // using date and non-editable column types
    {
      headerName: 'Date',
      field: 'date',
      type: ['dateColumn', 'nonEditableColumn'],
      width: 220,
      sortable: true, filter: true
    },
    {
      headerName: 'Medals',
      groupId: 'medalsGroup',
      children: [
        // using medal column type
        { headerName: 'Gold', field: 'gold', type: 'medalColumn' },
        { headerName: 'Silver', field: 'silver', type: 'medalColumn' },
        { headerName: 'Bronze', field: 'bronze', type: 'medalColumn' },
        {
          headerName: 'Total',
          field: 'total',
          type: 'medalColumn',
          columnGroupShow: 'closed',
        },
      ],
    },
  ],

  // default ColDef, gets applied to every column
  defaultColDef: {
    // set the default column width
    width: 150,
    // make every column editable
    editable: true,
    // make every column use 'text' filter by default
    filter: 'agTextColumnFilter',
    // enable floating filters by default
    floatingFilter: true,
    // make columns resizable
    resizable: true,
  },

  // default ColGroupDef, get applied to every column group
  defaultColGroupDef: {
    marryChildren: true,
  },

  // define specific column types
  columnTypes: {
    numberColumn: { width: 130, filter: 'agNumberColumnFilter' },
    medalColumn: { width: 100, columnGroupShow: 'open', filter: false },
    nonEditableColumn: { editable: false },
    dateColumn: {
      // specify we want to use the date filter
      filter: 'agDateColumnFilter',

      // add extra parameters for the date filter
      filterParams: {
        // provide comparator function
        comparator: function (filterLocalDateAtMidnight, cellValue) {
          // In the example application, dates are stored as dd/mm/yyyy
          // We create a Date object for comparison against the filter date
          var dateParts = cellValue.split('/');
          var day = Number(dateParts[0]);
          var month = Number(dateParts[1]) - 1;
          var year = Number(dateParts[2]);
          var cellDate = new Date(year, month, day);

          // Now that both parameters are Date objects, we can compare
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          } else {
            return 0;
          }
        },
      },
    },
  },
  rowData: null,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url: 'https://www.ag-grid.com/example-assets/olympic-winners.json',
    })
    .then(function (data) {
      gridOptions.api.setRowData(data);
    });
});