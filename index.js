'use strict'

const fs = require('fs')
const path = require('path')
const loadJsonFile = require('load-json-file')

let dotNext

function bundles(app) {
	return new Promise(resolve => {
		fs.readdir(`${dotNext}/bundles/pages`, (err, files) => {
			if (err) {
				resolve(app)
			}

			if (files) {
				const root = `/_next/${app.buildId}/page`
				app.precaches = app.precaches.concat(files
					.filter(file => file !== 'index.js')
					.map(file => {
						// Sample: /_next/22321e97-8895-48db-b915-82e255f3faa8/page/new
						return path.join(root, file.replace(/.js$/, ''))
					})
				)
			}

			resolve(app)
		})
	})
}

function chunks(app) {
	return new Promise(resolve => {
		fs.readdir(`${dotNext}/chunks`, (err, files) => {
			if (err) {
				resolve(app)
			}

			if (files) {
				const root = `/_next/webpack/chunks`
				app.precaches = app.precaches.concat(files
					.filter(file => /\.js$/.test(file))
					.map(file => {
						// Sample: /_next/webpack/chunks/22321e97-8895-48db-b915-82e255f3faa8.js
						return path.join(root, file)
					})
				)
			}

			resolve(app)
		})
	})
}

function app() {
	const app = {
		buildId: fs.readFileSync(`${dotNext}/BUILD_ID`, 'utf8').trim(),
		precaches: []
	}

	return loadJsonFile(`${dotNext}/build-stats.json`).then(stats => {
		Object.keys(stats).forEach(src => {
			// Sample: /_next/9265fa769281943ee96625770433e573/app.js
			app.precaches.push(`/_next/${stats[src].hash}/${src}`)
		})

		return app
	})
}

module.exports = root => {
	root = root || './'

	dotNext = path.resolve(path.join(root, '.next'))

	return app()
		.then(chunks)
		.then(bundles)
}
