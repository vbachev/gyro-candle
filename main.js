let particles = []
const delay = 30
const gravity = new Vector(0, 1)
const candle = document.querySelector(".candle")

function onEachFrame(callback, oldTime = 0) {
  requestAnimationFrame(newTime => {
    callback(newTime - oldTime)
    onEachFrame(callback, newTime)
  })
}

function addParticle() {
  particles.push({
    pos: new Vector(),
    t: 1,
    s: 10,
    v: 150
  })
}

function getParticleShadow(particle) {
  const { pos, s, t } = particle
  const hue = Math.round(255 * t)
  const alpha = t
  const blur = 3
  return `${pos.x}px ${pos.y}px ${blur}px ${s}px rgba(255,${hue},0,${alpha})`
}

function updateParticle(particle, dt) {
  const fluke = new Vector(Math.random() * 2 - 1, 0)
  const velocity = gravity.clone().mult(-1 * particle.v * dt / 1000)
  particle.pos.add(velocity).add(fluke)
  particle.t -= dt / 1000
  particle.s -= 5 * dt / 1000
}

setInterval(addParticle, delay)

onEachFrame(dt => {
  particles = particles.filter(p => {
    if (p.t < 0) return false
    updateParticle(p, dt)
    return true
  })
  candle.style.boxShadow = particles.map(getParticleShadow).join()
})
function toggleFullScreen (targetElement) {
  if (!document.mozFullScreen && !document.webkitFullScreen) {
    if (targetElement.mozRequestFullScreen) {
      targetElement.mozRequestFullScreen()
    } else {
      targetElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
    }
  } else {
    if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else {
      document.webkitCancelFullScreen()
    }
  }
}

screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation
document.documentElement.addEventListener('click', () => {
  toggleFullScreen(document.documentElement)
  screen.lockOrientationUniversal('portrait-primary')
})

