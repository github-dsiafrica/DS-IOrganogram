# DS-I Africa Organogram

This app uses d3-org-chart and TailwindCSS to create an organogram which shows the members of the DS-I Africa projects.

## How it Works

The data is specified in CSV format in `data/data.csv`. Each project, member and member info is listed as a line in the CSV and are linked through the use of IDs and parent IDs. This information is then used by d3-org-chart to visualise the organogram and styled with TailwindCSS.

## How to Run

1. Run `yarn` to install the dependencies
2. Run `yarn dev` to run locally.
