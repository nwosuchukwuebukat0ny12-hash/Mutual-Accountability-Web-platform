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
  timezone: z.string().optional(),
  milestones: z.array(z.object({
    title: z.string().min(1, 'Milestone title is required'),
    targetDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid milestone target date',
    }),
  })).optional(),
});

// Schema for submitting a check-in
const submitCheckInSchema = z.object({
  goalId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid goal ID format'),
  note: z.string().min(1, 'Check-in note (proof) is required').max(500, 'Note cannot exceed 500 characters'),
  stake: z.string().max(100, 'Stake cannot exceed 100 characters').optional(),
});

// Schema for sending a partnership invitation
const sendInvitationSchema = z.object({
  partnerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid partner ID format'),
  goalId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid goal ID format').optional(),
});

// Deprecated V1 schema (kept for backwards compatibility if needed)
const checkInSchema = z.object({
  goalId: z.string().min(1, 'Goal ID is required'),
  status: z.enum(['done', 'missed', 'partial'], {
    errorMap: () => ({ message: 'Status must be done, missed, or partial' }),
  }),
  progress: z.number().min(0).max(100, 'Progress must be between 0 and 100').optional(),
  note: z.string().max(500, 'Note cannot exceed 500 characters').optional(),
});

module.exports = {
  createGoalSchema,
  submitCheckInSchema,
  sendInvitationSchema,
  checkInSchema,
};
