import { createCanvas } from 'canvas'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function drawIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  const radius = size * 0.16

  // Sfondo blu scuro con angoli arrotondati
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.lineTo(size - radius, 0)
  ctx.quadraticCurveTo(size, 0, size, radius)
  ctx.lineTo(size, size - radius)
  ctx.quadraticCurveTo(size, size, size - radius, size)
  ctx.lineTo(radius, size)
  ctx.quadraticCurveTo(0, size, 0, size - radius)
  ctx.lineTo(0, radius)
  ctx.quadraticCurveTo(0, 0, radius, 0)
  ctx.closePath()

  // Gradiente blu
  const grad = ctx.createLinearGradient(0, 0, 0, size)
  grad.addColorStop(0, '#2563eb')
  grad.addColorStop(1, '#1e3a8a')
  ctx.fillStyle = grad
  ctx.fill()

  // Testo "DDT" bianco bold centrato
  const fontSize = size * 0.42
  ctx.fillStyle = 'white'
  ctx.font = `900 ${fontSize}px "Arial Black", "Liberation Sans", Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('DDT', size / 2, size * 0.47)

  // Linea decorativa sottile
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = size * 0.012
  ctx.beginPath()
  ctx.moveTo(size * 0.15, size * 0.70)
  ctx.lineTo(size * 0.85, size * 0.70)
  ctx.stroke()

  // Testo "TRASPORTO" piccolo sotto la linea
  const subSize = size * 0.09
  ctx.font = `500 ${subSize}px Arial, "Liberation Sans", sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.letterSpacing = `${size * 0.015}px`
  ctx.fillText('TRASPORTO', size / 2, size * 0.83)

  return canvas.toBuffer('image/png')
}

mkdirSync(join(root, 'public', 'icons'), { recursive: true })

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
for (const size of sizes) {
  const buf = drawIcon(size)
  writeFileSync(join(root, 'public', 'icons', `icon-${size}.png`), buf)
  console.log(`✓ icon-${size}.png`)
}

// Apple touch icon per iOS (180x180)
const appleIcon = drawIcon(180)
writeFileSync(join(root, 'public', 'apple-touch-icon.png'), appleIcon)
console.log('✓ apple-touch-icon.png (180x180 per iOS)')

console.log('\nTutte le icone generate con successo.')
