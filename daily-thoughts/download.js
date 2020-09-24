
const fetch = require('node-fetch');
const {writeFileSync} = require('fs');


// I tried increasing the pagination to 500 to fit results into a single page, but I guess
// The server sets the limit to 50.
// I used the syntax &page%5Blimit%5D=5 &page[limit]=5
async function downloadDailyThoughts() {

	// I got this query using the JSON:API explorer
	// https://joshyorndorff.com/jsonapi/explorer/app
	const firstQuery = 'https://joshyorndorff.com/jsonapi/node/daily?fields[node--daily]=body,created,title&sort=created';

	// An array to store all the processed thought objects
	let allDailyThoughts = [];
	let query = firstQuery;

	// Results from drupal are paged, so we have to loop until there are no
	// more pages
	while (typeof query !== "undefined") {
		console.log("entering loop");
		console.log(typeof query);
		console.log(typeof query !== undefined);

		let response = await fetch(query)
			.then(response => response.json());
		let oldThoughts = response.data.map(datum => datum.attributes);

		// console.log(thoughts);

		// Analyze the first several thoughts first
		for ({ created, title, body } of oldThoughts) {

			console.log(`\n${title} (${created})`);
			console.log(body.value);

			let newThought = {
				title,
				date: created,
				body: body.value,
			};

			allDailyThoughts.push(newThought);
		}

		query = response.links.next;
		console.log("\n\n#############################################");
		console.log(`Checking for next page: ${query}`);
		console.log(`Processed ${allDailyThoughts.length} thoughs so far.`);
		console.log("#############################################");
	}

	// How many results did we process
	console.log(`Processed ${allDailyThoughts.length} values`);
	writeFileSync("dailyThoughts.json", JSON.stringify(allDailyThoughts));
}

async function downloadRunningLog() {

	// I got this query using the JSON:API explorer
	// https://joshyorndorff.com/jsonapi/explorer/app
	const firstQuery = 'https://joshyorndorff.com/jsonapi/node/run';

	// An array to store all the processed thought objects
	let allRunLogs = [];
	let query = firstQuery;

	// Results from drupal are paged, so we have to loop until there are no
	// more pages
	while (typeof query !== "undefined") {
		console.log("entering loop");
		console.log(typeof query);
		console.log(typeof query !== undefined);

		let response = await fetch(query)
			.then(response => response.json());
		let oldRuns = response.data.map(datum => datum.attributes);

		console.log(oldRuns[0]);


		// Analyze the first several thoughts first
		for ({ field_date, field_distance, field_type, body } of oldRuns) {

			console.log(`\n${field_date}: ${field_distance}km (${field_type})`);
			console.log(body.value);

			let newRun = {
				date: field_date,
				distance: field_distance,
				notes: body.value,
				type: field_type, // RUN or BIKE
			};

			allRunLogs.push(newRun);
		}

		query = response.links.next;
		console.log("\n\n#############################################");
		console.log(`Checking for next page: ${query}`);
		console.log(`Processed ${allRunLogs.length} runs so far.`);
		console.log("#############################################");
	}

	// How many results did we process
	console.log(`Processed ${allRunLogs.length} values`);
	writeFileSync("runningLog.json", JSON.stringify(allRunLogs));
}

// downloadDailyThoughts();
downloadRunningLog();
