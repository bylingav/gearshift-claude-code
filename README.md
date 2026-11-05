<p align="center"><img src="banner.png" alt="gearshift: cambia de modelo según la tarea" width="100%"></p>

<p align="center"><i>Cambia de marcha según la tarea. Menos tokens, misma calidad donde importa.</i></p>

<br>

<img src="sections/que-hace.png" alt="Qué hace cada uno" width="100%">

**model-router** elige solo el modelo que hace falta. **Haiku** para lo sencillo, **Sonnet** para el día a día y **Opus** para lo difícil.

**usage-bar** te enseña, justo encima de la caja de texto, qué modelo está activo y cuánto llevas gastado de tu límite.

<br>

<img src="sections/niveles.png" alt="Niveles del router" width="100%">

Escribe `/router` seguido de un nivel, o pulsa el botón de la banda:

| Nivel | Qué hace |
|:---:|---|
| **`off`** | No elige nada. |
| **`lite`** | Solo elige modelo para los *subagentes*. |
| **`full`** | Subagentes e hilo principal, con reglas locales. **Por defecto.** |
| **`ultra`** | Como `full`, pero un modelo pequeño clasifica cada prompt. *Más preciso y más lento.* |

<br>

<img src="sections/instalar.png" alt="Instalar" width="100%">

En una terminal de Claude Code:

```bash
/plugin install model-router --marketplace bylingav/gearshift-claude-code
/plugin install usage-bar --marketplace bylingav/gearshift-claude-code
```

<br>

## Estado

> [!WARNING]
> **Beta, para uso personal.** El cambio automático del modelo principal depende de que Claude Code acepte la orden.

<br>

## Licencia

**MIT**. Ver [LICENSE](LICENSE).
