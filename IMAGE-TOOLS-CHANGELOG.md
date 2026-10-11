# Image & Media Network — changes

New shared files
- lib/tool-processors/image-engine.ts (decode, resize, size-target compress, ICO, SVG, crop math)
- components/tools/image/* (ImageBatch + one component per tool)

Edited files
- components/tools/registry.ts, components/tools/MiniTool.tsx (new tools registered, presets passed)
- app/(main)/[slug]/page.tsx (variant presets now reach the new tools)
- lib/tool-variants.ts ("under 100KB/500KB" pages now really hit that size)
- lib/seo-content.ts (image how-to/FAQ text matches the new behaviour)

Old image code in ToolWorkspace.tsx is untouched (no longer used for these slugs).

Update 2
- Smart PNG compression (palette quantiser + indexed PNG writer, TinyPNG-style) in Compress Image
- Dropzone: choosing the same file twice now works
