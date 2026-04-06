import { z } from 'zod';

/** Zod validation schema for the emergency attention form. Diagnosis and treatment are required; auxiliary exams are optional. */
export const attentionFormSchema = z.object({
  diagnosis: z.string().min(1, 'Diagnóstico es requerido'),
  treatment: z.string().min(1, 'Tratamiento es requerido'),
  auxiliaryExams: z.string().optional(),
});

/** Inferred TypeScript type from the attention form Zod schema. */
export type AttentionFormData = z.infer<typeof attentionFormSchema>;
