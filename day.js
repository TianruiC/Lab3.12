var dataP=d3.json("day.json");
dataP.then(function(data)
{
  console.log("data",data)
  //console.log("data",data[0].grades)
  drawGraph(data,1000,600,0);
},
function(err)
{
  console.log(err);
})


var drawGraph=function(data,w,d,x)
{
  var scren=
  {
    width:w,
    height:d
  };
  var svg=d3.select("body").append("svg")
            .attr("width",scren.width)
            .attr("height",scren.height)
  var margins=
  {
    top:10,
    bottom:50,
    left:35,
    right:70
  }
  var width=scren.width-margins.left-margins.right;
  var height=scren.height-margins.top-margins.bottom;

  //scales usually go here
  var xScale=d3.scaleLinear()
               .domain([0,4])
               .range([0,width]);
  var yScale=d3.scaleLinear()
               .domain([0,100])
               .range([height,0]);
  var colors=d3.scaleOrdinal(d3.schemeAccent);
  //plot land

  var plotLand =svg.append("g")
                  .classed("plot",true)
                  .attr("transform","translate("+margins.left+","+margins.top+")");

  var students=plotLand.selectAll("rect")
                       .data(data[x].grades)
                       .enter()
                       .append("rect")
                       .attr("fill",function(d){ return colors(d.name)})
                       .attr("x",function(d,i){return xScale(i);})
                       .attr("y",function(d,i){return yScale(d.grade);})
                       .attr("width",width/4-4)
                       .attr("height",function(d){
                         return height-yScale(d.grade);
                       })
  //the legend...
  var legend=svg.append("g")
                .classed("legend",true)
                .attr("transform","translate("+(width+margins.left)+","+margins.top+")");

  var legendLines=legend.selectAll("g")
                        .data(data[x].grades)
                        .enter()
                        .append("g")
                        .classed("legendLine",true)
                        .attr("transform",function(d,i){
                        return "translate(0,"+(i*20)+")";});

  legendLines.append("rect")
             .attr("x",0)
             .attr("y",0)
             .attr("width",10)
             .attr("height",10)
             .attr("fill",function(d){return colors(d.name);});

  legendLines.append("text")
             .attr("x",20)
             .attr("y",10)
             .text(function(d){ return d.name;});

  var yAxis=d3.axisLeft(yScale);

  svg.append("g").classed("yAxis",true)
     .call(yAxis)
     .attr("transform","translate("+(margins.left-10)+","+(margins.top)+")");
};

var updateGraph=function(data,x)
{
  var margins=
  {
    top:10,
    bottom:50,
    left:35,
    right:70
  }
  var svg=d3.select("svg")
  var width=svg.width-margins.left-margins.right;
  var height=svg.height-margins.top-margins.bottom;
  var yScale=d3.scaleLinear()
               .domain([0,100])
               .range([height,0]);
  var students=svg.select("plotLand").selectAll("rect")
                       .data(data[x].grades)
                       .transition()
                       .attr("fill",function(d){ return colors(d.name)})
                       .attr("x",function(d,i){return xScale(i);})
                       .attr("y",function(d,i){return yScale(d.grade);})
                       .attr("width",width/4-4)
                       .attr("height",function(d){
                         return height-yScale(d.grade);
                       })
}

var update=function(x)
{
  var dataP=d3.json("day.json");
  var day=d3.select("p");
  dataP.then(function(data)
  {
    updateGraph(data,1);
  },
  function(err)
  {
    console.log(err);
  })
}
