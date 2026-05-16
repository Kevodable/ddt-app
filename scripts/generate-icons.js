import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const svgBuffer = readFileSync(join(root, 'public', 'icon.svg'))

mkdirSync(join(root, 'public', 'icons'), { recursive: true })

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

await Promise.all(
  sizes.map(size =>
    sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(root, 'public', 'icons', `icon-${size}.png`))
  )
)

await sharp(svgBuffer)
  .resize(180, 180)
  .png()
  .toFile(join(root, 'public', 'apple-touch-icon.png'))

console.log('Icone generate con successo.')
