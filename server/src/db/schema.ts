
import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define the schedule interval enum
export const scheduleIntervalEnum = pgEnum('schedule_interval', [
  'every_5_minutes',
  'hourly',
  'daily', 
  'weekly',
  'monthly'
]);

// Prompt configurations table
export const promptConfigurationsTable = pgTable('prompt_configurations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  openai_model_name: text('openai_model_name').notNull().default('gpt-3.5-turbo'),
  temperature: numeric('temperature', { precision: 3, scale: 2 }).notNull().default('0.7'),
  max_tokens: integer('max_tokens').notNull().default(150),
  system_message: text('system_message').notNull(),
  user_message_template: text('user_message_template').notNull(),
  schedule_interval: scheduleIntervalEnum('schedule_interval').notNull().default('daily'),
  webhook_url: text('webhook_url').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Prompt executions table
export const promptExecutionsTable = pgTable('prompt_executions', {
  id: serial('id').primaryKey(),
  prompt_configuration_id: integer('prompt_configuration_id').notNull().references(() => promptConfigurationsTable.id, { onDelete: 'cascade' }),
  executed_at: timestamp('executed_at').defaultNow().notNull(),
  openai_response: text('openai_response').notNull(), // JSON string of full OpenAI response
  webhook_status: text('webhook_status').notNull(), // 'success', 'failed', 'pending'
  webhook_response: text('webhook_response'), // Response from webhook if any
  error_message: text('error_message') // Error details if execution failed
});

// Relations
export const promptConfigurationRelations = relations(promptConfigurationsTable, ({ many }) => ({
  executions: many(promptExecutionsTable)
}));

export const promptExecutionRelations = relations(promptExecutionsTable, ({ one }) => ({
  promptConfiguration: one(promptConfigurationsTable, {
    fields: [promptExecutionsTable.prompt_configuration_id],
    references: [promptConfigurationsTable.id]
  })
}));

// TypeScript types for the table schemas
export type PromptConfiguration = typeof promptConfigurationsTable.$inferSelect;
export type NewPromptConfiguration = typeof promptConfigurationsTable.$inferInsert;
export type PromptExecution = typeof promptExecutionsTable.$inferSelect;
export type NewPromptExecution = typeof promptExecutionsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = { 
  promptConfigurations: promptConfigurationsTable,
  promptExecutions: promptExecutionsTable
};
