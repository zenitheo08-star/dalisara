import sys

with open('src/components/RippleDistortion.tsx', 'r') as f:
    content = f.read()

target = """  // --- Advanced Upscale / Sharpening filter ---
  vec2 texel = 1.0 / uTextureSize;
  
  // 9-tap sampling
  vec3 cUp = texture2D(uTexture, base + push + vec2(0.0, texel.y)).rgb;
  vec3 cDn = texture2D(uTexture, base + push + vec2(0.0, -texel.y)).rgb;
  vec3 cLf = texture2D(uTexture, base + push + vec2(-texel.x, 0.0)).rgb;
  vec3 cRt = texture2D(uTexture, base + push + vec2(texel.x, 0.0)).rgb;
  vec3 cUL = texture2D(uTexture, base + push + vec2(-texel.x, texel.y)).rgb;
  vec3 cUR = texture2D(uTexture, base + push + vec2(texel.x, texel.y)).rgb;
  vec3 cDL = texture2D(uTexture, base + push + vec2(-texel.x, -texel.y)).rgb;
  vec3 cDR = texture2D(uTexture, base + push + vec2(texel.x, -texel.y)).rgb;
  
  // Gaussian blur approximation for unsharp mask
  vec3 blurred = (cUL + cUR + cDL + cDR) * 0.0625 + (cUp + cDn + cLf + cRt) * 0.125 + color * 0.25;
  
  // More aggressive sharpening multiplier (2.8x)
  color = color + (color - blurred) * 2.8; 
  // -----------------------------------"""

replace = """  // --- Balanced Upscale (Soft yet crisp) ---
  vec2 texel = 1.0 / uTextureSize;
  
  // 9-tap sampling
  vec3 cUp = texture2D(uTexture, base + push + vec2(0.0, texel.y)).rgb;
  vec3 cDn = texture2D(uTexture, base + push + vec2(0.0, -texel.y)).rgb;
  vec3 cLf = texture2D(uTexture, base + push + vec2(-texel.x, 0.0)).rgb;
  vec3 cRt = texture2D(uTexture, base + push + vec2(texel.x, 0.0)).rgb;
  vec3 cUL = texture2D(uTexture, base + push + vec2(-texel.x, texel.y)).rgb;
  vec3 cUR = texture2D(uTexture, base + push + vec2(texel.x, texel.y)).rgb;
  vec3 cDL = texture2D(uTexture, base + push + vec2(-texel.x, -texel.y)).rgb;
  vec3 cDR = texture2D(uTexture, base + push + vec2(texel.x, -texel.y)).rgb;
  
  // Gaussian blur approximation for unsharp mask
  vec3 blurred = (cUL + cUR + cDL + cDR) * 0.0625 + (cUp + cDn + cLf + cRt) * 0.125 + color * 0.25;
  
  // Gentle sharpening multiplier (0.45x) instead of aggressive crunch (2.8x)
  // This recovers edge definition without creating pixelation or highlighting video compression artifacts.
  color = color + (color - blurred) * 0.45; 
  // -----------------------------------"""

if target in content:
    content = content.replace(target, replace)
    with open('src/components/RippleDistortion.tsx', 'w') as f:
        f.write(content)
    print("Shader patched successfully.")
else:
    print("Target not found.")

