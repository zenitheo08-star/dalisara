import sys

with open('src/components/RippleDistortion.tsx', 'r') as f:
    content = f.read()

target = """  if (uDispersion > 0.001) {
    float split = uDispersion * 0.25;
    color.r = texture2D(uTexture, base + push * (1.0 + split)).r;
    color.g = texture2D(uTexture, base + push).g;
    color.b = texture2D(uTexture, base + push * (1.0 - split)).b;
  } else {
    color = texture2D(uTexture, base + push).rgb;
  }"""

replace = """  if (uDispersion > 0.001) {
    float split = uDispersion * 0.25;
    color.r = texture2D(uTexture, base + push * (1.0 + split)).r;
    color.g = texture2D(uTexture, base + push).g;
    color.b = texture2D(uTexture, base + push * (1.0 - split)).b;
  } else {
    color = texture2D(uTexture, base + push).rgb;
  }

  // --- Upscale / Sharpening filter ---
  vec2 texel = 1.0 / uTextureSize;
  vec3 cUp = texture2D(uTexture, base + push + vec2(0.0, texel.y)).rgb;
  vec3 cDn = texture2D(uTexture, base + push - vec2(0.0, texel.y)).rgb;
  vec3 cLf = texture2D(uTexture, base + push - vec2(texel.x, 0.0)).rgb;
  vec3 cRt = texture2D(uTexture, base + push + vec2(texel.x, 0.0)).rgb;
  vec3 blurred = (cUp + cDn + cLf + cRt) * 0.25;
  color = color + (color - blurred) * 0.85; // Crispness/Sharpen amount
  // -----------------------------------"""

if target in content:
    content = content.replace(target, replace)
    with open('src/components/RippleDistortion.tsx', 'w') as f:
        f.write(content)
    print("Shader patched successfully.")
else:
    print("Target not found.")

