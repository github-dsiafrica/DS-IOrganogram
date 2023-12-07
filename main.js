let chart;

/**
 * Truncates a string to the specified length and appends an ellips at the end. If the string is shorter than the specified length, the original string is returned.
 * @param {string} text The string you want to be potentially truncated
 * @param {number} length The point at which the string should be truncated
 * @returns The truncated string.
 */
const truncate = (text, length) =>
	text.length > length ? text.substring(0, length) + " ..." : text;

/**
 * Searches for an entire word match.
 * @param {string} text The original text you are searching against
 * @param {string} searchTerm The term you are searching for in the original text
 * @returns True if the search term is found in the text, false otherwise.
 */
const searchWholeWord = (text, searchTerm) => {
	// Escape special characters in the search term
	const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

	// Create a regular expression with word boundaries
	const regex = new RegExp("\\b" + escapedSearchTerm + "\\b", "i");

	// Test if the text contains a whole word match
	return regex.test(text);
};

/**
 * Highlights and expends nodes which match the search term.
 * @param {Event} e DOM Evebt
 */
const filterChart = (e) => {
	const value = e.target.value;

	chart.clearHighlighting();

	// Get chart nodes
	const data = chart.data();

	// Mark all previously expanded nodes for collapse
	data.forEach((d) => (d._expanded = false));

	// Loop over data and check for matches in search term
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
			d._upToTheRootHighlighted = true;
			d._expanded = true;
		}
	});

	// Update data and rerender graph
	chart.data(data).render().fit();
};

/**
 * Determines the appropriate height for a node based on the length of the content.
 * @param {d3 OrgChart node} node A node from the org-chart
 * @returns The appropriate height for that node.
 */
const calculateCustomHeight = (node) => {
	// Get lengths of content.
	const titleLength = node.title.length;
	const acronymLength = node.acronym.length;
	const institutionLength = node.institution.length;

	// Calculate heights based on node type.
	switch (node.type) {
		case "group": {
			let group = 110;
			if (titleLength >= 47) group += Math.floor(titleLength / 47) * 28;
			return group;
		}
		case "project": {
			let project = 420;
			if (titleLength >= 40) project += Math.floor(titleLength / 40) * 28;
			if (acronymLength >= 22) project += Math.floor(acronymLength / 22) * 35;
			if (institutionLength >= 38)
				project += Math.floor(institutionLength / 38) * 30;

			// Edge cases
			if (node.id === "33" || node.id === "34" || node.id === "39")
				project += 30;
			if (node.id == "23" || node.id == "29") project -= 30;
			return project;
		}
		case "member": {
			let member = 335;
			if (titleLength >= 22) member += Math.floor(titleLength / 22) * 35;
			return member;
		}
		case "info": {
			return 220;
		}
		default: {
			return 100;
		}
	}
};

// Read data from CSV
d3.csv("/data/data.csv").then((data) => {
	// Mark only nodes of type group and project to be expanded.
	data.forEach((d) => {
		d._expanded = d.type === "group" || d.type === "project";
		// d._highlighted = true;
		// d._upToTheRootHighlighted = true;
	});

	chart = new d3.OrgChart()
		// Adjust node height according to type of node
		.nodeHeight((d) => calculateCustomHeight(d.data))
		.nodeWidth((/*d*/) => 350)
		// Change highlight colour to red.
		.nodeUpdate(function (/*d, i, arr*/) {
			d3.select(this)
				.select(".node-rect")
				.attr("stroke", (d) => (d.data._highlighted ? "#e41619" : "none"))
				.attr("stroke-width", 10);
		})
		// Change line colour to blue and red when highlighted.
		.linkUpdate(function (d /*, i, arr*/) {
			d3.select(this)
				.attr("stroke", (d) => (d.data._highlighted ? "#e41619" : "#1479a7"))
				.attr("stroke-width", (d) => (d.data._upToTheRootHighlighted ? 10 : 1));

			if (d.data._upToTheRootHighlighted) {
				d3.select(this).raise();
			}
		})
		.childrenMargin((/*d*/) => 100)
		.siblingsMargin((/*d*/) => 100)
		.compactMarginBetween((/*d*/) => 200)
		.compactMarginPair((/*d*/) => 300)
		.neighbourMargin((/*a, b*/) => 500)
		.nodeContent(function (d /*, i, arr, state*/) {
			// Render different HTML depending on the type of node
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
					class="rounded-full max-w-full aspect-square h-48 border-[6px] border-white absolute top-[-80%] left-1/2 -translate-x-1/2 object-cover"
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
						class="rounded-full max-w-full aspect-square object-cover h-48 border-[6px] border-white mt-4"
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
					<span class="font-bold">Bio: </span>${truncate(d.data.bio, 210)}
					</a>
					<p class="text-[#1479a7] text-lg pt-1">
						<span class="font-bold">Expertise: </span>${truncate(d.data.expertise, -1)}
					</p>
					
				</div>
			</div>`;
		})
		.container(".chart-container")
		.data(data)
		.render()
		.fit();
});

// Configure fit button.
document.getElementById("fit").addEventListener("click", () => chart.fit());

// Configure reset button.
document.getElementById("reset").addEventListener("click", () => {
	document.getElementById("search").form.reset();

	// Mark only nodes of type group and project to be expanded.
	chart.data().forEach((d) => {
		chart.setExpanded(d.id, d.type === "group" || d.type === "project");
		d._highlighted = false;
		d._upToTheRootHighlighted = false;
	});

	// Re-render chart.
	chart.render().fit();
});

// Configure search box.
document
	.getElementById("search")
	.addEventListener("input", (event) => filterChart(event));
