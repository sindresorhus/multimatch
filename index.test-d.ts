import multimatch, {type Options} from './index.js';

const options: Options = {};

multimatch(['unicorn', 'cake', 'rainbows'], '!cake');
multimatch(['unicorn', 'cake', 'rainbows'], ['*', '!cake']);
multimatch(['unicorn', 'cake', 'rainbows'], ['*', '!cake'], {
	debug: true,
});
