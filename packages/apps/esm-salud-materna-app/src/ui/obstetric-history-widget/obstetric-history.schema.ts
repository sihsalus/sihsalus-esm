import { z } from 'zod';

// Zod validation schema for obstetric history data
export const ObstetricHistorySchema = z
  .object({
    gravidez: z.number().min(0, 'Debe ser al menos 0').max(20, 'No puede exceder 20').optional(),
    partoAlTermino: z.number().min(0, 'Debe ser al menos 0').max(20, 'No puede exceder 20').optional(),
    partoPrematuro: z.number().min(0, 'Debe ser al menos 0').max(20, 'No puede exceder 20').optional(),
    partoAborto: z.number().min(0, 'Debe ser al menos 0').max(20, 'No puede exceder 20').optional(),
    partoNacidoVivo: z.number().min(0, 'Debe ser al menos 0').max(20, 'No puede exceder 20').optional(),
    partoNacidoMuerto: z.number().min(0, 'Debe ser al menos 0').max(20, 'No puede exceder 20').optional(),
  })
  .refine((fields) => Object.values(fields).some((value) => value !== undefined && value !== null), {
    message: 'Por favor, completa al menos un campo',
    path: ['oneFieldRequired'],
  })
  .refine(
    (fields) => {
      const { gravidez, partoAlTermino, partoPrematuro, partoAborto } = fields;
      if (gravidez !== undefined) {
        const totalEventos = (partoAlTermino || 0) + (partoPrematuro || 0) + (partoAborto || 0);
        return totalEventos <= gravidez;
      }
      return true;
    },
    {
      message: 'La suma de Partos a término, Partos prematuros y Abortos no puede exceder Gravidez',
      path: ['gravidez'],
    },
  )
  .refine(
    (fields) => {
      const { gravidez, partoAlTermino, partoPrematuro } = fields;
      if (gravidez !== undefined) {
        const totalPartos = (partoAlTermino || 0) + (partoPrematuro || 0);
        return totalPartos <= gravidez;
      }
      return true;
    },
    {
      message: 'La suma de Partos a término y Partos prematuros no puede exceder Gravidez',
      path: ['gravidez'],
    },
  )
  .refine(
    (fields) => {
      const { gravidez, partoAborto } = fields;
      if (gravidez !== undefined) {
        return (partoAborto || 0) <= gravidez;
      }
      return true;
    },
    {
      message: 'Los Abortos no pueden exceder Gravidez',
      path: ['partoAborto'],
    },
  )
  .refine(
    (fields) => {
      const { partoAlTermino, partoPrematuro, partoNacidoVivo } = fields;
      if (partoNacidoVivo !== undefined) {
        const totalPartos = (partoAlTermino || 0) + (partoPrematuro || 0);
        return partoNacidoVivo <= totalPartos;
      }
      return true;
    },
    {
      message: 'Nacidos vivos no puede exceder la suma de Partos a término y Partos prematuros',
      path: ['partoNacidoVivo'],
    },
  )
  .refine(
    (fields) => {
      const { partoNacidoVivo, partoNacidoMuerto, partoAlTermino, partoPrematuro } = fields;
      const totalNacidos = (partoNacidoVivo || 0) + (partoNacidoMuerto || 0);
      const totalPartos = (partoAlTermino || 0) + (partoPrematuro || 0);

      if (totalNacidos > 0 && totalPartos > 0) {
        return totalNacidos <= totalPartos;
      }
      return true;
    },
    {
      message: 'La suma de Nacidos vivos y Nacidos muertos no puede exceder el total de partos',
      path: ['partoNacidoMuerto'],
    },
  );

export type ObstetricHistoryFormType = z.infer<typeof ObstetricHistorySchema>;

// Validation schema for display data (used in widgets/components)
export const ObstetricDisplayDataSchema = z.object({
  pregnancies: z.number().min(0).optional(),
  termBirths: z.number().min(0).optional(),
  prematureBirths: z.number().min(0).optional(),
  abortions: z.number().min(0).optional(),
  liveBirths: z.number().min(0).optional(),
  stillBirths: z.number().min(0).optional(),
});

export type ObstetricDisplayDataType = z.infer<typeof ObstetricDisplayDataSchema>;

// Table row schema for type safety
export const ObstetricTableRowSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.union([z.string(), z.number()]),
});

export type ObstetricTableRowType = z.infer<typeof ObstetricTableRowSchema>;
