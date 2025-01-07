import { signal } from "@preact/signals-react";

const loggedIn = signal<boolean>(false);

export { loggedIn };
