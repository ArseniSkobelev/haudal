// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
export type User = {
	email: string
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };