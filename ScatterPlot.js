// Data Visualization Project 1
// Quyen Ha and Marty Dang
//This file draws the Scatter Plot for the seed data 
 
//////////////////////////////////////////////////////////////////////
// Create a namespace to hold global variables

var myNS = {};

// Width and height of SVG drawing area
myNS.width = 550;
myNS.height = 550;
myNS.padding = 60;   // padding around edges, to make room for axes

// for menus, the choice for each one
myNS.xData = "";
myNS.yData = "";

// dataset -- will read this from CSV file
myNS.dataset = [];  // initialize empty array


//////////////////////////////////////////////////////////////////////
// read the data file
d3.csv("seeds.csv", function(error, data) {

    // store data in namespace variable
    myNS.dataset = data;  
    
    // error checking
    if (error) {
	console.log(error);
    }
    // else call createScatterPlot()
    else {
	console.log(myNS.dataset);
	createScatterPlot();
    }

}); // end d3.csv

// create the visualization
var createScatterPlot = function (){

    // create scatter plot's heading
    makeTitle ();

    // create the svg context
    var svg = makeSVGScatter ();

    // make the menu once (not every time the vis gets redrawn)
    if (myNS.xData == "") {
	      // the menu items have the on change functionality
	      makeMenu(svg); 
    }
    
    // create scales, axes, and title
    createXAndYScales ();
    createXAndYAxis ();
    
    // draw circles
    makeCircles (svg);
    
    // draw axes and labels
    makeAxesAndLabels (svg);

    // make legends 
    makeLegend (svg);

}; // end createScatterPlot


// put a title at the top. this is a distinct SVG element
function makeTitle () {

    // title is a separate SVG element
    // add svg to div with id ScatterPlot
    var headingsvg = d3.select("#ScatterPlot")
	    .append("svg")
	    .attr("width", myNS.width)
	    .attr("height", 30);    // height for the heading is 30 pixels
    
    // add text title to the svg element
    headingsvg.append("g")
	.append("text")
	.attr("class", "heading")
	.attr("text-anchor", "middle")
	.attr("x", myNS.width / 2 - 35)
	.attr("y", 25)
    .attr("font-family", "sans-serif")
	.attr("font-size", "16px")
	.attr("font-weight", "bold")
	.text("Interactive Scatter Plot of Seeds Data");

} // end makeTitle 

// create svg context
function makeSVGScatter () { 

    var svg = d3.select("#ScatterPlot")
	    .append("svg")
	    .attr("width", myNS.width) 
	    .attr("height", myNS.height);
    return svg;

} // end makeSVG 

// draw all the data
function makeCircles (svg) {
    
    // radius for circles
    var radius = 2;     
    
    svg.selectAll("circle")
	.data(myNS.dataset)
	.enter()
	.append("circle")
         // use css to set the color of the dot
         // different colors stand for the three different types of seeds
	.attr("class", function(d) {
	    return String(d.type);
	})
	.attr('fill', function(d) {
	    return myNS.colorScale(String(d.type));
	})
	.attr('stroke', 'black')
        // x position of the circle is the value of the xData
	.attr("cx", function(d) {
	    return xScale(+d[myNS.xData]); 
	})
        // y position of the circle is the value of the yData
	.attr("cy", function(d) {
	    return yScale(+d[myNS.yData]); 
	})
        // set the radius to 2 
	.attr("r", radius);
} 


// add the menu options, using data columns
function makeMenu(svg) {

    // select xmenu and ymenu from the html
    var xmenu = d3.select("#xmetrics");
    var ymenu = d3.select("#ymetrics");

    // set initial x and y to area and perimeter
    myNS.xData = "area";
    myNS.yData = "perimeter";

    // exclude one or more attributes, to not be plotted
    // add the others to the menu
    for (prop in myNS.dataset[0]){
	// if prop is not id_num or type, add it to x and ymenu
	    if (prop != "id_num" && prop != "type") {
	        xmenu.append("option").attr("value", prop).text(prop);
	        ymenu.append("option").attr("value", prop).text(prop);
	    }
    }

    // set the initial menu items to area/perimeter
    document.getElementById('xSelect').value = "area";
    document.getElementById('ySelect').value = "perimeter";

    // if a menu item is chosen, setX and redraw
    d3.select("#xSelect").on("change", function(){
	myNS.xData = this.value;      // set the menu 
	update(svg);                  // update the svg
    });
    
    // if a menu item is chosen, setX and redraw
    d3.select("#ySelect").on("change", function(){
	myNS.yData = this.value;      // set the menu
	update(svg);                  // update the svg
    });
  
} // end, make Menu


// create scale functions
function createXAndYScales () {
    
    // map x values to pixels
    xScale = d3.scaleLinear()
	.domain([0,
		 d3.max(myNS.dataset, function(d) { return +d[myNS.xData]; })])
	.range([myNS.padding, myNS.width - myNS.padding * 2]);
    
    // map y values to pixels
    yScale = d3.scaleLinear()
	.domain([0,
		 d3.max(myNS.dataset, function(d) { return +d[myNS.yData]; })])
	.range([myNS.height - myNS.padding, myNS.padding]);

    // create scale of colors to differentiate seed types
    // red for Kama, blue for Rosa, green for Canadian
    myNS.colorScale = d3.scaleOrdinal()
	.domain(['Kama', 'Rosa', 'Canadian'])
	.range(['red', 'blue', 'green']);
} 

// create axes functions
function createXAndYAxis() {

    // define X axis
    xAxis = d3.axisBottom(xScale).ticks(10);

    // define Y axis
    yAxis = d3.axisLeft(yScale).ticks(10);
    
} 

// draw the axes and labels
function makeAxesAndLabels (svg) {

    // create X axis
    svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (myNS.height - myNS.padding) + ")")
	.call(xAxis);

    // create Y axis
    svg.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(" + myNS.padding + ",0)")
	.call(yAxis);

    // create X labels
    svg.append("g")
	.append("text")
	.attr("class", "x label")
	.attr("text-anchor", "middle")
	.attr("transform", "translate(" + (myNS.width/2 - 25)  + "," + 
	      (myNS.height - myNS.padding/3) + ")")
	.attr("font-family", "Georgia")
	.attr("font-size", "13px")
	.attr("font-weight", "bold")
	.text(myNS.xData);

    // create Y labels
    svg.append("g")
	.append("text")
	.attr("class", "y label")
	.attr("text-anchor", "middle")
	.attr("transform", "translate(15," + (myNS.height/2) + ")" +
	      "rotate(-90)")
	.attr("font-family", "Georgia")
	.attr("font-size", "13px")
	.attr("font-weight", "bold")
	.text(myNS.yData);
}

// makes the legend
function makeLegend (svg) { 

    // positioning the legends for aesthetic reasons
    var rectXPosition = myNS.width-myNS.padding-40;
    var rectYPosition = myNS.height/2 - 20;

    // make a new 'legend' element in the SVG
    // each element in the legend will be 12 pixels below the previous one
    var legend = svg.selectAll('legend')
	    .data(myNS.colorScale.domain())
	    .enter().append('g')
	    .attr('class', 'legend')
	    .attr('transform', function(d,i){ return 'translate(0,' + i * 12 + ')'; });
    
    // create rects for the legend
    // 10x10 boxes, positioned at middle right of svg 
    legend.append('rect')
	.attr('x', rectXPosition)
	.attr("y", rectYPosition)
	.attr('width', 10)
	.attr('height', 10)
	.attr('stroke', 'black')
	.style('fill', myNS.colorScale);
    
    // text for the legend elements
    // further right than the boxes, y is the baseline for the text
    legend.append('text')
	.attr('x', rectXPosition+20)
	.attr('y', rectYPosition+10)
	.text(function(d){ return d; });

} // end, makeLegend

// redraws the graph
function update(svg){    

    // recaliberating the xScale
    xScale.domain(
        [0,d3.max(myNS.dataset, function(d) { return +d[myNS.xData]; })]);  

    // recaliberating the yScale
    yScale.domain(
        [0,d3.max(myNS.dataset, function(d) { return +d[myNS.yData]; })]);  
  
    // update the circles
    svg.selectAll("circle")  
        .data(myNS.dataset)
        .transition()
        .duration(1000)
        .attr("cx", function(d) {
            return xScale(+d[myNS.xData]);
        })
        .attr("cy", function(d) {
            return yScale(+d[myNS.yData]);
        });

    // update X axis
    svg.select(".x.axis")
        .transition()
        .duration(1000)
        .call(xAxis);
    
    // update X axis label 
    svg.select(".x.label")
	.text(myNS.xData);

    // update Y axis
    svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxis);

    // update Y axis label
    svg.select(".y.label")
	.text(myNS.yData);

}

