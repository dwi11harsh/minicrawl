import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
	entry: ['src/**/*'],
	clean: true,
	format: ['cjs'],
	noExternal: [/@repo\/.*/], // bundle all @repo/* packages
	external: ['playwright', 'playwright-core'], // dont bundle playwright due to its complex runtime requirements
	...options,
}));
