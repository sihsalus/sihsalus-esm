README - Especificación funcional del módulo de odontología para OpenMRS

1. Propósito

Este documento define cómo debe funcionar el módulo de odontología dentro de OpenMRS.

La lógica principal del módulo debe basarse en dos tipos de odontograma claramente diferenciados:

- Odontograma base.
- Odontogramas de atención.

La diferencia entre ambos debe quedar muy clara en la solución:

- El odontograma base registra los hallazgos clínicos encontrados en la evaluación general del paciente.
- Los odontogramas de atención no vuelven a registrar esos problemas, sino únicamente las soluciones o acciones clínicas que se han realizado en cada atención.
- El odontograma base se conserva como referencia clínica y no se modifica por cada tratamiento realizado.
- La evolución del paciente se entiende revisando la lista de odontogramas de atención asociados al odontograma base.

Este documento debe servir como base para diseñar o implementar la solución en OpenMRS.

2. Idea general del modelo

El módulo debe organizar la información odontológica como una relación padre-hijo:

- El odontograma base es el registro padre.
- Los odontogramas de atención son registros hijos.
- El padre contiene los hallazgos clínicos detectados.
- Los hijos contienen las soluciones clínicas que se han ido aplicando con el tiempo.

Esto significa que la lógica no consiste en ir corrigiendo o reescribiendo el odontograma base conforme se atiende al paciente. Al contrario:

- El odontograma base se mantiene igual como fotografía clínica de referencia.
- Cada atención genera su propio odontograma de atención.
- La lista de odontogramas de atención muestra la secuencia de soluciones realizadas sobre los problemas detectados en el odontograma base.

3. Definición de odontograma base

El odontograma base es el odontograma principal de referencia para un paciente en un determinado periodo clínico.

Su función es:

- Registrar el estado clínico general del paciente al momento de la evaluación base.
- Dejar constancia de los hallazgos o problemas encontrados.
- Servir como punto de partida para todas las atenciones posteriores.
- Mantenerse estable como referencia clínica del periodo.

El odontograma base no debe ir cambiando cada vez que se hace un tratamiento. Su valor está precisamente en que conserva el conjunto de problemas o hallazgos identificados al momento de su apertura.

4. Definición de odontograma de atención

El odontograma de atención es un odontograma hijo relacionado a un odontograma base.

Su función no es registrar el problema original, porque ese problema ya está representado en el odontograma base. Su función es registrar la solución aplicada durante una atención concreta.

Por lo tanto, el odontograma de atención debe guardar exclusivamente:

- Qué se resolvió.
- Qué tratamiento se realizó.
- Sobre qué pieza o superficie se actuó.
- Qué procedimiento clínico se ejecutó.
- Qué resultado o avance se obtuvo en esa atención.

Cada odontograma de atención representa una intervención concreta y debe entenderse como un registro de solución, no como un duplicado parcial del odontograma base.

5. Regla más importante del módulo

Debe quedar completamente claro que:

- El odontograma base refleja los problemas.
- Los odontogramas de atención reflejan las soluciones.
- El odontograma base siempre se mantendrá igual.
- La lista de odontogramas de atención es la que muestra las soluciones que se han ido realizando.

Esta es la regla principal que debe guiar el análisis, el diseño de datos y la interfaz del módulo.

6. Relación entre ambos tipos de odontograma

La relación correcta debe ser:

- Un paciente puede tener varios odontogramas base a lo largo del tiempo.
- Cada odontograma base puede tener varios odontogramas de atención relacionados.
- Cada odontograma de atención pertenece a un único odontograma base.

Visualmente y funcionalmente, el módulo debe expresar esta jerarquía así:

Paciente
- Odontograma base
- Lista de odontogramas de atención asociados

Los odontogramas de atención deben funcionar como una especie de historial de resoluciones o intervenciones vinculadas al odontograma base.

7. Cuándo se crea un odontograma base

La creación del odontograma base depende del criterio clínico del odontólogo.

Reglas esperadas:

- Si el paciente es nuevo en odontología, normalmente se abrirá un odontograma base.
- Si es un nuevo año, normalmente el sistema podrá sugerir abrir un nuevo odontograma base.
- Sin embargo, la decisión final siempre la tiene el odontólogo.
- El sistema no debe imponer automáticamente la apertura del odontograma base solo por cambio de año si el profesional considera que no corresponde.

Entonces, el sistema debe comportarse así:

- Identifica escenarios en los que sería razonable abrir un nuevo odontograma base.
- Sugiere la apertura de uno nuevo.
- Permite que el odontólogo decida si realmente se crea.

8. Cuándo se crea un odontograma de atención

Una vez que existe un odontograma base, durante la atención actual y las próximas atenciones se abrirán odontogramas de atención para registrar las soluciones que se van realizando.

Es decir:

- El odontograma de atención se abre para documentar lo resuelto en una consulta.
- Cada nueva consulta puede generar un nuevo odontograma de atención.
- El odontograma de atención no reemplaza al base ni lo altera.
- Su objetivo es dejar trazabilidad de las soluciones aplicadas a lo largo del tiempo.

9. Lógica clínica por escenarios

Escenario 1: paciente nuevo

- El odontólogo evalúa al paciente.
- Decide abrir un odontograma base.
- En el odontograma base registra los hallazgos clínicos encontrados.
- Si durante esa misma consulta realiza tratamientos, abre además un odontograma de atención para registrar las soluciones aplicadas.

Escenario 2: paciente con odontograma base vigente

- No se crea necesariamente un nuevo odontograma base.
- Se abre un odontograma de atención asociado al odontograma base vigente.
- En ese odontograma de atención se registran únicamente las acciones realizadas en esa consulta.

Escenario 3: nuevo año

- El sistema sugiere que podría abrirse un nuevo odontograma base.
- El odontólogo decide si realmente corresponde hacerlo.
- Si decide abrirlo, ese nuevo odontograma base será la nueva referencia del periodo.
- Las siguientes atenciones colgarán de ese nuevo odontograma base mediante odontogramas de atención.

Escenario 4: seguimiento del tratamiento

- El odontograma base sigue mostrando el conjunto de hallazgos detectados originalmente.
- Cada odontograma de atención va registrando las soluciones que se aplicaron.
- El avance del tratamiento se interpreta revisando la lista de odontogramas de atención, no modificando el odontograma base.

10. Qué registra cada uno

10.1 Odontograma base

Debe registrar:

- Hallazgos clínicos generales.
- Problemas dentales detectados.
- Estado odontológico de referencia.
- Piezas, superficies o zonas comprometidas.
- Observaciones generales.
- Fecha de creación.
- Profesional responsable.
- Periodo o vigencia clínica.

10.2 Odontograma de atención

Debe registrar:

- Soluciones realizadas en la consulta.
- Tratamientos ejecutados.
- Procedimientos aplicados.
- Piezas o superficies intervenidas.
- Resultado de la intervención.
- Observaciones específicas de esa atención.
- Fecha de atención.
- Profesional responsable.
- Relación con su odontograma base.

Muy importante: el odontograma de atención no debe copiar el problema original del padre como si fuera un nuevo hallazgo. El problema ya está definido en el odontograma base. El hijo registra la solución aplicada.

11. Cómo debe entenderse la evolución del paciente

La evolución clínica odontológica del paciente debe leerse así:

- El odontograma base muestra cuáles fueron los hallazgos o problemas identificados.
- Los odontogramas de atención muestran qué se hizo para resolver esos problemas.
- El conjunto de odontogramas de atención permite reconstruir el tratamiento progresivo del paciente.

Por lo tanto, el módulo debe evitar una lógica donde el odontograma base se vaya sobreescribiendo cada vez que se atiende al paciente.

12. Enfoque funcional para OpenMRS

Dentro de OpenMRS, el módulo debe manejar estas entidades como parte del expediente clínico odontológico del paciente.

Debe poder ofrecer:

- Historial de odontogramas base.
- Selección del odontograma base vigente.
- Lista de odontogramas de atención relacionados con cada odontograma base.
- Registro cronológico de soluciones aplicadas.
- Consulta clínica del estado base y del historial de intervenciones.

13. Estructura funcional propuesta

La estructura mínima del módulo debería ser:

Paciente
- Entidad ya existente en OpenMRS.

OdontogramaBase
- id
- patient_id
- fecha_creacion
- anio_referencia
- profesional_id
- estado
- observaciones
- es_vigente

OdontogramaBaseHallazgo
- id
- odontograma_base_id
- pieza_dental
- superficie
- tipo_hallazgo
- descripcion
- estado_clinico

OdontogramaAtencion
- id
- odontograma_base_id
- fecha_atencion
- profesional_id
- estado
- motivo_consulta
- interconsulta_id opcional
- observaciones

OdontogramaAtencionSolucion
- id
- odontograma_atencion_id
- hallazgo_base_id opcional
- pieza_dental
- superficie
- procedimiento_realizado
- descripcion_solucion
- resultado
- observaciones

Aquí debe notarse algo importante:

- Los hallazgos viven en el odontograma base.
- Las soluciones viven en el odontograma de atención.
- El odontograma base no se reescribe con cada intervención.

14. Comportamiento esperado en la interfaz

En la ficha odontológica del paciente debe mostrarse:

- Historial de odontogramas base.
- Cuál es el odontograma base vigente.
- Lista de odontogramas de atención relacionados a cada odontograma base.
- Resumen de soluciones registradas en cada odontograma de atención.

Al abrir un odontograma base, el usuario debe poder:

- Ver el conjunto de hallazgos del paciente.
- Ver la lista de odontogramas de atención que dependen de ese base.
- Abrir un nuevo odontograma de atención.

Al abrir un odontograma de atención, el usuario debe poder:

- Registrar solo las soluciones aplicadas en esa consulta.
- Indicar tratamientos, procedimientos y resultados.
- Relacionar la intervención con diagnósticos, medicación y otros datos de la atención.

15. Regla para interconsultas

La interconsulta no cambia esta lógica.

Si el paciente llega por interconsulta:

- Si no existe odontograma base y el odontólogo considera que corresponde, se abre un odontograma base.
- Si ya existe odontograma base, se abre un odontograma de atención para registrar la solución realizada en esa consulta.

Odontología no necesita devolver formalmente el contenido de la atención al servicio solicitante. Lo importante es que la atención quede registrada correctamente en su módulo.

16. Relación con FUA y farmacia

16.1 FUA

La información registrada en el odontograma de atención debe facilitar el llenado de:

- Diagnósticos CIE-10.
- Problemas clínicos numerados.
- Códigos prestacionales.
- Medicación asociada.

16.2 Farmacia

La medicación debe vincularse principalmente a la atención concreta, porque responde a una solución o intervención realizada en esa consulta.

Debe poder registrarse:

- Medicamento.
- Cantidad.
- Indicaciones.
- Relación con el problema clínico si aplica.
- Estado de entrega si la integración lo soporta.

17. Códigos prestacionales relevantes

Según la información recogida, deben contemplarse al menos:

- 020: evaluación oral completa.
- 911: instrucción de higiene oral y asesoría nutricional.
- 021: tratamientos preventivos.
- 059: extracciones dentales.
- 058: restauraciones de dos o más superficies.
- 057: restauraciones de una superficie.
- 056: medicación cuando no puede intervenirse en ese momento.

Algunos códigos, como la evaluación oral completa, pueden estar más relacionados con la apertura del odontograma base. Otros estarán más ligados a los odontogramas de atención, porque reflejan la solución o intervención realizada.

18. Reglas de negocio principales

- Deben existir dos tipos funcionales de odontograma: base y de atención.
- El odontograma base registra los hallazgos o problemas clínicos.
- El odontograma de atención registra exclusivamente las soluciones realizadas.
- El odontograma base debe mantenerse igual como referencia clínica.
- La evolución del paciente se interpreta a través de la lista de odontogramas de atención.
- Un odontograma base puede tener múltiples odontogramas de atención relacionados.
- Un odontograma de atención no puede existir sin odontograma base.
- Si el paciente es nuevo, normalmente se abrirá un odontograma base, pero la decisión final la toma el odontólogo.
- Si es un nuevo año, el sistema puede sugerir abrir un nuevo odontograma base, pero la decisión final también la toma el odontólogo.
- Durante la atención actual y las próximas atenciones se abrirán odontogramas de atención para registrar las soluciones realizadas sobre los hallazgos del base.

19. Qué debe quedar claro para la implementación

La solución no debe diseñarse como un odontograma que va mutando continuamente.

La solución correcta es:

- Un odontograma base fijo como registro de problemas.
- Una serie de odontogramas de atención como registro de soluciones.
- Una relación padre-hijo entre ambos.
- Un historial clínico construido por la suma de soluciones aplicadas a lo largo del tiempo.

20. Resumen final

El módulo de odontología para OpenMRS debe permitir trabajar con dos niveles de información:

- El odontograma base, que contiene los problemas o hallazgos clínicos encontrados y que se conserva sin modificarse como referencia.
- Los odontogramas de atención, que registran solamente las soluciones o intervenciones realizadas en cada consulta.

Si el paciente es nuevo o si ha comenzado un nuevo año, el sistema puede sugerir la apertura de un nuevo odontograma base, pero la decisión final siempre debe estar en manos del odontólogo.

A partir de ese odontograma base, las distintas consultas irán generando odontogramas de atención relacionados, y será esa lista de odontogramas de atención la que mostrará cómo se han ido resolviendo los hallazgos clínicos con el tiempo.

Esa es la lógica funcional que debe guiar el diseño del módulo en OpenMRS.