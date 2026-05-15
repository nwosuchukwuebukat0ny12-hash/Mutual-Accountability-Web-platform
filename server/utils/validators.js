const { z } = require('zod');

// Schema for creating a new goal
const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  category: z.enum(['fitness', 'study', 'career', 'habit', 'other'], {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  description: z.string().max(500, 'Description is too long').optional(),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid deadline date',
  }),
  frequency: z.enum(['daily', 'every2days', 'weekly'], {
    errorMap: () => ({ message: 'Invalid frequency' }),
  }),
});

module.exports = {
  createGoalSchema,
};
