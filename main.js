let chart;

function filterChart(e) {
	// Get input value
	const value = e.srcElement.value;

	// Clear previous higlighting
	chart.clearHighlighting();

	// Get chart nodes
	const data = chart.data();

	// Mark all previously expanded nodes for collapse
	data.forEach((d) => (d._expanded = false));

	// Loop over data and check if input value matches any name
	data.forEach((d) => {
		if (value != "" && d.title.toLowerCase().includes(value.toLowerCase())) {
			// If matches, mark node as highlighted
			d._highlighted = true;
			d._expanded = true;
		}
	});

	// Update data and rerender graph
	chart.data(data).render().fit();

	console.log("filtering chart", e.srcElement.value);
}

// This is the data used - https://github.com/bumbeishvili/sample-data/blob/main/data-oracle.csv
d3.csv("./data/data.csv").then((data) => {
	chart = new d3.OrgChart()
		.nodeHeight((d) => 85 + 25)
		.nodeWidth((d) => 220 + 2)
		.childrenMargin((d) => 50)
		.compactMarginBetween((d) => 35)
		.compactMarginPair((d) => 30)
		.neighbourMargin((a, b) => 20)
		.nodeContent(function (d, i, arr, state) {
			const color = "#FFFFFF";
			const imageDiffVert = 25 + 2;
			return ` <a href="https://dsi-africa.org" target="_blank" style='width:${
				d.width
			}px;height:${d.height}px;padding-top:${imageDiffVert - 2}px;padding-left:1px;padding-right:1px'>
					  <div style="font-family: 'Inter', sans-serif;background-color:${color};  margin-left:-1px;width:${d.width - 2}px;height:${d.height - imageDiffVert}px;border-radius:10px;border: 1px solid #E4E2E9">
						  <div style="display:flex;justify-content:flex-end;margin-top:5px;margin-right:8px">#${
								d.data.id
							}</div>
						  <div style="background-color:${color};margin-top:${-imageDiffVert - 20}px;margin-left:${15}px;border-radius:100px;width:50px;height:50px;" ></div>
						  <div style="margin-top:${
								-imageDiffVert - 20
							}px;">   <img src=" ${d.data.picture}" style="margin-left:${20}px;border-radius:100px;width:40px;height:40px;" /></div>
						  <div style="font-size:15px;color:#08011E;margin-left:20px;margin-top:10px">  ${
								d.data.title
							} </div>
						  <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;"> ${
								d.data.country
							} </div>

					  </div>
				  </a>`;
		})
		.container(".chart-container")
		.data(data)
		.render();
});
