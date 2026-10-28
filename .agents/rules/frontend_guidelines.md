---
trigger: always_on
description: Doodle (Hand Drawn) Front-End Design System and UI Guidelines for AI4Brain
---

# Front-End Design System: Doodle (Hand Drawn) System

Whenever implementing or updating UI components, styles, or telemetry displays:

1. **Theme & Tokens**: Use variables defined in `frontend/src/styles/tokens.css` or `dashboard_ui/src/styles/tokens.css`.
   - Global Canvas: `#FFF5EE` (Warm paper with subtle dot grid)
   - Surface / Cards: `#FFFFFF` (Whiteboard) with `2px solid #263D5B`
   - Primary / Brand: `#E86A33` (Terracotta Orange)
   - Secondary: `#263D5B` (Navy Pen Ink)
   - Reward: `#FFC83D` (Sunshine Gold)
   - Shadows: `3px 3px 0 #263D5B` (Hard offset tactile shadow)

2. **Typography**:
   - Headers: `Delius Swash Caps` or `Delius`, cursive
   - Body: `Delius`, cursive
   - Telemetry: `JetBrains Mono` with `tabular-nums`

3. **Numerical Telemetry**: Always enforce `font-variant-numeric: tabular-nums` (`.tabular-nums`) on all ms reaction times, scores, and confidence intervals to prevent layout jitter.

4. **Task Viewport / Minimal Distraction**: Dissolve chrome during active trials. Display only the stimulus, response controls, and the top progress bar.

5. **Micro-Interactions**: Tactile buttons with `2px solid #263D5B`, `box-shadow: 3px 3px 0 #263D5B`. On hover: `transform: translate(-1px, -1px); box-shadow: 4px 4px 0 #263D5B`. On active: `transform: translate(2px, 2px); box-shadow: 1px 1px 0 #263D5B`.

Full specs: [AGENTS.md](file:///C:/Users/hamza/OneDrive/Desktop/IEEE/IEEE%20HIDE%20SB/CISTAC%201%20Tech%20Challenge/ai4brain-main/AGENTS.md)
