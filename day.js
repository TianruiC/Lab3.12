var dataP=d3.json("day.json");
dataP.then(function(data)
{
  console.log("data",data)
  //console.log("data",data[0].grades)
  drawGraph(data,800,580,0);
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
  var svg=d3.select("svg")
            .attr("width",scren.width)
            .attr("height",scren.height)
  var margins=
  {
    top:20,
    bottom:30,
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
                       .attr("fill",function(d){ return colors(d.name);})
                       .attr("x",function(d,i){return xScale(i);})
                       .attr("y",function(d,i){return yScale(d.grade);})
                       .attr("width",width/4-4)
                       .attr("height",function(d){
                         return height-yScale(d.grade);
                       })
                       .on("mouseover", function(d) {
                          var xPosition = parseFloat(d3.select(this).attr("x")) + width/8;
                          var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;
                         d3.select("#tooltip")
                          .style("left", xPosition + "px")
                          .style("top", yPosition + "px")
                          .select("#value")
                          .text(d.grade);
                         d3.select("#tooltip").select("#name")
                          .text(d.name);
                          d3.select("#tooltip").select("#gradeday")
                           .text(document.getElementById("day").innerText);

                         d3.select("#tooltip").classed("hidden", false);})
                        .on("mouseout", function() {
                          d3.select("#tooltip").classed("hidden", true);});
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
  document.getElementById("button1").disabled = true;
};

var updateGraph=function(data,w,d,x)
{

  var scren=
  {
    width:w,
    height:d
  };
  var margins=
  {
    top:20,
    bottom:30,
    left:35,
    right:70
  }
  var svg=d3.select("svg");
  var width=scren.width-margins.left-margins.right;
  var height=scren.height-margins.top-margins.bottom;
  var xScale=d3.scaleLinear()
               .domain([0,4])
               .range([0,width]);
  var yScale=d3.scaleLinear()
               .domain([0,100])
               .range([height,0]);
  var colors=d3.scaleOrdinal(d3.schemeAccent);
  var students=svg.selectAll("rect")
                       .data(data[x-1].grades)
                       .transition()
                       .duration(1000)
                       .attr("fill",function(d){ return colors(d.name);})
                       .attr("x",function(d,i){return xScale(i);})
                       .attr("y",function(d,i){return yScale(d.grade);})
                       .attr("width",width/4-4)
                       .attr("height",function(d){
                         return height-yScale(d.grade);
                       });


  var day=document.getElementById("day");
  day.innerText=data[x-1].day;
  document.getElementById("button1").disabled = false;
  document.getElementById("button2").disabled = false;
  if(x==1)
  {
    document.getElementById("button1").disabled = true;
  }
  else if(x==10)
  {
    document.getElementById("button2").disabled = true;
  }
}


var update=function(x)
{
  var y=document.getElementById("day").innerText;
  y=Number(y)+Number(x);
  var dataP=d3.json("day.json");
  var day=d3.select("p");
  dataP.then(function(data)
  {
    updateGraph(data,800,580,y);
  },
  function(err)
  {
    console.log(err);
  })
}
var updates=function()
{
  var x=Number(document.getElementById("inputday").value);
  if(x>0&&x<11&&(x%1==0))
  {
  var dataP=d3.json("day.json");
  var day=d3.select("p");
  dataP.then(function(data)
  {
    updateGraph(data,800,580,x);
  },
  function(err)
  {
    console.log(err);
  })}
  else{
    window.alert("Please enter a day from 1-10 !")
  }
}
