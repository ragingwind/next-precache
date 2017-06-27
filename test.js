import test from 'ava'
import precahe from '.'

test('precahe', async t => {
	const manifest = await precahe('./fixtures')
	t.is(manifest.buildId, '22321e97-8895-48db-b915-82e255f3faa8')
	t.true(manifest.precaches.every(m => {
		return [
			'/_next/9265fa769281943ee96625770433e573/app.js',
			'/_next/22321e97-8895-48db-b915-82e255f3faa8/page/new',
			'/_next/webpack/chunks/22321e97-8895-48db-b915-82e255f3faa8.js'
		].indexOf(m) > -1
	}))
})
