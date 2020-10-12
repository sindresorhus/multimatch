import multimatch = require('.');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const options: multimatch.Options = {};

multimatch(['unicorn', 'cake', 'rainbows'], '!cake');
multimatch(['unicorn', 'cake', 'rainbows'], ['*', '!cake']);
multimatch(['unicorn', 'cake', 'rainbows'], ['*', '!cake'], {
	debug: true
});
