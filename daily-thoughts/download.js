
const fetch = require('node-fetch');

// I got this query using the JSON:API explorer
// https://joshyorndorff.com/jsonapi/explorer/app
const query = 'https://joshyorndorff.com/jsonapi/node/daily?fields[node--daily]=body,created,title&sort=created';

// I tried increasing the pagination to 500 to fit results into a single page, but I guess
// The server sets the limit to 50.
// I used the syntax &page%5Blimit%5D=5 &page[limit]=5

async function main() {
	let response = await fetch(query)
	  .then(response => response.json());
	let thoughts = response.data.map(datum => datum.attributes);

	// console.log(thoughts);

	// Analyze the first several thoughts first
	for ({ created, title, body } of thoughts) {

		console.log(`\n${title} (${created})`);
		console.log(body.value);
	}

	// How many results did we process
	console.log(`Processed ${thoughts.length} values`)
}

main();
