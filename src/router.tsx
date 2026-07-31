import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

let router: ReturnType<typeof createAppRouter> | undefined;

function createAppRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60_000,
				refetchOnWindowFocus: false,
			},
		},
	});

	return createRouter({
		routeTree,
		context: { queryClient },
	});
}

export function getRouter() {
	router ??= createAppRouter();
	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}