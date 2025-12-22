type LogLevel =
	| 'log'
	| 'info'
	| 'warn'
	| 'error'
	| 'debug'
	| 'trace'
	| 'table'
	| 'dir'
	| 'dirxml'
	| 'group'
	| 'groupCollapsed'
	| 'groupEnd'
	| 'clear'
	| 'count'
	| 'countReset'
	| 'assert'
	| 'profile'
	| 'profileEnd'
	| 'time'
	| 'timeEnd'
	| 'timeLog';

type Color =
	| 'black'
	| 'red'
	| 'green'
	| 'yellow'
	| 'blue'
	| 'magenta'
	| 'cyan'
	| 'white'
	| 'gray'
	| 'grey'
	| 'brightRed'
	| 'brightGreen'
	| 'brightYellow'
	| 'brightBlue'
	| 'brightMagenta'
	| 'brightCyan'
	| 'brightWhite'
	| 'reset';

type FontWeight =
	| 'normal'
	| 'bold'
	| 'bolder'
	| 'lighter'
	| '100'
	| '200'
	| '300'
	| '400'
	| '500'
	| '600'
	| '700'
	| '800'
	| '900';

interface LoggerOptions {
	color?: Color;
	fontWeight?: FontWeight;
}

interface LoggerConfig {
	defaultColor: Color;
	defaultFontWeight: FontWeight;
}

const ANSI_COLORS: Record<Color, string> = {
	black: '\x1b[30m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',
	gray: '\x1b[90m',
	grey: '\x1b[90m',
	brightRed: '\x1b[91m',
	brightGreen: '\x1b[92m',
	brightYellow: '\x1b[93m',
	brightBlue: '\x1b[94m',
	brightMagenta: '\x1b[95m',
	brightCyan: '\x1b[96m',
	brightWhite: '\x1b[97m',
	reset: '\x1b[0m',
};

const ANSI_FONT_WEIGHTS: Record<FontWeight, string> = {
	normal: '\x1b[22m',
	bold: '\x1b[1m',
	bolder: '\x1b[1m',
	lighter: '\x1b[22m',
	'100': '\x1b[22m',
	'200': '\x1b[22m',
	'300': '\x1b[22m',
	'400': '\x1b[22m',
	'500': '\x1b[22m',
	'600': '\x1b[1m',
	'700': '\x1b[1m',
	'800': '\x1b[1m',
	'900': '\x1b[1m',
};

const CSS_COLORS: Record<Color, string> = {
	black: 'color: #000000',
	red: 'color: #ff0000',
	green: 'color: #00ff00',
	yellow: 'color: #ffff00',
	blue: 'color: #0000ff',
	magenta: 'color: #ff00ff',
	cyan: 'color: #00ffff',
	white: 'color: #ffffff',
	gray: 'color: #808080',
	grey: 'color: #808080',
	brightRed: 'color: #ff5555',
	brightGreen: 'color: #55ff55',
	brightYellow: 'color: #ffff55',
	brightBlue: 'color: #5555ff',
	brightMagenta: 'color: #ff55ff',
	brightCyan: 'color: #55ffff',
	brightWhite: 'color: #ffffff',
	reset: 'color: inherit',
};

const CSS_FONT_WEIGHTS: Record<FontWeight, string> = {
	normal: 'font-weight: normal',
	bold: 'font-weight: bold',
	bolder: 'font-weight: bolder',
	lighter: 'font-weight: lighter',
	'100': 'font-weight: 100',
	'200': 'font-weight: 200',
	'300': 'font-weight: 300',
	'400': 'font-weight: 400',
	'500': 'font-weight: 500',
	'600': 'font-weight: 600',
	'700': 'font-weight: 700',
	'800': 'font-weight: 800',
	'900': 'font-weight: 900',
};

const isBrowser = ((): boolean => {
	try {
		return (
			typeof globalThis !== 'undefined' &&
			typeof (globalThis as { window?: { document?: unknown } })
				.window !== 'undefined' &&
			typeof (globalThis as { window?: { document?: unknown } }).window
				?.document !== 'undefined'
		);
	} catch {
		return false;
	}
})();

const defaultConfig: LoggerConfig = {
	defaultColor: 'reset',
	defaultFontWeight: 'normal',
};

class Logger {
	private config: LoggerConfig;

	constructor(config?: Partial<LoggerConfig>) {
		this.config = { ...defaultConfig, ...config };
	}

	private applyStyle(
		message: string,
		color: Color,
		fontWeight: FontWeight,
	): string | [string, string] {
		if (isBrowser) {
			const colorStyle = CSS_COLORS[color];
			const fontWeightStyle = CSS_FONT_WEIGHTS[fontWeight];
			const combinedStyle = `${colorStyle}; ${fontWeightStyle}`;
			return [message, combinedStyle];
		} else {
			const colorCode = ANSI_COLORS[color];
			const fontWeightCode = ANSI_FONT_WEIGHTS[fontWeight];
			const resetCode = ANSI_COLORS.reset;
			return `${colorCode}${fontWeightCode}${message}${resetCode}`;
		}
	}

	private logInternal(
		level: LogLevel,
		options: LoggerOptions,
		...args: unknown[]
	): void {
		const color = options.color ?? this.config.defaultColor;
		const fontWeight = options.fontWeight ?? this.config.defaultFontWeight;

		const messages = args.map(arg => {
			if (typeof arg === 'string') {
				return arg;
			}
			try {
				return JSON.stringify(arg, null, 2);
			} catch {
				return String(arg);
			}
		});

		const noStyleMethods: LogLevel[] = [
			'table',
			'dir',
			'dirxml',
			'group',
			'groupCollapsed',
			'groupEnd',
			'clear',
			'count',
			'countReset',
			'assert',
			'profile',
			'profileEnd',
			'time',
			'timeEnd',
			'timeLog',
		];

		if (noStyleMethods.includes(level)) {
			(console[level] as (...args: unknown[]) => void)(...args);
			return;
		}

		if (messages.length > 0 && messages[0] !== undefined) {
			const styled = this.applyStyle(messages[0], color, fontWeight);

			if (isBrowser && Array.isArray(styled)) {
				const [message, style] = styled;
				const restMessages = messages.slice(1);
				(console[level] as (...args: unknown[]) => void)(
					`%c${message}`,
					style,
					...restMessages,
				);
			} else {
				const restMessages = messages.slice(1);
				(console[level] as (...args: unknown[]) => void)(
					styled,
					...restMessages,
				);
			}
		} else {
			(console[level] as (...args: unknown[]) => void)();
		}
	}

	log(options: LoggerOptions, ...args: unknown[]): void;
	log(...args: unknown[]): void;
	log(
		optionsOrFirstArg?: LoggerOptions | unknown,
		...restArgs: unknown[]
	): void {
		if (this.isLoggerOptions(optionsOrFirstArg)) {
			this.logInternal('log', optionsOrFirstArg, ...restArgs);
		} else {
			this.logInternal('log', {}, optionsOrFirstArg, ...restArgs);
		}
	}

	info(options: LoggerOptions, ...args: unknown[]): void;
	info(...args: unknown[]): void;
	info(
		optionsOrFirstArg?: LoggerOptions | unknown,
		...restArgs: unknown[]
	): void {
		if (this.isLoggerOptions(optionsOrFirstArg)) {
			this.logInternal('info', optionsOrFirstArg, ...restArgs);
		} else {
			this.logInternal('info', {}, optionsOrFirstArg, ...restArgs);
		}
	}

	warn(options: LoggerOptions, ...args: unknown[]): void;
	warn(...args: unknown[]): void;
	warn(
		optionsOrFirstArg?: LoggerOptions | unknown,
		...restArgs: unknown[]
	): void {
		if (this.isLoggerOptions(optionsOrFirstArg)) {
			this.logInternal('warn', optionsOrFirstArg, ...restArgs);
		} else {
			this.logInternal('warn', {}, optionsOrFirstArg, ...restArgs);
		}
	}

	error(options: LoggerOptions, ...args: unknown[]): void;
	error(...args: unknown[]): void;
	error(
		optionsOrFirstArg?: LoggerOptions | unknown,
		...restArgs: unknown[]
	): void {
		if (this.isLoggerOptions(optionsOrFirstArg)) {
			this.logInternal('error', optionsOrFirstArg, ...restArgs);
		} else {
			this.logInternal('error', {}, optionsOrFirstArg, ...restArgs);
		}
	}

	debug(options: LoggerOptions, ...args: unknown[]): void;
	debug(...args: unknown[]): void;
	debug(
		optionsOrFirstArg?: LoggerOptions | unknown,
		...restArgs: unknown[]
	): void {
		if (this.isLoggerOptions(optionsOrFirstArg)) {
			this.logInternal('debug', optionsOrFirstArg, ...restArgs);
		} else {
			this.logInternal('debug', {}, optionsOrFirstArg, ...restArgs);
		}
	}

	trace(options: LoggerOptions, ...args: unknown[]): void;
	trace(...args: unknown[]): void;
	trace(
		optionsOrFirstArg?: LoggerOptions | unknown,
		...restArgs: unknown[]
	): void {
		if (this.isLoggerOptions(optionsOrFirstArg)) {
			this.logInternal('trace', optionsOrFirstArg, ...restArgs);
		} else {
			this.logInternal('trace', {}, optionsOrFirstArg, ...restArgs);
		}
	}

	table(options: LoggerOptions, ...args: unknown[]): void;
	table(...args: unknown[]): void;
	table(
		optionsOrFirstArg?: LoggerOptions | unknown,
		...restArgs: unknown[]
	): void {
		if (this.isLoggerOptions(optionsOrFirstArg)) {
			this.logInternal('table', optionsOrFirstArg, ...restArgs);
		} else {
			this.logInternal('table', {}, optionsOrFirstArg, ...restArgs);
		}
	}

	dir(options: LoggerOptions, ...args: unknown[]): void;
	dir(...args: unknown[]): void;
	dir(
		optionsOrFirstArg?: LoggerOptions | unknown,
		...restArgs: unknown[]
	): void {
		if (this.isLoggerOptions(optionsOrFirstArg)) {
			this.logInternal('dir', optionsOrFirstArg, ...restArgs);
		} else {
			this.logInternal('dir', {}, optionsOrFirstArg, ...restArgs);
		}
	}

	dirxml(options: LoggerOptions, ...args: unknown[]): void;
	dirxml(...args: unknown[]): void;
	dirxml(
		optionsOrFirstArg?: LoggerOptions | unknown,
		...restArgs: unknown[]
	): void {
		if (this.isLoggerOptions(optionsOrFirstArg)) {
			this.logInternal('dirxml', optionsOrFirstArg, ...restArgs);
		} else {
			this.logInternal('dirxml', {}, optionsOrFirstArg, ...restArgs);
		}
	}

	group(options: LoggerOptions, ...args: unknown[]): void;
	group(...args: unknown[]): void;
	group(
		optionsOrFirstArg?: LoggerOptions | unknown,
		...restArgs: unknown[]
	): void {
		if (this.isLoggerOptions(optionsOrFirstArg)) {
			this.logInternal('group', optionsOrFirstArg, ...restArgs);
		} else {
			this.logInternal('group', {}, optionsOrFirstArg, ...restArgs);
		}
	}

	groupCollapsed(options: LoggerOptions, ...args: unknown[]): void;
	groupCollapsed(...args: unknown[]): void;
	groupCollapsed(
		optionsOrFirstArg?: LoggerOptions | unknown,
		...restArgs: unknown[]
	): void {
		if (this.isLoggerOptions(optionsOrFirstArg)) {
			this.logInternal('groupCollapsed', optionsOrFirstArg, ...restArgs);
		} else {
			this.logInternal(
				'groupCollapsed',
				{},
				optionsOrFirstArg,
				...restArgs,
			);
		}
	}

	groupEnd(): void {
		console.groupEnd();
	}

	clear(): void {
		console.clear();
	}

	count(options: LoggerOptions, label?: string): void;
	count(label?: string): void;
	count(optionsOrLabel?: LoggerOptions | string, label?: string): void {
		if (this.isLoggerOptions(optionsOrLabel)) {
			this.logInternal('count', optionsOrLabel, label);
		} else {
			this.logInternal('count', {}, optionsOrLabel);
		}
	}

	countReset(options: LoggerOptions, label?: string): void;
	countReset(label?: string): void;
	countReset(optionsOrLabel?: LoggerOptions | string, label?: string): void {
		if (this.isLoggerOptions(optionsOrLabel)) {
			this.logInternal('countReset', optionsOrLabel, label);
		} else {
			this.logInternal('countReset', {}, optionsOrLabel);
		}
	}

	assert(
		options: LoggerOptions,
		condition?: boolean,
		...args: unknown[]
	): void;
	assert(condition?: boolean, ...args: unknown[]): void;
	assert(
		optionsOrCondition?: LoggerOptions | boolean,
		conditionOrArg?: boolean | unknown,
		...restArgs: unknown[]
	): void {
		if (this.isLoggerOptions(optionsOrCondition)) {
			this.logInternal(
				'assert',
				optionsOrCondition,
				conditionOrArg,
				...restArgs,
			);
		} else {
			this.logInternal(
				'assert',
				{},
				optionsOrCondition,
				conditionOrArg,
				...restArgs,
			);
		}
	}

	profile(options: LoggerOptions, label?: string): void;
	profile(label?: string): void;
	profile(optionsOrLabel?: LoggerOptions | string, label?: string): void {
		if (this.isLoggerOptions(optionsOrLabel)) {
			this.logInternal('profile', optionsOrLabel, label);
		} else {
			this.logInternal('profile', {}, optionsOrLabel);
		}
	}

	profileEnd(options: LoggerOptions, label?: string): void;
	profileEnd(label?: string): void;
	profileEnd(optionsOrLabel?: LoggerOptions | string, label?: string): void {
		if (this.isLoggerOptions(optionsOrLabel)) {
			this.logInternal('profileEnd', optionsOrLabel, label);
		} else {
			this.logInternal('profileEnd', {}, optionsOrLabel);
		}
	}

	time(options: LoggerOptions, label?: string): void;
	time(label?: string): void;
	time(optionsOrLabel?: LoggerOptions | string, label?: string): void {
		if (this.isLoggerOptions(optionsOrLabel)) {
			this.logInternal('time', optionsOrLabel, label);
		} else {
			this.logInternal('time', {}, optionsOrLabel);
		}
	}

	timeEnd(options: LoggerOptions, label?: string): void;
	timeEnd(label?: string): void;
	timeEnd(optionsOrLabel?: LoggerOptions | string, label?: string): void {
		if (this.isLoggerOptions(optionsOrLabel)) {
			this.logInternal('timeEnd', optionsOrLabel, label);
		} else {
			this.logInternal('timeEnd', {}, optionsOrLabel);
		}
	}

	timeLog(options: LoggerOptions, label?: string, ...args: unknown[]): void;
	timeLog(label?: string, ...args: unknown[]): void;
	timeLog(
		optionsOrLabel?: LoggerOptions | string,
		labelOrArg?: string | unknown,
		...restArgs: unknown[]
	): void {
		if (this.isLoggerOptions(optionsOrLabel)) {
			this.logInternal(
				'timeLog',
				optionsOrLabel,
				labelOrArg,
				...restArgs,
			);
		} else {
			this.logInternal(
				'timeLog',
				{},
				optionsOrLabel,
				labelOrArg,
				...restArgs,
			);
		}
	}

	private isLoggerOptions(arg: unknown): arg is LoggerOptions {
		if (typeof arg !== 'object' || arg === null) {
			return false;
		}
		const obj = arg as Record<string, unknown>;
		return (
			('color' in obj && typeof obj.color === 'string') ||
			('fontWeight' in obj && typeof obj.fontWeight === 'string')
		);
	}

	setDefaults(config: Partial<LoggerConfig>): void {
		this.config = { ...this.config, ...config };
	}

	getDefaults(): LoggerConfig {
		return { ...this.config };
	}
}

const logger = new Logger();

export {
	Logger,
	logger,
	type Color,
	type FontWeight,
	type LoggerConfig,
	type LoggerOptions,
};
export default logger;
