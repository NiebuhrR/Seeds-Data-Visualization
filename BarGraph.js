// Data Visualization Project 1
// Quyen Ha and Marty Dang
// This is a horizontal bar chart that plots the seeds' id number on the 
// x axis and the seeds' area on the y axis

//////////////////////////////////////////////////////////////////////////
// global variables
//   "constant" global variables put on top useful for updating

var Width = 700;      // of svg
var Height = 800;     // of svg
var Padding = 55;     // margin of svg
var blueScaling = 12; // scaling to set gradation of color for the bars

//////////////////////////////////////////////////////////////////////////
// functions start here 

function initialize (data) {
    
    // make the title
    var title = makeTitleBars () ;

    // make the SVG
    var svg = makeSVG () ;

    // make idScale and valueScale
    var idScale = d3.scaleBand()
	    .domain(data.map(function(d) { return parseInt(d.id_num); })) 
	    .range([Height-Padding, 0+Padding])
	    .paddingInner(0.05);

    var valueScale = d3.scaleLinear()
	    .domain([0, d3.max(data, function (d) { return parseFloat(d.area); })])
	    .range([Padding, Width-Padding]);

    // draw the bars
    makeAndLabelBars (svg, data, idScale, valueScale);

    // make one axis for area values and one for id number
    var valueAxis = makevalueAxis (svg, data, valueScale);
    var idAxis = makeidAxis (svg, data, idScale);

    // display seed's area when mouse over bars
    addValueLabels (svg, data);

    // sort seed in descending order in terms of area
    sortDescending (svg, data, idScale, idAxis);

    // sort seed in ascending order in terms of area
    sortAscending (svg, data, idScale, idAxis);

} // end initialize 

// put a title at the top, as a distinct SVG element
// resposition the buttons to below the SVG title
function makeTitleBars () { 
    
    var svgHeight = 30;                           // height for the heading is 30px
    var xPositionTitle = (Width - Padding*2) / 2; // x position of the title
    var yPositionTitle = 25;                      // half of the height
 
    var xPositionButtons = (Width - Padding*2) / 2 - 85; // x position of the buttons
    var yPositionButtons = Padding - 10;    // y position of the buttons

    // title is a separate SVG element 
    // which is added to div with id BarGraph
    var titleSVG = d3.select("#BarGraph")
	    .append("svg")
	    .attr("width", Width)
	    .attr("height", svgHeight); 

    // add text to titleSVG
    titleSVG.append("g")
	.append("text")
	.attr("class", "heading")
	.attr("text-anchor", "middle")
	.attr("x", xPositionTitle)
	.attr("y", yPositionTitle)
        .attr("font-family", "sans-serif")
	.attr("font-size", "17px")
	.attr("font-weight", "bold")
	.text("Interactive Bar Chart of Rosa Seeds' Areas");


    // repositioning the buttons for aesthetic reasons
    var buttonContainer = document.getElementById("ButtonContainer");
    buttonContainer.style.position = "absolute";
    buttonContainer.style.left = xPositionButtons + "px";
    buttonContainer.style.top = yPositionButtons + "px";

} // end makeTitle

// make svg context
function makeSVG () {     

    // add svg element to div with id BarGraph
    var svg = d3.select("#BarGraph")
	    .append("svg")
	    .attr("width", Width) 
	    .attr("height", Height);
    return svg;

} // end makeSVG

// create the intial bars 
function makeAndLabelBars (svg, data, idScale, valueScale) {

    var barPadding = 1.25;      // distance between bars

    // draw the bars
    svg.selectAll("rect") 
	.data(data)
	.enter()
	.append("rect")
        // because bars are horizontal, x position is always 0
	.attr("x", function(d) {
	    return 0 + Padding;
	})
        // y position is defined by the id number of the seed, which
        // runs from 1 to data.length+1
	.attr("y", function(d) {
	    return idScale(parseInt(d.id_num));
	})
        // horizontal length of bars is defined by area of the seed
        // accounting for paddings
	.attr("width", function (d) { 
	    return valueScale(parseFloat(d.area)) - Padding;
	})  
        // vertical length of bars is defined by equally dividing SVG Height
        // accounted for paddings
	.attr("height", (Height - 2*Padding) / data.length - barPadding)
	// bars color is blue, gradation depends on value of area
	.attr("fill", function(d) {
	    return "rgb(0, 0, " + Math.round(parseFloat(d.area) * blueScaling) + ")";
	});

} // end makeAndLabelBars

// create value Axis
function makevalueAxis (svg, data, valueScale) {
    
    var valueAxis = d3.axisBottom(valueScale)
	    .ticks(20);

    // add value axis to svg
    svg.append("g")
	.attr("class", "value axis")
	.attr("transform", "translate(0, " + (Height - Padding) + ")")
	.call(valueAxis);

    // add value axis label to svg
    svg.append("text")
	.attr("class", "x label")
	.style("text-anchor", "end")
	.attr("x", Width)
	.attr("y", Height - Padding)
	.attr("font-family", "Georgia")
	.attr("font-size", "14px")
	.attr("font-weight", "bold")
	.text("Area");

    return valueAxis;

} // end makevalueAxis

// create id Axis
function makeidAxis (svg, data, idScale) {
 
    var LabelPadding = Padding - 10;

    var idAxis = d3.axisLeft(idScale);

    // add id axis to svg
    svg.append("g")
	.attr("class", "id axis")
	.attr("transform", "translate(" + Padding + "," + 0 + ")")
	.call(idAxis);
    
    // add id value label to svg
    svg.append("text")
	.attr("class", "id label")
	.attr("x", 0)
	.attr("y", LabelPadding)
	.attr("font-family", "Georgia")
	.attr("font-size", "14px")
	.attr("font-weight", "bold")
	.text("Id Num");

    return idAxis; 

} // end makeidAxis


// add value label tooltip when mouse over, which displays the seed's area
function addValueLabels (svg, data) {

    svg.selectAll("rect")

	.on("mouseover", function(d) { 
	
	    var mousePadding = 10; // distance between mouse and tooltip

	    // tooltip position follows the mouse
	    d3.select("#tooltip")
		.style("left", (d3.event.pageX + mousePadding) + "px") 
		.style("top", (d3.event.pageY) + "px") 
		.select("#value")
		.text(d.area);

	    // show tooltip when mouseover
	    d3.select("#tooltip").classed("hidden", false);
	})

        // hide tooltip when mouseout
	.on("mouseout", function(d) { 
	    d3.select("#tooltip").classed("hidden", true);
	});   

} // end addValueLabels

// sort data in descending order when button is clicked 
function sortDescending (svg, data, idScale, idAxis) { 

    d3.select("#sortDescending")
	.on("click", function() { 	

	    // recaliberating the idScale
	    // replace old order of seeds' id_num with sorted ones using map
	    idScale.domain(
		data.sort(
		    function(a, b) { 
			return d3.descending(parseFloat(a.area), parseFloat(b.area));}
		).map(function(d) { return parseInt(d.id_num); }));

	    // sorting the bars
	    svg.selectAll("rect")
		.sort(function(a, b) { 
		    return d3.ascending(parseFloat(a.area), parseFloat(b.area));
		})
		.transition()
		.duration(1000)
		.attr("y", function (d, i) {
		    return idScale(parseInt(d.id_num));
		});

	    // update the id axis
	    svg.select(".id.axis")
		.call(idAxis)
		.transition()
		.duration(1000);
	});

} // end sortDescending

// sort data in ascending order when button is clicked
function sortAscending (svg, data, idScale, idAxis) { 

    d3.select("#sortAscending")
	.on("click", function() { 	

	    // recaliberating the idScale
	    // replacing old order of seeds' id_num with sorted ones using map
	    idScale.domain(
		data.sort(
		    function(a, b) { 
			return d3.ascending(parseFloat(a.area), parseFloat(b.area));}
		).map(function(d) { return parseInt(d.id_num); }));

	    // sorting the bars
	    svg.selectAll("rect")
		.sort(function(a, b) { 
		    return d3.ascending(parseFloat(a.area), parseFloat(b.area));
		})
		.transition()
		.duration(1000)
		.attr("y", function (d, i) {
		    return idScale(parseInt(d.id_num));
		});

	    // update the id axis
	    svg.select(".id.axis")
		.call(idAxis)
		.transition()
		.duration(1000);
	});

} // end sortAscending

//////////////////////////////////////////////////////////////////////////
// read the data file and set up the visualization 
d3.csv("RosaArea.csv", function(error, data) {
    // if error log to console
    if (error) { 
	    console.log(error);
    //else calling initialize(data)
    } else {
	    console.log(data);
	    initialize(data);
    }
});
