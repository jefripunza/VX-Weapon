const chalk = require('chalk')

/**
https://www.w3.org/wiki/CSS/Properties/color/keywords
 */

const color = (text, color) => {
	return !color ? chalk.reset(text) : chalk.keyword(color)(text)
}

const bgcolor = (text, bgcolor) => {
	return !bgcolor ? chalk.reset(text) : chalk.bgKeyword(bgcolor)(text)
}

const bold = (text) => {
	return chalk.bold(text)
}

module.exports = {
	color,
	bgcolor,
	bold,
}
