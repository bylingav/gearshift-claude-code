<p align="center"><img src="banner.png" alt="gearshift: cambia de modelo según la tarea" width="100%"></p>

**gearshift** son dos mods para Claude Code que te ahorran tokens sin perder calidad donde importa.

## Qué hace cada uno

- **model-router**: mira lo que pides y elige entre Haiku, Sonnet u Opus. Para los subagentes lo decide de verdad. En el hilo principal lo sugiere y, si Claude Code lo permite, lo cambia.
- **usage-bar**: muestra arriba, sobre la caja de texto, el modelo activo, el nivel del router y cuánto llevas gastado en la ventana de 5 horas y en la semanal.

## Niveles del router

Escribe `/router` seguido de un nivel, o pulsa el botón en la banda:

| Nivel | Qué hace |
|---|---|
| `off` | No elige nada. |
| `lite` | Solo elige modelo para los subagentes. |
| `full` | Subagentes y hilo principal, con reglas locales. Es el de por defecto. |
| `ultra` | Como `full`, pero un modelo pequeño clasifica cada prompt. Más preciso y más lento. |

## Instalar

En una terminal de Claude Code:

```bash
/plugin install model-router --marketplace bylingav/gearshift
/plugin install usage-bar --marketplace bylingav/gearshift
```

## Paleta

| Elemento | Color |
|---|---|
| Fondo del icono | `#16161d` |
| Haiku | `#14b8a6` turquesa |
| Sonnet | `#8b5cf6` violeta |
| Opus | `#eab308` dorado |
| Barra de uso, 0 a 90 % | `#3b82f6` azul |
| Barra de uso, 90 a 95 % | `#f59e0b` naranja |
| Barra de uso, 95 a 100 % | `#ef4444` rojo |

## Estado

Beta. Hecho para uso personal. El cambio automático del modelo principal depende de que Claude Code acepte la orden.

## Licencia

MIT. Ver [LICENSE](LICENSE).
