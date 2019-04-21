import multimatch = require('.');

const options: multimatch.Options = {};

multimatch(['unicorn', 'cake', 'rainbows'], '!cake');
multimatch(['unicorn', 'cake', 'rainbows'], ['*', '!cake']);
multimatch(['unicorn', 'cake', 'rainbows'], ['*', '!cake'], {
	debug: true
});
