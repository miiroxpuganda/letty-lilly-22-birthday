const canvas = document.getElementById("fireworksCanvas")
const ctx = canvas.getContext("2d")
const fireworks = []
const colors = ["#ff6b8a", "#ffd166", "#78dcca", "#6c63ff", "#ff9ec5", "#ffffff"]

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio
  canvas.height = window.innerHeight * window.devicePixelRatio
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
}

window.addEventListener("resize", resizeCanvas)
resizeCanvas()

class Particle {
  constructor(x, y, color, angle, speed, size) {
    this.x = x
    this.y = y
    this.color = color
    this.angle = angle
    this.speed = speed
    this.size = size
    this.alpha = 1
    this.gravity = 0.04
    this.spin = Math.random() * 0.25
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed + this.gravity
    this.speed *= 0.965
    this.alpha -= 0.012
    this.angle += this.spin * 0.02
  }

  draw() {
    ctx.save()
    ctx.globalAlpha = Math.max(this.alpha, 0)
    ctx.fillStyle = this.color
    ctx.shadowColor = this.color
    ctx.shadowBlur = 12
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

class Firework {
  constructor(x, y, particleCount = 90) {
    this.particles = []

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 5 + 2
      const size = Math.random() * 2.8 + 1.2
      const color = colors[Math.floor(Math.random() * colors.length)]
      this.particles.push(new Particle(x, y, color, angle, speed, size))
    }
  }

  update() {
    this.particles = this.particles.filter(particle => {
      particle.update()
      return particle.alpha > 0
    })
  }

  draw() {
    this.particles.forEach(particle => particle.draw())
  }
}

function burst(x = Math.random() * window.innerWidth, y = Math.random() * window.innerHeight * 0.62 + 40, count = 90) {
  fireworks.push(new Firework(x, y, count))
}

function partyBurst(rounds = 5) {
  for (let i = 0; i < rounds; i++) {
    setTimeout(() => {
      burst(
        window.innerWidth * (0.18 + Math.random() * 0.64),
        window.innerHeight * (0.14 + Math.random() * 0.52),
        80 + Math.floor(Math.random() * 45)
      )
    }, i * 280)
  }
}

window.celebrateBurst = partyBurst

document.addEventListener("click", event => {
  burst(event.clientX, event.clientY, 100)
})

function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

  fireworks.forEach(firework => {
    firework.update()
    firework.draw()
  })

  for (let i = fireworks.length - 1; i >= 0; i--) {
    if (fireworks[i].particles.length === 0) {
      fireworks.splice(i, 1)
    }
  }

  requestAnimationFrame(animate)
}

setTimeout(() => partyBurst(3), 900)
setInterval(() => {
  if (document.querySelector(".startSign")?.style.display === "none") {
    partyBurst(2)
  }
}, 9000)

animate()
