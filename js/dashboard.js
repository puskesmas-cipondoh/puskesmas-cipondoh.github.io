window.onload = function () {
    var chart = new CanvasJS.Chart("chartContainer", {
      title:{
        text: "My First Chart in CanvasJS"              
      },
      data: [              
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "area",
        dataPoints: [
            { x: new Date(2020, 11, 1), y: 26},
            { x: new Date(2020, 11, 2), y: 38},
            { x: new Date(2020, 11, 3), y: 43},
            { x: new Date(2020, 11, 4), y: 29},
            { x: new Date(2020, 11, 5), y: 41},
            { x: new Date(2020, 11, 6), y: 54},
            { x: new Date(2020, 11, 7), y: 66},
        ]
      }
      ]
    });

    chart.render();

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
}

