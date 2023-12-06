let chart;

const truncate = (text, length) => text.substring(0, length);

const searchWholeWord = (text, searchTerm) => {
	// Escape special characters in the search term
	const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

	// Create a regular expression with word boundaries
	const regex = new RegExp("\\b" + escapedSearchTerm + "\\b", "i");

	// Test if the text contains a whole word match
	return regex.test(text);
};

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
		const searchTerm = value.toLowerCase();
		if (
			value != "" &&
			(searchWholeWord(d.title, searchTerm) ||
				searchWholeWord(d.acronym, searchTerm) ||
				searchWholeWord(d.pi, searchTerm) ||
				searchWholeWord(d.institution, searchTerm) ||
				searchWholeWord(d.country, searchTerm) ||
				searchWholeWord(d.bio, searchTerm) ||
				searchWholeWord(d.expertise, searchTerm))
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

d3.csv("/data/data.csv").then((data) => {
	data.forEach((d) => {
		d._expanded = d.type === "group" || d.type === "project";
	});
	chart = new d3.OrgChart()
		.nodeHeight((d) =>
			d.data.type === "group"
				? 130
				: d.data.type === "member"
				? 350
				: d.data.type === "info"
				? 250
				: 450
		)
		.nodeWidth((d) => 350)
		.linkUpdate(function (d, i, arr) {
			d3.select(this).attr("stroke", "#1479a7");
		})

		.childrenMargin((d) => 100)
		.siblingsMargin((d) => 100)
		.compactMarginBetween((d) => 200)
		.compactMarginPair((d) => 300)
		.neighbourMargin((a, b) => 500)
		.nodeContent(function (d, i, arr, state) {
			return d.data.type === "group"
				? `<a href="${d.data.link}"  class="max-w-md shadow-2xl shadow-[#1479a7]">
				<header
					class="font-bold bg-[#e41619] text-white text-3xl text-center p-2"
				>
					${d.data.acronym}
				</header>
				<div class="bg-[#ecf0f6]">
					<div class="p-2">
						<p class="text-center font-bold text-[#1479a7] text-lg pt-1">
							${d.data.title}
						</p>
					</div>
				</div>
			</a>`
				: d.data.type === "project"
				? `<a href="${d.data.link}"  class="max-w-md shadow-2xl shadow-[#1479a7]">
			<header
				class="font-bold bg-[#e41619] text-white text-3xl text-center p-2"
			>
				${d.data.acronym}
			</header>
			<div class="bg-[#ecf0f6] pb-28">
				<div class="p-2">
					<p class="text-center text-lg">
						${d.data.title}
					</p>
					<p class="text-center font-bold text-[#1479a7] text-lg pt-1">
						${d.data.institution}
					</p>
					<p class="text-center text-[#1479a7] text-xl">${d.data.country}</p>
				</div>
			</div>
			<footer class="bg-[#1479a7] relative">
				<img
					class="rounded-full max-w-full aspect-square h-48 border-[6px] border-white absolute top-[-80%] left-1/2 -translate-x-1/2"
					src=${d.data.picture}
					alt="PI Photo"
				/>
				
				<p class="text-center text-white text-xl pt-24 pb-4">
					<span class="font-bold">Contact PI: </span>${d.data.pi}
				</p>
			</footer>
		</a>`
				: d.data.type === "member"
				? `<div class="max-w-md">
				<header
					class="font-bold bg-[#e41619] text-white text-3xl text-center p-2"
				>
					${d.data.title}
				</header>
				
				<div class="bg-[#1479a7] flex items-center justify-center flex-col gap-4">
					<img
						class="rounded-full max-w-full aspect-square h-48 border-[6px] border-white mt-4"
						src=${d.data.picture}
						alt="PI Photo"
					/>

					<p class="text-center text-white text-xl  pb-4 font-bold">
					${d.data.role}</p>
				</div>
			</div>`
				: `<div class="bg-[#ecf0f6]">
				<div class="p-2">
					<a href="${d.data.link}" class="text-lg">
					<span class="font-bold">Bio: </span>${truncate(d.data.bio, 300)}
					</a>
					<p class="text-[#1479a7] text-lg pt-1">
						<span class="font-bold">Expertise: </span>${truncate(d.data.expertise, 100)}
					</p>
					
				</div>
			</div>`;
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
