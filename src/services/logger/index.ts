const createLogger = (prefix: string) => ({
	log: (message: string, ...args: any[]) =>
		console.log(
			`[${new Date().toISOString()}] ${prefix} ${message}`,
			...args,
		),
	info: (message: string, ...args: any[]) =>
		console.info(
			`[${new Date().toISOString()}] ${prefix} ${message}`,
			...args,
		),
	warn: (message: string, ...args: any[]) =>
		console.warn(
			`[${new Date().toISOString()}] ${prefix} ${message}`,
			...args,
		),
	error: (message: string, ...args: any[]) =>
		console.error(
			`[${new Date().toISOString()}] ${prefix} ${message}`,
			...args,
		),
	debug: (message: string, ...args: any[]) =>
		console.debug(
			`[${new Date().toISOString()}] ${prefix} ${message}`,
			...args,
		),
});

export default createLogger;
