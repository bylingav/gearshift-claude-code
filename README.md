<p align="center"><img src="banner.png" alt="gearshift: cambia de modelo según la tarea" width="100%"></p>

**gearshift** son dos mods para Claude Code que te ahorran tokens sin perder calidad donde importa.

<img src="sections/que-hace.png" alt="Qué hace cada uno" width="100%">

- **model-router**: mira lo que pides y elige entre Haiku, Sonnet u Opus. Para los subagentes lo decide de verdad. En el hilo principal lo sugiere y, si Claude Code lo permite, lo cambia.
- **usage-bar**: muestra arriba, sobre la caja de texto, el modelo activo, el nivel del router y cuánto llevas gastado en la ventana de 5 horas y en la semanal.

<img src="sections/niveles.png" alt="Niveles del router" width="100%">

Escribe `/router` seguido de un nivel, o pulsa el botón en la banda:

| Nivel | Qué hace |
|---|---|
| `off` | No elige nada. |
| `lite` | Solo elige modelo para los subagentes. |
| `full` | Subagentes y hilo principal, con reglas locales. Es el de por defecto. |
| `ultra` | Como `full`, pero un modelo pequeño clasifica cada prompt. Más preciso y más lento. |

<img src="sections/instalar.png" alt="Instalar" width="100%">

En una terminal de Claude Code:

```bash
/plugin install model-router --marketplace bylingav/gearshift-claude-code
/plugin install usage-bar --marketplace bylingav/gearshift-claude-code
```

<img src="sections/estado.png" alt="Estado" width="100%">

Beta. Hecho para uso personal. El cambio automático del modelo principal depende de que Claude Code acepte la orden.

<img src="sections/licencia.png" alt="Licencia" width="100%">

MIT. Ver [LICENSE](LICENSE).
