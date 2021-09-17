// https://observablehq.com/@eitanlees/learning-observable-plot-via-altair@1430
import define1 from "./a33468b95d0b15b0@775.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["Altair_Plot.png",new URL("./files/340eb8ee184efcec05acbcfb6a0ec1c4799aac318568f43a66d22434d54693c42781fc0fb5706c184c2d2d3de94f0138e49a501671eeac97c6ce4f421302d8dc",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["FileAttachment","md"], async function(FileAttachment,md){return(
md`<img src="${await FileAttachment("Altair_Plot.png").url()}" width=640>


# Learning Observable Plot via Altair

Between 2018 and 2020 I was actively involved with the <a href="https://altair-viz.github.io/" target="_blank">Altair</a> community, creating many examples for the documentation and gallery. It was the first time I had used a visualization library inspired by a layered <a href="https://www.amazon.com/Grammar-Graphics-Statistics-Computing/dp/0387245448" target="_blank">grammar of graphics</a> and it was an eye-opening experience. Learning to use Altair, and understanding the <a href="https://vega.github.io/vega/" target="_blank">Vega</a>/<a href="https://vega.github.io/vega-lite/" target="_blank">Vega-Lite</a> projects it is built on, completely changed the way I think about visualization and the creation process. I even made a few <a href="https://youtube.com/playlist?list=PLT0KU4DMyMtGdtsHmsGCrY9nRurA1UeER" target="_blank">YouTube videos on the subject.</a>

When <a href="https://observablehq.com/@observablehq/plot" target="_blank">Observable Plot</a> was released in May 2021 I was impressed with the beautiful visualizations being created and wanted to make some of my own. Unfortunately, I didn't have the time back then to dive in and learn, but now I do!

### Disclaimers

The purpose of this notebook is selfish in nature; I am trying to learn Observable Plot. It is very similar in spirit to the piece <a href="https://observablehq.com/@observablehq/plot-vega-lite" target="_blank">Plot & Vega-Lite</a> by Ian Johnson, which I recommend. This notebook is not meant to be a tutorial or explainer, but I wanted to share anyways. My goal here is to take some of the examples from the <a href="https://altair-viz.github.io/gallery/index.html" target="_blank">Altair Example Gallery</a> and recreate them using Observable Plot, as a means of learning. I've decided to include many of the errors and difficulties experienced during the creation process, rather than only keep the final result. I think that sometimes it's important to see the false starts and misunderstandings as they can be informative.



I hope you enjoy! 😀


`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## The Data

Before we make any plots we need data. Most of the Altair examples utilize the <a href="https://github.com/vega/vega-datasets" target="_blank">Vega Datasets</a> repository, which can easily be integrated with Observable`
)});
  main.variable(observer("data")).define("data", ["require"], async function(require){return(
await require('vega-datasets@2')
)});
  main.variable(observer()).define(["md"], function(md){return(
md`With data in hand it's time to make some plots!`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Bar Charts`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Bar chart with negatives (<a href="https://altair-viz.github.io/gallery/bar_chart_with_negatives.html" target="_blank">reference</a>)

This wound up being a little more difficult than I initially expected. Let me take you on my journey ...`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Here was my initial attempt:`
)});
  main.variable(observer("usemployment")).define("usemployment", ["data"], function(data){return(
data['us-employment.csv']()
)});
  main.variable(observer()).define(["Plot","usemployment"], function(Plot,usemployment){return(
Plot.barY(usemployment, {x:'month', y:'nonfarm_change'}).plot()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`but clearly something is off with the x-axis. At first I thought that my date variable wasn't being converted to the correct type, but that wasn't the problem at all.

After a little digging around I found a <a href="https://talk.observablehq.com/t/limit-x-axis-labels-on-plot-bar-chart/5154" target="_blank">forum post</a> and an <a href="https://observablehq.com/d/707baa67dbdbd3dc" target="_blank">associated notebook</a> outlining the issue I was having and various solutions. 

The problem was that the \`Plot.barY\` mark creates an ordinal scale by default.

There were three suggested solutions:

**1. Use the \`Plot.barY\` mark with adjusted ticks**`
)});
  main.variable(observer()).define(["Plot","usemployment","d3"], function(Plot,usemployment,d3){return(
Plot.barY(usemployment, {x:'month', y:'nonfarm_change'}).plot({
  x: {
    ticks: d3.utcYear.range(...d3.extent(usemployment, (d) => d.month)),
    tickFormat: "%Y"
  }
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`**2. Use the \`Plot.areaY\` mark with a step curve**`
)});
  main.variable(observer()).define(["Plot","usemployment"], function(Plot,usemployment){return(
Plot.areaY(usemployment, 
           {x:'month', y:'nonfarm_change', curve:'step'}).plot()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`**3. Use the \`Plot.rectY\` mark with a \`Plot.binX\` aggregate.**`
)});
  main.variable(observer()).define(["Plot","usemployment","d3"], function(Plot,usemployment,d3){return(
Plot.rectY(usemployment, 
           Plot.binX({ y: "sum" }, 
                     { x: "month", y: "nonfarm_change", thresholds: d3.utcMonth, inset: 0 })
          ).plot()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Now for some color! I thought the \`Plot.areaY\` version looked nice so I started there by encoding the fill with a conditional statement and setting the color scale but I ran into some trouble. `
)});
  main.variable(observer()).define(["Plot","usemployment"], function(Plot,usemployment){return(
Plot.plot({
  color: {
    domain: ["positive", "negative"],
    range: ["steelblue", "orange"]
  },
  marks: [
    Plot.areaY(usemployment, {
      x:'month', 
      y:'nonfarm_change', 
      curve:'step', 
      fill: d => d.nonfarm_change > 0 ? "positive" : "negative"})
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`There is some unwanted blue showing on top of the orange section. Rather than figuring out what went wrong and trying to fix it, instead, I applied the conditional fill to the other methods to see if they worked. 

The \`Plot.rectY\` version looked pretty good and probably most closely matched the reference. Still, I felt the dividing lines between the bars looked a little funny, almost too thin. `
)});
  main.variable(observer()).define(["Plot","usemployment","d3"], function(Plot,usemployment,d3){return(
Plot.plot({
  color: {
    domain: ["positive", "negative"],
    range: ["steelblue", "orange"]
  },
  marks: [
    Plot.rectY(usemployment, Plot.binX({ y: "sum" }, { x: "month", y: "nonfarm_change", thresholds: d3.utcMonth, inset: 0, fill: d => d.nonfarm_change > 0 ? "positive" : "negative"}))
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`It was the \`Plot.barY\` version that I ended up liking the best though. I added a rule at zero as a reference. `
)});
  main.variable(observer()).define(["Plot","usemployment","d3"], function(Plot,usemployment,d3){return(
Plot.plot({
  color: {
    domain: ["positive", "negative"],
    range: ["steelblue", "orange"]
  },
  marks: [
    Plot.barY(usemployment, {
      x:'month', 
      y:'nonfarm_change', 
      fill: d => d.nonfarm_change > 0 ? "positive" : "negative"
    }), 
    Plot.ruleY([0])
  ], 
    x: {
    ticks: d3.utcYear.range(...d3.extent(usemployment, (d) => d.month)),
    tickFormat: "%Y"
  }
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`I also discovered that if I use the same conditional on the \`fill\` and \`stroke\` parameters then I recover a similar look to the \`Plot.areaY\` mark from earlier.`
)});
  main.variable(observer()).define(["Plot","usemployment","d3"], function(Plot,usemployment,d3){return(
Plot.plot({
  color: {
    domain: ["positive", "negative"],
    range: ["steelblue", "orange"]
  },
  marks: [
    Plot.barY(usemployment, {
      x:'month', 
      y:'nonfarm_change', 
      fill: d => d.nonfarm_change > 0 ? "positive" : "negative", 
      stroke: d => d.nonfarm_change > 0 ? "positive" : "negative"
    }), 
    Plot.ruleY([0])
  ], 
    x: {
    ticks: d3.utcYear.range(...d3.extent(usemployment, (d) => d.month)),
    tickFormat: "%Y"
  }
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Grouped Bar Chart (<a href="https://altair-viz.github.io/gallery/grouped_bar_chart.html" target="_blank">reference</a>)`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Here is my initial attempt:`
)});
  main.variable(observer("barley")).define("barley", ["data"], function(data){return(
data["barley.json"]()
)});
  main.variable(observer()).define(["Plot","barley"], function(Plot,barley){return(
Plot.plot({
    facet: {
    data: barley,
    x: "site"
  },
  marks : [
    Plot.barY(barley, Plot.groupX({y: "mean"}, {x: "year", y: "yield", fill:"year"}))
    ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`but I ran into trouble when trying to set the colors explicitly because \`year\` was not an ordinal variable. To remedy this issue I converted \`year\` to a string before plotting`
)});
  main.variable(observer("barley_converted")).define("barley_converted", ["data"], async function(data){return(
(await data["barley.json"]()).map(d=>({
  year: d['year'].toString(), 
  yield: d['yield'], 
  site: d['site']
}))
)});
  const child1 = runtime.module(define1);
  main.import("swatches", "Swatches", child1);
  main.variable(observer()).define(["Swatches","d3","barley"], function(Swatches,d3,barley){return(
Swatches({color: d3.scaleOrdinal(barley.map(d => d.year).sort(), d3.schemeTableau10)})
)});
  main.variable(observer()).define(["Plot","barley_converted"], function(Plot,barley_converted){return(
Plot.plot({
    facet: {
    data: barley_converted,
    x: "site"
  },
  marks : [
    Plot.barY(barley_converted, Plot.groupX({y: "mean"}, {x: "year", y: "yield", fill:"year"}))
    ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The only other hang-up here was with respect to the legend, which I know is coming to Plot soon. I found a quick solution in the documentation which uses the \`Swatches\` function. `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Layered Bar Chart (<a href="https://altair-viz.github.io/gallery/layered_bar_chart.html" target="_blank">reference</a>)

Again here I had some trouble with the ordinal encoding of dates, but now I know what to do! Here I introduced a parameter \`mixBlendMode\` which controls how the colors interacted when being layered`
)});
  main.variable(observer("iowa")).define("iowa", ["data"], function(data){return(
data['iowa-electricity.csv']()
)});
  main.variable(observer()).define(["Swatches","d3","iowa"], function(Swatches,d3,iowa){return(
Swatches({color: d3.scaleOrdinal(iowa.map(d => d.source).sort(), d3.schemeTableau10)})
)});
  main.variable(observer()).define(["Plot","iowa"], function(Plot,iowa){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.barY(iowa, {x: "year", y2: "net_generation", fill: "source", mixBlendMode: "normal", fillOpacity:0.7}),
    Plot.ruleY([0])
  ]
})
)});
  main.variable(observer()).define(["Swatches","d3","iowa"], function(Swatches,d3,iowa){return(
Swatches({color: d3.scaleOrdinal(iowa.map(d => d.source).sort(), d3.schemeTableau10)})
)});
  main.variable(observer()).define(["Plot","d3","iowa"], function(Plot,d3,iowa){return(
Plot.plot({
x: {
    ticks: d3.timeTicks(...d3.extent(iowa, (d) => d.year), d3.utcYear),
    tickFormat: "%Y"
  },
  y: {
    grid: true
  },
  marks: [
    Plot.barY(iowa, {x: "year", y2: "net_generation", fill: "source", mixBlendMode: "normal", fillOpacity:0.7}),
    Plot.ruleY([0])
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Note the use of \`d3.timeTicks\` here to create an inclusive range. `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`I wasn't quite sure how to match the opacity in the legend, but that's ok. I keep reminding myself, legends are coming soon!`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Trellis Stacked Bar Chart (<a href="https://altair-viz.github.io/gallery/trellis_stacked_bar_chart.html" target="_blank">reference</a>)`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Pretty straight forward, except I needed to add to the left margin so that the labels didn't overlap. I also explicitly ordered the bars to match the reference`
)});
  main.variable(observer()).define(["Swatches","d3","barley"], function(Swatches,d3,barley){return(
Swatches({color: d3.scaleOrdinal(barley.map(d => d.site).sort(), d3.schemeTableau10)})
)});
  main.variable(observer()).define(["Plot","barley"], function(Plot,barley){return(
Plot.plot({
  marginLeft: 110,
  facet:{
    data: barley,
    x: "year",
  },
  marks: [
    Plot.barX(barley, {x:"yield", y:"variety", fill:"site", order:"site", reverse:'true'})
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Line Charts`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Multi Series Line Chart (<a href="https://altair-viz.github.io/gallery/multi_series_line.html" target="_blank">reference</a>)

For this example, I couldn't figure out how to change the line style to encode the symbol information. `
)});
  main.variable(observer("stocks")).define("stocks", ["data"], async function(data){return(
(await data['stocks.csv']()).map(d=>({
  date: new Date(d['date']), 
  price: +d.price, 
  symbol: d.symbol
}))
)});
  main.variable(observer()).define(["Swatches","d3","stocks"], function(Swatches,d3,stocks){return(
Swatches({color: d3.scaleOrdinal(stocks.map(d => d.symbol).sort(), d3.schemeTableau10)})
)});
  main.variable(observer()).define(["Plot","stocks"], function(Plot,stocks){return(
Plot.plot({
  marks:[
    Plot.line(stocks, {x:'date', y:'price', stroke:'symbol'})
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Filled Step Chart (<a href="https://altair-viz.github.io/gallery/filled_step_chart.html" target="_blank">reference</a>)`
)});
  main.variable(observer("google")).define("google", ["stocks"], function(stocks){return(
stocks.filter(d=>d.symbol==='GOOG')
)});
  main.variable(observer()).define(["Plot","google"], function(Plot,google){return(
Plot.plot({
  marks:[
    Plot.line(google, {x:'date', y:'price', curve:'step', stroke:'steelblue', strokeWidth:2}), 
    Plot.areaY(google, {x:'date', y:'price', curve:'step', fill:'steelblue', fillOpacity:0.3}),
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Slope Chart (<a href="https://altair-viz.github.io/gallery/slope_graph.html" target="_blank">reference</a>)`
)});
  main.variable(observer()).define(["Swatches","d3","barley"], function(Swatches,d3,barley){return(
Swatches({color: d3.scaleOrdinal(barley.map(d => d.site).sort(), d3.schemeTableau10)})
)});
  main.variable(observer()).define(["Plot","barley_converted"], function(Plot,barley_converted){return(
Plot.plot({
  width:180,
  y:{inset:10},
  marks : [
    Plot.lineY(barley_converted, Plot.groupX({y: "median"}, {x: "year", y: "yield", stroke:"site"})),
    Plot.dotY(barley_converted, Plot.groupX({y: "median"}, {x: "year", y: "yield", fill:"site"}))
    ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Line Chart with Percent axis (<a href="https://altair-viz.github.io/gallery/line_percent.html" target="_blank">reference</a>)`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`I had to tack on some extra information to the date variable such that the conversion to a date would work correctly`
)});
  main.variable(observer("welders")).define("welders", ["data"], async function(data){return(
(await data['jobs.json']()).filter(d=>d.job==='Welder').map(d=>({
  date: new Date(d.year+'-01-01'), perc:+d.perc, sex:d.sex
}))
)});
  main.variable(observer()).define(["Swatches","d3","welders"], function(Swatches,d3,welders){return(
Swatches({color: d3.scaleOrdinal(welders.map(d => d.sex).sort(), d3.schemeTableau10)})
)});
  main.variable(observer()).define(["Plot","d3","welders"], function(Plot,d3,welders){return(
Plot.plot({
  inset:20,
  y:{
    tickFormat: d3.format(".1%"), 
    grid:true
  },
  marks:[
    Plot.ruleY([0]),
    Plot.line(welders, {x:"date", y:"perc", stroke:'sex', strokeWidth:3})
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Area Charts`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Normalized Stacked Area Chart (<a href="https://altair-viz.github.io/gallery/normalized_stacked_area_chart.html" target="_blank">reference</a>)`
)});
  main.variable(observer()).define(["Swatches","d3","iowa"], function(Swatches,d3,iowa){return(
Swatches({color: d3.scaleOrdinal(iowa.map(d => d.source).sort(), d3.schemeTableau10)})
)});
  main.variable(observer()).define(["Plot","iowa"], function(Plot,iowa){return(
Plot.plot({
  marks:[
    Plot.areaY(iowa, Plot.stackY({
      x:'year', 
      y:'net_generation', 
      z:'source', 
      fill:'source',
      offset: "expand", 
      reverse:true
    }))
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Layered Area Chart (<a href="https://altair-viz.github.io/gallery/layered_area_chart.html" target="_blank">reference</a>)`
)});
  main.variable(observer()).define(["Plot","iowa"], function(Plot,iowa){return(
Plot.plot({
  marginLeft:50,
  marks: [
    Plot.areaY(iowa, {
      x: "year", y2: "net_generation", 
      fill: "source", mixBlendMode: "normal", fillOpacity:0.3}),
    Plot.ruleY([0])
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Trellis Area Chart (<a href="https://altair-viz.github.io/gallery/trellis_area.html" target="_blank">reference</a>)`
)});
  main.variable(observer()).define(["Swatches","d3","iowa"], function(Swatches,d3,iowa){return(
Swatches({color: d3.scaleOrdinal(iowa.map(d => d.source).sort(), d3.schemeTableau10)})
)});
  main.variable(observer()).define(["Plot","iowa"], function(Plot,iowa){return(
Plot.plot({
  grid:true,
  facet:{
    data:iowa, 
    y:'source', 
    marginRight:100,
    marginLeft:20
  },
  marks: [
    Plot.areaY(iowa, {
      x: "year", y2: "net_generation", 
      fill: "source"}),
    Plot.ruleY([0])
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Streamgraph (<a href="https://altair-viz.github.io/gallery/streamgraph.html" target="_blank">reference</a>)

This is kind of a silly example. There are way too many categories and currently Plot doesn't include the "category20b" color scale. `
)});
  main.variable(observer("unemployment")).define("unemployment", ["data"], async function(data){return(
(await data['unemployment-across-industries.json']()).map(d=>({
  date: new Date(d.date), 
  count: d.count, 
  series: d.series
}))
)});
  main.variable(observer()).define(["Swatches","d3","unemployment"], function(Swatches,d3,unemployment){return(
Swatches({color: d3.scaleOrdinal(unemployment.map(d => d.series).sort(), d3.schemePaired)})
)});
  main.variable(observer()).define(["Plot","unemployment"], function(Plot,unemployment){return(
Plot.plot({
  x: {
    grid: true,
  },
  marks: [
    Plot.areaY(unemployment, Plot.stackY({offset: "silhouette", x: "date", y: "count", fill: "series"}))
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Scatter Plots`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### The Canonical Cars Scatter Plot (references: <a href="https://altair-viz.github.io/gallery/scatter_tooltips.html" target="_blank">1</a>,<a href="https://altair-viz.github.io/gallery/scatter_href.html" target="_blank">2</a>,<a href="https://altair-viz.github.io/gallery/interactive_scatter_plot.html" target="_blank">3</a>,<a href="https://altair-viz.github.io/gallery/scatter_linked_brush.html" target="_blank">4</a>,<a href="https://altair-viz.github.io/gallery/selection_histogram.html" target="_blank">5</a>,<a href="https://altair-viz.github.io/gallery/dot_dash_plot.html" target="_blank">6</a>)

A scatter plot of the \`cars\` dataset is often the first visualization I try to make when learning to use a new tool. I use it as a sort of benchmark to compare different visualization libraries. 

I think this Observable Plot version came out looking really nice!`
)});
  main.variable(observer("cars")).define("cars", ["data"], function(data){return(
data['cars.json']()
)});
  main.variable(observer()).define(["Swatches","d3","cars"], function(Swatches,d3,cars){return(
Swatches({color: d3.scaleOrdinal(cars.map(d => d.Origin).sort(), d3.schemeTableau10)})
)});
  main.variable(observer()).define(["Plot","cars"], function(Plot,cars){return(
Plot.plot({
  inset:20,
  marks:[
    Plot.dot(cars, {
      x:'Horsepower',
      y:'Miles_per_Gallon', 
      fill:'Origin', 
      r:10, stroke:'black', strokeWidth:1
    })
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Table Bubble Plot (Github Punch Card) (<a href="https://altair-viz.github.io/gallery/table_bubble_plot_github.html" target="_blank">reference</a>)

This example is a slightly modified version from the example shown in <a href="https://observablehq.com/@observablehq/plot-vega-lite" target="_blank">Plot & Vega-Lite</a> By Ian Johnson`
)});
  main.variable(observer("commits")).define("commits", ["data"], async function(data){return(
(await data['github.csv']()).map(d=>({
  time: new Date(d.time), count:+d.count
}))
)});
  main.variable(observer()).define(["Plot","commits"], function(Plot,commits){return(
Plot.plot({
  x: {
    inset: 10,
    ticks: 24
  },
  y: {
    type: "point",
    tickFormat: Plot.formatWeekday()
  },
  marks: [
    Plot.dot(commits, Plot.group({r: "sum", title: "sum"}, {
      y: d => d.time.getDay(),
      x: d => d.time.getHours(),
      r: "count",
      fill: "steelblue"
    }))
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Scatter Plot with Rolling Mean (<a href="https://altair-viz.github.io/gallery/scatter_with_rolling_mean.html" target="_blank">reference</a>)

Note the default window parameters for **anchor** is _middle_ and **reduce** is _mean_.`
)});
  main.variable(observer("seattle_weather")).define("seattle_weather", ["data"], function(data){return(
data['seattle-weather.csv']()
)});
  main.variable(observer()).define(["Plot","seattle_weather"], function(Plot,seattle_weather){return(
Plot.plot({
  grid:true,
  marks:[
    Plot.dot(seattle_weather, {x: 'date', y:'temp_max', stroke:'steelblue'}), 
    Plot.line(seattle_weather, Plot.windowY({x: "date", y: "temp_max", k: 15, stroke: "red", strokeWidth:3}))
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Stripplot (<a href="https://altair-viz.github.io/gallery/stripplot.html" target="_blank">reference</a>)`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`I liked how this one turned out. The only trouble I did have was that I couldn't figure out how to rotate the facet labels, so instead, I modified the data to reduce label size.  `
)});
  main.variable(observer("movies")).define("movies", ["data"], async function(data){return(
(await data['movies.json']()).map(d=>({
  'Major Genre':String(d['Major Genre']).split('/')[0],
  'IMDB Rating':d['IMDB Rating'] 
}))
)});
  main.variable(observer()).define(["Plot","width","movies"], function(Plot,width,movies){return(
Plot.plot({
  width:width,
  x:{
    axis:false
  },
  facet:{
    data:movies, 
    x: 'Major Genre', 
  },
  marks:[
    Plot.dot(movies, {
      y:'IMDB Rating', 
      x:d=>Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random()), 
      fill:'Major Genre'})
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Conclusion

Congratulations for making it all the way to the end! 🎉

(Unless you just skipped here 😠)

I wanted to conclude by summarizing a few of the thoughts I had while creating this piece:

- Learning by parroting examples is the method I have employed here. It's ok, but not always the best way to learn. I feel that now I have a better understanding of what I know and where the gaps are. This will make doing detailed tutorials more fruitful in the future. 

- I have found when scouring the documentation looking for a solution, I end up finding other nuggets of knowledge that enhance my general understanding. This is not a reliable method for cultivating understanding as it is stochastic but is probably a more realistic model for how/when learning occurs in the wild.

- I find myself wanting to do things the "Vega-Way" by including all of my transformations and everything inside the visualization specification, but that pattern does not always translate into using Plot. The slightly different mindset is something I am trying to cultivate and I think I have improved.  

- Some more advanced and bespoke transformations are not currently implemented in Plot. It is a new project and has lots of new features planned. I can't wait! Plot 1.0 is going to be awesome!

I especially want to thank <a href="https://observablehq.com/@mbostock" target="_blank">Mike Bostock</a>, <a href="https://observablehq.com/@fil" target="_blank">Fil</a>, and <a href="https://observablehq.com/@enjalot" target="_blank">Ian Johnson</a> for their work on Plot and the excellent examples/tutorials throughout the documentation.

Till next time!

_- Eitan Lees_`
)});
  return main;
}
