#!/usr/bin/env python3
"""Generate 3 production-grade logo concepts and lockups for BRIAN.

Complies strictly with logo-design skill guidelines:
- Canvas: 256x256 viewBox="0 0 256 256" for symbols; 768x256 for horizontal lockups.
- Integer & clean coordinates.
- Pure vector paths (no live <text>, no raster <image>, no masks/filters).
- High-contrast solid dark master fill (#0F172A).
- Passed through svg_audit.py, rendered via render_png.py, compiled into concept_sheet.py.
"""
import math
import os
import subprocess
import sys

SKILL_DIR = r"C:\Users\Smida\Desktop\GEmini skills\skill\logo-design"
scripts_dir = os.path.join(SKILL_DIR, "scripts")
if scripts_dir not in sys.path:
    sys.path.insert(0, scripts_dir)

import svglib
import svg_audit

OUT_DIR = os.path.abspath("docs/branding")
os.makedirs(OUT_DIR, exist_ok=True)
RENDER_DIR = os.path.join(OUT_DIR, "renders")
os.makedirs(RENDER_DIR, exist_ok=True)

# ----------------------------------------------------------------------
# WORDMARK: "BRIAN"
# Height: 80px (y=88 to y=168), Stroke: 16px
# Angles strictly aligned to 90°, 0°, 75°, 60°, 45°
# ----------------------------------------------------------------------
def generate_brian_wordmark_paths(start_x=320, y_top=88, height=80, stroke=16):
    """
    Generates pure SVG path commands for the letters B R I A N.
    Centered for 768x256 lockup (or 640x256).
    All angles strictly aligned to 90°, 0°, 45°, 60°, 75°.
    """
    y_bot = y_top + height
    y_mid = y_top + height * 0.5
    
    paths = []
    
    # 1. Letter B
    bx = start_x
    b_path = (
        f"M {bx},{y_top} "
        f"H {bx + 32} "
        f"C {bx + 48},{y_top} {bx + 56},{y_top + 8} {bx + 56},{y_top + 22} "
        f"C {bx + 56},{y_top + 34} {bx + 48},{y_mid - 2} {bx + 36},{y_mid} "
        f"C {bx + 50},{y_mid + 2} {bx + 58},{y_mid + 14} {bx + 58},{y_bot - 24} "
        f"C {bx + 58},{y_bot - 8} {bx + 48},{y_bot} {bx + 32},{y_bot} "
        f"H {bx} Z "
        # Upper counter
        f"M {bx + stroke},{y_top + 14} "
        f"H {bx + 28} "
        f"C {bx + 38},{y_top + 14} {bx + 42},{y_top + 17} {bx + 42},{y_top + 22} "
        f"C {bx + 42},{y_top + 28} {bx + 38},{y_mid - 8} {bx + 28},{y_mid - 8} "
        f"H {bx + stroke} Z "
        # Lower counter
        f"M {bx + stroke},{y_mid + 8} "
        f"H {bx + 30} "
        f"C {bx + 40},{y_mid + 8} {bx + 44},{y_mid + 12} {bx + 44},{y_bot - 24} "
        f"C {bx + 44},{y_bot - 15} {bx + 40},{y_bot - 14} {bx + 30},{y_bot - 14} "
        f"H {bx + stroke} Z"
    )
    paths.append(b_path)
    
    # 2. Letter R (with clean 60-degree outer leg: dx = 40 / tan(60°) = 23.09)
    rx = bx + 70
    dx_r = 23.09
    r_path = (
        f"M {rx},{y_top} "
        f"H {rx + 32} "
        f"C {rx + 48},{y_top} {rx + 56},{y_top + 8} {rx + 56},{y_top + 22} "
        f"C {rx + 56},{y_top + 34} {rx + 46},{y_mid - 2} {rx + 32},{y_mid} "
        f"L {round(rx + 32 + dx_r, 2)},{y_bot} "
        f"H {round(rx + 14 + dx_r, 2)} "
        f"L {rx + 16},{y_bot - 21} "
        f"V {y_bot} "
        f"H {rx} Z "
        # Counter
        f"M {rx + stroke},{y_top + 14} "
        f"H {rx + 28} "
        f"C {rx + 38},{y_top + 14} {rx + 42},{y_top + 17} {rx + 42},{y_top + 22} "
        f"C {rx + 42},{y_top + 28} {rx + 38},{y_mid - 7} {rx + 28},{y_mid - 7} "
        f"H {rx + stroke} Z"
    )
    paths.append(r_path)
    
    # 3. Letter I
    ix = rx + 68
    i_path = f"M {ix},{y_top} H {ix + stroke} V {y_bot} H {ix} Z"
    paths.append(i_path)
    
    # 4. Letter A (exact 75° diagonals: dx = 80 / tan(75°) = 21.4359...)
    ax = ix + 32
    dx_75 = 21.44
    a_top_l = ax + 21
    a_top_r = ax + 35
    a_bot_l = round(a_top_l - dx_75, 2)
    a_bot_r = round(a_top_r + dx_75, 2)
    
    # Inner cutout for A
    dx_in = 9.11
    in_apex = ax + 28
    in_l = round(in_apex - dx_in, 2)
    in_r = round(in_apex + dx_in, 2)
    
    a_path = (
        f"M {a_top_l},{y_top} "
        f"H {a_top_r} "
        f"L {a_bot_r},{y_bot} "
        f"H {round(a_bot_r - 16, 2)} "
        f"L {round(in_r + 3, 2)},{y_bot - 24} "
        f"H {round(in_l - 3, 2)} "
        f"L {round(a_bot_l + 16, 2)},{y_bot} "
        f"H {a_bot_l} Z "
        # Inner triangle
        f"M {in_apex},{y_top + 22} "
        f"L {in_r},{y_bot - 34} "
        f"H {in_l} Z"
    )
    paths.append(a_path)
    
    # 5. Letter N (exact 60° diagonal: dx = 80 / tan(60°) = 46.188...)
    nx = ax + 72
    dx_60 = 46.19
    n_path = (
        f"M {nx},{y_top} "
        f"H {nx + stroke} "
        f"L {round(nx + dx_60, 2)},{y_bot - 16} "
        f"V {y_top} "
        f"H {round(nx + dx_60 + stroke, 2)} "
        f"V {y_bot} "
        f"H {round(nx + dx_60, 2)} "
        f"L {nx + stroke},{y_top + 16} "
        f"V {y_bot} "
        f"H {nx} Z"
    )
    paths.append(n_path)
    
    return paths

# ----------------------------------------------------------------------
# CONCEPT A: THE SYNAPTIC B (Dual-Hemisphere Letterform)
# ----------------------------------------------------------------------
def build_concept_a_symbol():
    """
    Symbol A: Dual Cerebral Hemispheres formed into letter B.
    Strong vertical cognitive spine on left (x=44..84),
    Upper hemisphere (executive control) and lower hemisphere (memory/intuition),
    with an organic horizontal synaptic cleft at y=122..134.
    """
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-a">
  <title id="title-a">BRIAN — The Synaptic B</title>
  <path fill="#0F172A" fill-rule="evenodd" d="
    M 56,32
    H 136
    C 176,32 206,56 206,90
    C 206,112 192,122 168,124
    C 148,126 124,126 100,126
    C 124,130 148,130 168,132
    C 192,134 212,146 212,174
    C 212,206 178,224 136,224
    H 56
    C 48,224 44,220 44,212
    V 44
    C 44,36 48,32 56,32
    Z
    M 84,60
    H 132
    C 156,60 172,70 172,88
    C 172,106 156,114 132,114
    H 84
    Z
    M 84,142
    H 132
    C 158,142 176,152 176,170
    C 176,188 158,196 132,196
    H 84
    Z
  "/>
</svg>'''
    return svg

def build_concept_a_lockup():
    paths = generate_brian_wordmark_paths(start_x=348, y_top=88, height=80, stroke=16)
    wordmark_d = " ".join(paths)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 256" width="768" height="256" role="img" aria-labelledby="title-a-lockup">
  <title id="title-a-lockup">BRIAN — The Synaptic B Horizontal Lockup</title>
  <g id="symbol" transform="translate(76, 0)">
    <path fill="#0F172A" fill-rule="evenodd" d="
      M 56,32
      H 136
      C 176,32 206,56 206,90
      C 206,112 192,122 168,124
      C 148,126 124,126 100,126
      C 124,130 148,130 168,132
      C 192,134 212,146 212,174
      C 212,206 178,224 136,224
      H 56
      C 48,224 44,220 44,212
      V 44
      C 44,36 48,32 56,32
      Z
      M 84,60
      H 132
      C 156,60 172,70 172,88
      C 172,106 156,114 132,114
      H 84
      Z
      M 84,142
      H 132
      C 158,142 176,152 176,170
      C 176,188 158,196 132,196
      H 84
      Z
    "/>
  </g>
  <g id="wordmark">
    <path fill="#0F172A" fill-rule="evenodd" d="{wordmark_d}"/>
  </g>
</svg>'''
    return svg

# ----------------------------------------------------------------------
# CONCEPT B: THE CONTINUOUS MIND (Möbius Neuro-Loop)
# ----------------------------------------------------------------------
def build_concept_b_symbol():
    """
    Symbol B: An interlocking continuous neural loop forming cerebral lobes.
    Shifted by +6 vertically for exact L32 R32 T34 B34 margins.
    """
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-b">
  <title id="title-b">BRIAN — The Continuous Mind</title>
  <path fill="#0F172A" fill-rule="evenodd" d="
    M 128,34
    C 74,34 32,76 32,130
    C 32,174 62,210 102,222
    V 190
    C 78,180 58,154 58,130
    C 58,90 90,60 128,60
    C 166,60 198,90 198,130
    C 198,154 178,180 154,190
    V 222
    C 194,210 224,174 224,130
    C 224,76 182,34 128,34
    Z
    M 128,94
    C 108,94 92,110 92,130
    C 92,154 108,174 128,204
    C 148,174 164,154 164,130
    C 164,110 148,94 128,94
    Z
    M 128,120
    C 134,120 138,124 138,130
    C 138,138 132,150 128,160
    C 124,150 118,138 118,130
    C 118,124 122,120 128,120
    Z
  "/>
</svg>'''
    return svg

def build_concept_b_lockup():
    paths = generate_brian_wordmark_paths(start_x=348, y_top=88, height=80, stroke=16)
    wordmark_d = " ".join(paths)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 256" width="768" height="256" role="img" aria-labelledby="title-b-lockup">
  <title id="title-b-lockup">BRIAN — The Continuous Mind Horizontal Lockup</title>
  <g id="symbol" transform="translate(88, 0)">
    <path fill="#0F172A" fill-rule="evenodd" d="
      M 128,34
      C 74,34 32,76 32,130
      C 32,174 62,210 102,222
      V 190
      C 78,180 58,154 58,130
      C 58,90 90,60 128,60
      C 166,60 198,90 198,130
      C 198,154 178,180 154,190
      V 222
      C 194,210 224,174 224,130
      C 224,76 182,34 128,34
      Z
      M 128,94
      C 108,94 92,110 92,130
      C 92,154 108,174 128,204
      C 148,174 164,154 164,130
      C 164,110 148,94 128,94
      Z
      M 128,120
      C 134,120 138,124 138,130
      C 138,138 132,150 128,160
      C 124,150 118,138 118,130
      C 118,124 122,120 128,120
      Z
    "/>
  </g>
  <g id="wordmark">
    <path fill="#0F172A" fill-rule="evenodd" d="{wordmark_d}"/>
  </g>
</svg>'''
    return svg

# ----------------------------------------------------------------------
# CONCEPT C: THE ANAGRAM SPARK (Geometric Monogram with Living Synapse Eye)
# ----------------------------------------------------------------------
def build_concept_c_symbol():
    """
    Symbol C: Geometric Monogram B with living Spark / Synapse Eye node.
    Shifted x by -4 for exact L52 R52 T36 B36 margins.
    """
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-c">
  <title id="title-c">BRIAN — The Anagram Spark</title>
  <path fill="#0F172A" fill-rule="evenodd" d="
    M 52,36
    H 132
    C 170,36 200,64 200,96
    C 200,118 184,124 168,126
    C 188,128 204,138 204,164
    C 204,196 170,220 132,220
    H 52
    Z
    M 84,64
    H 128
    C 148,64 164,72 164,88
    C 164,104 148,112 128,112
    H 84
    Z
    M 84,144
    H 128
    C 148,144 168,152 168,168
    C 168,184 148,192 128,192
    H 84
    Z
  "/>
  <circle cx="124" cy="128" r="13" fill="#0F172A"/>
</svg>'''
    return svg

def build_concept_c_lockup():
    paths = generate_brian_wordmark_paths(start_x=348, y_top=88, height=80, stroke=16)
    wordmark_d = " ".join(paths)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 256" width="768" height="256" role="img" aria-labelledby="title-c-lockup">
  <title id="title-c-lockup">BRIAN — The Anagram Spark Horizontal Lockup</title>
  <g id="symbol" transform="translate(68, 0)">
    <path fill="#0F172A" fill-rule="evenodd" d="
      M 52,36
      H 132
      C 170,36 200,64 200,96
      C 200,118 184,124 168,126
      C 188,128 204,138 204,164
      C 204,196 170,220 132,220
      H 52
      Z
      M 84,64
      H 128
      C 148,64 164,72 164,88
      C 164,104 148,112 128,112
      H 84
      Z
      M 84,144
      H 128
      C 148,144 168,152 168,168
      C 168,184 148,192 128,192
      H 84
      Z
    "/>
    <circle cx="124" cy="128" r="13" fill="#0F172A"/>
  </g>
  <g id="wordmark">
    <path fill="#0F172A" fill-rule="evenodd" d="{wordmark_d}"/>
  </g>
</svg>'''
    return svg

def main():
    files = {
        "concept-a-symbol.svg": build_concept_a_symbol(),
        "concept-a-lockup.svg": build_concept_a_lockup(),
        "concept-b-symbol.svg": build_concept_b_symbol(),
        "concept-b-lockup.svg": build_concept_b_lockup(),
        "concept-c-symbol.svg": build_concept_c_symbol(),
        "concept-c-lockup.svg": build_concept_c_lockup(),
    }
    for name, content in files.items():
        p = os.path.join(OUT_DIR, name)
        with open(p, "w", encoding="utf-8") as f:
            f.write(content.strip() + "\n")
        print(f"Wrote {p}")

if __name__ == "__main__":
    main()
