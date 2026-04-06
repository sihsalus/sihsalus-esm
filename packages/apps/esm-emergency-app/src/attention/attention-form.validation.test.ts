import { attentionFormSchema } from './attention-form.validation';

describe('attentionFormSchema', () => {
  it('accepts valid data with all fields', () => {
    const result = attentionFormSchema.safeParse({
      diagnosis: 'J18.9 - Neumonía no especificada',
      treatment: 'Ceftriaxona 1g IV c/12h',
      auxiliaryExams: 'Hemograma, PCR, Rx tórax',
    });
    expect(result.success).toBe(true);
  });

  it('accepts data without auxiliaryExams (optional)', () => {
    const result = attentionFormSchema.safeParse({
      diagnosis: 'R50.9 - Fiebre',
      treatment: 'Paracetamol 1g VO c/8h',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing diagnosis', () => {
    const result = attentionFormSchema.safeParse({
      treatment: 'Tratamiento de prueba',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('diagnosis');
    }
  });

  it('rejects missing treatment', () => {
    const result = attentionFormSchema.safeParse({
      diagnosis: 'Diagnóstico de prueba',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('treatment');
    }
  });

  it('rejects empty diagnosis string', () => {
    const result = attentionFormSchema.safeParse({
      diagnosis: '',
      treatment: 'Tratamiento',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty treatment string', () => {
    const result = attentionFormSchema.safeParse({
      diagnosis: 'Diagnóstico',
      treatment: '',
    });
    expect(result.success).toBe(false);
  });
});
