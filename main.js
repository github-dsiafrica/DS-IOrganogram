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
		if (
			value != "" &&
			(d.title.toLowerCase().includes(value.toLowerCase()) ||
				d.acronym.toLowerCase().includes(value.toLowerCase()) ||
				d.pi.toLowerCase().includes(value.toLowerCase()))
		) {
			// If matches, mark node as highlighted
			d._highlighted = true;
			d._expanded = true;
		}
	});

	// Update data and rerender graph
	chart.data(data).render().fit();

	console.log("filtering chart", e.srcElement.value);
}

d3.csv(
	"https://raw.githubusercontent.com/github-dsiafrica/DS-IOrganogram/main/public/data/data.csv"
).then((data) => {
	data.forEach((d) => {
		d._expanded = true;
	});
	chart = new d3.OrgChart()
		.nodeHeight((d) => 85 + 25)
		.nodeWidth((d) => 220 + 2)
		.linkUpdate(function (d, i, arr) {
			d3.select(this).attr("stroke", "black");
		})
		.childrenMargin((d) => 50)
		.compactMarginBetween((d) => 35)
		.compactMarginPair((d) => 30)
		.neighbourMargin((a, b) => 20)
		.nodeContent(function (d, i, arr, state) {
			const color = "#FFFFFF";
			const imageDiffVert = 25 + 2;
			return d.data.featured === "true"
				? `<a href="${d.data.link}" target="_blank" style='width:${
						d.width
				  }px;height:${d.height}px;padding-top:${
						imageDiffVert - 2
				  }px;padding-left:1px;padding-right:1px'>
					  <div style="font-family: 'Inter', sans-serif;background-color:${color};  margin-left:-1px;width:${
						d.width - 2
				  }px;height:${
						d.height - imageDiffVert
				  }px;border-radius:10px;border: 1px solid #E4E2E9">
						  
						  <div style="background-color:${color};margin-top:${
						-imageDiffVert - 20
				  }px;margin-left:${15}px;border-radius:100px;width:50px;height:50px;" ></div>
						  
						  <div style="font-size:15px;color:#08011E;margin-left:20px;margin-top:10px">  ${
								d.data.title
							} </div>
						  <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;"> ${
								d.data.country
							} </div>

					  </div>
				  </a>`
				: `<a href="${d.data.link}" target="_blank" style='width:${
						d.width
				  }px;height:${d.height}px;padding-top:${
						imageDiffVert - 2
				  }px;padding-left:1px;padding-right:1px'>
					  <div style="font-family: 'Inter', sans-serif;background-color:${color};  margin-left:-1px;width:${
						d.width - 2
				  }px;height:${
						d.height - imageDiffVert
				  }px;border-radius:10px;border: 1px solid #E4E2E9">
						  
						  <div style="background-color:${color};margin-top:${
						-imageDiffVert - 20
				  }px;margin-left:${15}px;border-radius:100px;width:50px;height:50px;" ></div>
						  <div style="margin-top:${-imageDiffVert - 20}px;">   <img src=" ${
						d.data.picture
				  }" style="margin-left:${20}px;border-radius:100px;width:40px;height:40px;" /></div>
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
		.render()
		.fit();
});

document.getElementById("fit").addEventListener("click", () => chart.fit());
document
	.getElementById("expand")
	.addEventListener("click", () => chart.expandAll().fit());
document
	.getElementById("collapse")
	.addEventListener("click", () => chart.collapseAll().fit());
document
	.getElementById("search")
	.addEventListener("input", (event) => filterChart(event));
