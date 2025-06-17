
import { z } from 'zod';

// Schedule interval enum
export const scheduleIntervalSchema = z.enum([
  'every_5_minutes',
  'hourly', 
  'daily',
  'weekly',
  'monthly'
]);

export type ScheduleInterval = z.infer<typeof scheduleIntervalSchema>;

// PromptConfiguration schema
export const promptConfigurationSchema = z.object({
  id: z.number(),
  name: z.string(),
  openai_model_name: z.string(),
  temperature: z.number(),
  max_tokens: z.number(),
  system_message: z.string(),
  user_message_template: z.string(),
  schedule_interval: scheduleIntervalSchema,
  webhook_url: z.string().url(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type PromptConfiguration = z.infer<typeof promptConfigurationSchema>;

// Input schema for creating prompt configurations
export const createPromptConfigurationInputSchema = z.object({
  name: z.string().min(1),
  openai_model_name: z.string().default('gpt-3.5-turbo'),
  temperature: z.number().min(0).max(2).default(0.7),
  max_tokens: z.number().int().min(1).max(4000).default(150),
  system_message: z.string(),
  user_message_template: z.string(),
  schedule_interval: scheduleIntervalSchema.default('daily'),
  webhook_url: z.string().url(),
  is_active: z.boolean().default(true)
});

export type CreatePromptConfigurationInput = z.infer<typeof createPromptConfigurationInputSchema>;

// Input schema for updating prompt configurations
export const updatePromptConfigurationInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  openai_model_name: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().min(1).max(4000).optional(),
  system_message: z.string().optional(),
  user_message_template: z.string().optional(),
  schedule_interval: scheduleIntervalSchema.optional(),
  webhook_url: z.string().url().optional(),
  is_active: z.boolean().optional()
});

export type UpdatePromptConfigurationInput = z.infer<typeof updatePromptConfigurationInputSchema>;

// Schema for prompt execution records
export const promptExecutionSchema = z.object({
  id: z.number(),
  prompt_configuration_id: z.number(),
  executed_at: z.coerce.date(),
  openai_response: z.string(), // JSON string of full OpenAI response
  webhook_status: z.string(),
  webhook_response: z.string().nullable(),
  error_message: z.string().nullable()
});

export type PromptExecution = z.infer<typeof promptExecutionSchema>;

// Input schema for manual prompt execution
export const executePromptInputSchema = z.object({
  prompt_configuration_id: z.number()
});

export type ExecutePromptInput = z.infer<typeof executePromptInputSchema>;

// OpenAI API response schema (simplified)
export const openaiResponseSchema = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  model: z.string(),
  choices: z.array(z.object({
    index: z.number(),
    message: z.object({
      role: z.string(),
      content: z.string()
    }),
    finish_reason: z.string()
  })),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number()
  })
});

export type OpenAIResponse = z.infer<typeof openaiResponseSchema>;
