export * from './types';
export * from './store';
export * from './mock/data';
export { MockAgentClient, canvases } from './mock/mockAgentClient';

import { MockAgentClient } from './mock/mockAgentClient';
import { createSchoolStore } from './store';

/** App-wide store. Swap `MockAgentClient` for the HTTP client once the backend exists. */
export const useSchool = createSchoolStore(new MockAgentClient());
