// X-Ray Animation Component for Pre-Launch Hero Section
import { useEffect, useRef } from 'react'

interface XRayAnimationProps {
  className?: string
}

export default function XRayAnimation({ className = '' }: XRayAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const xrayEffectRef = useRef<any>(null)

  useEffect(() => {
    console.log('🚀 XRay: Komponent montowany')
    
    if (!canvasRef.current) {
      console.log('❌ XRay: Canvas ref nie istnieje')
      return
    }
    
    console.log('✅ XRay: Canvas ref dostępny, tworzę efekt')

    class XRayEffect {
      canvas: HTMLCanvasElement
      ctx: CanvasRenderingContext2D
      maskX: number
      maskY: number
      maskRadius: number
      targetX: number
      targetY: number
      smoothing: number
      autoMove: boolean
      autoMoveSpeed: number
      autoMoveAngle: number
      autoMoveRadius: number
      backgroundImage: HTMLImageElement | null
      xrayImage: HTMLImageElement | null
      imagesLoaded: number
      animationFrame: number | null
      isMouseOver: boolean

      constructor(canvas: HTMLCanvasElement) {
        console.log('🔧 XRay: Tworzę instancję XRayEffect')
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')!
        
        // Pozycja i parametry maski (okręgu)
        this.maskX = 0
        this.maskY = 0
        this.maskRadius = 84 // Zmniejszone o 30% (120 * 0.7 = 84)
        this.targetX = 0
        this.targetY = 0
        this.smoothing = 0.12
        
        // Automatyczny ruch
        this.autoMove = true
        this.autoMoveSpeed = 0.015
        this.autoMoveAngle = 0
        this.autoMoveRadius = 100
        
        // Obrazy
        this.backgroundImage = null
        this.xrayImage = null
        this.imagesLoaded = 0
        
        // Animacja
        this.animationFrame = null
        this.isMouseOver = false
        
        console.log('🔧 XRay: Inicjalizuję efekt')
        this.init()
      }
      
      init() {
        // Set initial canvas size after a small delay to ensure parent is rendered
        setTimeout(() => {
          this.handleResize()
        }, 100)
        
        this.createImages()
        
        // Event listeners
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e))
        this.canvas.addEventListener('mouseenter', () => {
          this.isMouseOver = true
          this.autoMove = false
        })
        this.canvas.addEventListener('mouseleave', () => {
          this.isMouseOver = false
          this.autoMove = true
        })
        
        window.addEventListener('resize', () => {
          this.handleResize()
        })
      }
      
      createImages() {
        const basePath = import.meta.env.BASE_URL || '/paleta/'
        console.log('🔍 XRay: Ładowanie obrazów z base path:', basePath)
        
        // Załaduj obrazy z public/images
        this.backgroundImage = new Image()
        this.backgroundImage.onload = () => {
          console.log('✅ XRay: Załadowano background.png')
          this.onImageLoad()
        }
        this.backgroundImage.onerror = () => {
          console.log('❌ XRay: Błąd ładowania background.png, używam fallback')
          this.createFallbackImages()
        }
        
        this.xrayImage = new Image()
        this.xrayImage.onload = () => {
          console.log('✅ XRay: Załadowano xray.png')
          this.onImageLoad()
        }
        this.xrayImage.onerror = () => {
          console.log('❌ XRay: Błąd ładowania xray.png, używam fallback')
          this.createFallbackImages()
        }
        
        // Załaduj obrazy z public/images (uwzględniając base path)
        const bgPath = `${basePath}images/background.png`
        const xrayPath = `${basePath}images/xray.png`
        console.log('🔍 XRay: Próbuję załadować:', bgPath, xrayPath)
        
        this.backgroundImage.src = bgPath
        this.xrayImage.src = xrayPath
      }
      
      createFallbackImages() {
        console.log('🎨 Tworzę fallback images')
        
        // Reset counter
        this.imagesLoaded = 0
        
        // Fallback - tło gradientowe kwadratowe (1:1)
        const tempCanvas1 = document.createElement('canvas')
        tempCanvas1.width = 1024
        tempCanvas1.height = 1024
        const tempCtx1 = tempCanvas1.getContext('2d')!
        
        // Gradient tła
        const gradient1 = tempCtx1.createLinearGradient(0, 0, 1024, 1024)
        gradient1.addColorStop(0, '#4f39f6')
        gradient1.addColorStop(1, '#9810fa')
        tempCtx1.fillStyle = gradient1
        tempCtx1.fillRect(0, 0, 1024, 1024)
        
        // Window controls (top left)
        tempCtx1.fillStyle = '#ff6467'
        tempCtx1.beginPath()
        tempCtx1.arc(40, 40, 12, 0, Math.PI * 2)
        tempCtx1.fill()
        tempCtx1.fillStyle = '#fdc700'
        tempCtx1.beginPath()
        tempCtx1.arc(70, 40, 12, 0, Math.PI * 2)
        tempCtx1.fill()
        tempCtx1.fillStyle = '#05df72'
        tempCtx1.beginPath()
        tempCtx1.arc(100, 40, 12, 0, Math.PI * 2)
        tempCtx1.fill()
        
        // Dashboard mockup - stats cards (proporcjonalnie przeskalowane)
        tempCtx1.fillStyle = 'rgba(255, 255, 255, 0.2)'
        tempCtx1.fillRect(100, 100, 190, 100)
        tempCtx1.fillRect(310, 100, 190, 100)
        tempCtx1.fillRect(520, 100, 190, 100)
        
        // Progress bars
        for (let i = 0; i < 7; i++) {
          tempCtx1.fillStyle = 'rgba(255, 255, 255, 0.1)'
          tempCtx1.fillRect(100, 250 + i * 45, 620, 30)
          tempCtx1.fillStyle = 'rgba(124, 134, 255, 0.8)'
          tempCtx1.fillRect(100, 250 + i * 45, 620 * (0.6 + Math.random() * 0.3), 30)
        }
        
        tempCtx1.fillStyle = 'white'
        tempCtx1.font = 'bold 32px Inter'
        tempCtx1.textAlign = 'center'
        tempCtx1.fillText('Dashboard Preview', 512, 70)
        
        this.backgroundImage = new Image()
        this.backgroundImage.onload = () => this.onImageLoad()
        this.backgroundImage.src = tempCanvas1.toDataURL()
        
        // X-Ray fallback - kwadratowy (1:1)
        const tempCanvas2 = document.createElement('canvas')
        tempCanvas2.width = 1024
        tempCanvas2.height = 1024
        const tempCtx2 = tempCanvas2.getContext('2d')!
        
        // Tło X-Ray
        tempCtx2.fillStyle = '#0a0a0a'
        tempCtx2.fillRect(0, 0, 1024, 1024)
        
        // Świecące ramki (proporcjonalnie przeskalowane)
        tempCtx2.strokeStyle = '#00ffff'
        tempCtx2.lineWidth = 3
        tempCtx2.shadowColor = '#00ffff'
        tempCtx2.shadowBlur = 20
        
        tempCtx2.strokeRect(100, 100, 190, 100)
        tempCtx2.strokeRect(310, 100, 190, 100)
        tempCtx2.strokeRect(520, 100, 190, 100)
        
        // Progress bars w X-ray
        for (let i = 0; i < 7; i++) {
          tempCtx2.strokeStyle = '#00ffff'
          tempCtx2.lineWidth = 2
          tempCtx2.strokeRect(100, 250 + i * 45, 620, 30)
        }
        
        tempCtx2.fillStyle = '#00ffff'
        tempCtx2.font = 'bold 32px Inter'
        tempCtx2.textAlign = 'center'
        tempCtx2.shadowBlur = 30
        tempCtx2.fillText('X-RAY VIEW', 512, 70)
        tempCtx2.shadowBlur = 0
        
        this.xrayImage = new Image()
        this.xrayImage.onload = () => this.onImageLoad()
        this.xrayImage.src = tempCanvas2.toDataURL()
      }
      
      onImageLoad() {
        this.imagesLoaded++
        console.log(`🎨 XRay: Załadowano obraz ${this.imagesLoaded}/2`)
        
        if (this.imagesLoaded === 2) {
          console.log('✅ XRay: Wszystkie obrazy załadowane, uruchamiam animację')
          this.handleResize()
          this.maskX = this.canvas.width / 2
          this.maskY = this.canvas.height / 2
          this.targetX = this.maskX
          this.targetY = this.maskY
          console.log(`📐 XRay: Canvas size: ${this.canvas.width}x${this.canvas.height}`)
          this.startAnimation()
        }
      }
      
      handleResize() {
        const wrapper = this.canvas.parentElement
        if (!wrapper) {
          console.log('❌ XRay: Brak parent element')
          return
        }
        
        // Pobierz wymiary kontenera
        const containerRect = wrapper.getBoundingClientRect()
        const containerSize = Math.min(containerRect.width, containerRect.height) || 500
        
        // KWADRAT: wymuś identyczne wymiary
        this.canvas.width = containerSize
        this.canvas.height = containerSize
        
        // Wymuś style CSS dla kwadratu
        this.canvas.style.width = `${containerSize}px`
        this.canvas.style.height = `${containerSize}px`
        this.canvas.style.aspectRatio = '1/1'
        
        console.log(`📐 XRay: Canvas KWADRAT: ${this.canvas.width} x ${this.canvas.height}`)
        console.log(`📐 XRay: Container: ${containerRect.width} x ${containerRect.height}`)
        console.log(`📐 XRay: Canvas.style: ${this.canvas.style.width} x ${this.canvas.style.height}`)
        
        // Update mask position to center
        this.maskX = this.canvas.width / 2
        this.maskY = this.canvas.height / 2
        this.targetX = this.maskX
        this.targetY = this.maskY
      }
      
      handleMouseMove(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect()
        this.targetX = (e.clientX - rect.left) * (this.canvas.width / rect.width)
        this.targetY = (e.clientY - rect.top) * (this.canvas.height / rect.height)
      }
      
      updateMaskPosition() {
        if (this.autoMove) {
          this.autoMoveAngle += this.autoMoveSpeed
          
          const centerX = this.canvas.width / 2
          const centerY = this.canvas.height / 2
          
          // Ruch z wariacjami
          const noise = Math.sin(this.autoMoveAngle * 3) * 40
          const noise2 = Math.cos(this.autoMoveAngle * 2) * 30
          
          this.targetX = centerX + Math.cos(this.autoMoveAngle) * (this.autoMoveRadius + noise)
          this.targetY = centerY + Math.sin(this.autoMoveAngle * 0.8) * (this.autoMoveRadius * 0.7 + noise2)
        }
        
        // Płynne poruszanie
        this.maskX += (this.targetX - this.maskX) * this.smoothing
        this.maskY += (this.targetY - this.maskY) * this.smoothing
      }
      
      draw() {
        if (!this.backgroundImage || !this.xrayImage) return
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        
        // Obraz tła - center crop do kwadratu
        const imgAspect = this.backgroundImage.width / this.backgroundImage.height
        const canvasAspect = this.canvas.width / this.canvas.height
        
        let drawWidth, drawHeight, drawX, drawY
        
        if (imgAspect > canvasAspect) {
          // Obraz szerszy niż canvas
          drawHeight = this.canvas.height
          drawWidth = drawHeight * imgAspect
          drawX = (this.canvas.width - drawWidth) / 2
          drawY = 0
        } else {
          // Obraz wyższy niż canvas lub równy
          drawWidth = this.canvas.width
          drawHeight = drawWidth / imgAspect
          drawX = 0
          drawY = (this.canvas.height - drawHeight) / 2
        }
        
        this.ctx.drawImage(this.backgroundImage, drawX, drawY, drawWidth, drawHeight)
        
        // Zapisz stan
        this.ctx.save()
        
        // Maska okrągła
        this.ctx.beginPath()
        this.ctx.arc(this.maskX, this.maskY, this.maskRadius, 0, Math.PI * 2)
        this.ctx.closePath()
        this.ctx.clip()
        
        // Obraz X-Ray w masce - center crop do kwadratu
        this.ctx.drawImage(this.xrayImage, drawX, drawY, drawWidth, drawHeight)
        
        // Przywróć stan
        this.ctx.restore()
        
        // Ramka okręgu - zewnętrzna
        this.ctx.beginPath()
        this.ctx.arc(this.maskX, this.maskY, this.maskRadius, 0, Math.PI * 2)
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)'
        this.ctx.lineWidth = 3
        this.ctx.shadowColor = '#00ffff'
        this.ctx.shadowBlur = 15
        this.ctx.stroke()
        
        // Dodatkowa ramka świecąca
        this.ctx.beginPath()
        this.ctx.arc(this.maskX, this.maskY, this.maskRadius + 8, 0, Math.PI * 2)
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)'
        this.ctx.lineWidth = 2
        this.ctx.shadowBlur = 25
        this.ctx.stroke()
        
        this.ctx.shadowBlur = 0
        
        // Punkt środkowy
        this.ctx.beginPath()
        this.ctx.arc(this.maskX, this.maskY, 5, 0, Math.PI * 2)
        this.ctx.fillStyle = 'rgba(0, 255, 255, 0.6)'
        this.ctx.fill()
      }
      
      animate() {
        this.updateMaskPosition()
        this.draw()
        this.animationFrame = requestAnimationFrame(() => this.animate())
      }
      
      startAnimation() {
        console.log('🎬 XRay: Uruchamiam animację')
        if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame)
        }
        this.animate()
      }
      
      destroy() {
        if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame)
        }
      }
    }

    // Inicjalizacja
    const xrayEffect = new XRayEffect(canvasRef.current)
    xrayEffectRef.current = xrayEffect

    // Cleanup
    return () => {
      if (xrayEffectRef.current) {
        xrayEffectRef.current.destroy()
      }
    }
  }, [])

  return (
    <div 
      className={`relative ${className}`} 
      style={{ 
        aspectRatio: '1/1', 
        width: '100%',
        height: '100%',
        minHeight: '400px',
        maxHeight: '600px'
      }}
    >
      <canvas 
        ref={canvasRef}
        className="block w-full h-full rounded-2xl bg-gradient-to-br from-[#4f39f6] to-[#9810fa]"
        style={{ 
          cursor: 'none',
          width: '100%',
          height: '100%',
          aspectRatio: '1/1'
        }}
      />
      
      {/* Loading/Debug info - will be covered by canvas when it renders */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-white/30 text-sm">
          X-Ray Animation Loading...
        </div>
      </div>
    </div>
  )
}

