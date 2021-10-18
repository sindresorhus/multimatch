import multimatch, {Options} from './index.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const options: Options = {};

multimatch(['unicorn', 'cake', 'rainbows'], '!cake');
multimatch(['unicorn', 'cake', 'rainbows'], ['*', '!cake']);
multimatch(['unicorn', 'cake', 'rainbows'], ['*', '!cake'], {
	debug: true,
});
