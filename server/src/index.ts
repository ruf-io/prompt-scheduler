
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createPromptConfigurationInputSchema,
  updatePromptConfigurationInputSchema,
  executePromptInputSchema
} from './schema';

// Import handlers
import { createPromptConfiguration } from './handlers/create_prompt_configuration';
import { getPromptConfigurations } from './handlers/get_prompt_configurations';
import { getPromptConfiguration } from './handlers/get_prompt_configuration';
import { updatePromptConfiguration } from './handlers/update_prompt_configuration';
import { deletePromptConfiguration } from './handlers/delete_prompt_configuration';
import { executePrompt } from './handlers/execute_prompt';
import { getPromptExecutions } from './handlers/get_prompt_executions';
import { startScheduler } from './handlers/start_scheduler';
import { stopScheduler } from './handlers/stop_scheduler';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Prompt Configuration CRUD operations
  createPromptConfiguration: publicProcedure
    .input(createPromptConfigurationInputSchema)
    .mutation(({ input }) => createPromptConfiguration(input)),

  getPromptConfigurations: publicProcedure
    .query(() => getPromptConfigurations()),

  getPromptConfiguration: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getPromptConfiguration(input.id)),

  updatePromptConfiguration: publicProcedure
    .input(updatePromptConfigurationInputSchema)
    .mutation(({ input }) => updatePromptConfiguration(input)),

  deletePromptConfiguration: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deletePromptConfiguration(input.id)),

  // Prompt execution operations
  executePrompt: publicProcedure
    .input(executePromptInputSchema)
    .mutation(({ input }) => executePrompt(input)),

  getPromptExecutions: publicProcedure
    .input(z.object({ promptConfigurationId: z.number().optional() }))
    .query(({ input }) => getPromptExecutions(input.promptConfigurationId)),

  // Scheduler operations
  startScheduler: publicProcedure
    .mutation(() => startScheduler()),

  stopScheduler: publicProcedure
    .mutation(() => stopScheduler()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
