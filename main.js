let particles = []
const delay = 30
const gyroNorm = new GyroNorm()
const gravity = new Vector(0, 1)
const candle = document.querySelector('.candle')

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

function updateGravity (rotation, movement) {
  const sideForce = new Vector(...movement)
  const downForce = new Vector(Math.cos(rotation), Math.sin(rotation))
  gravity.mult(0).add(downForce).add(sideForce)
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

function onEachMeasurement (callback) {
  gyroNorm
    .init({
      logger: data => console.log(data)
    })
    .then(() => gyroNorm.start(callback))
    .catch(e => console.error('DeviceOrientation or DeviceMotion is not supported by the browser or device.'))
}

function getOrientation () {
  return screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type
}

function toRadian (deg) {
  return deg * Math.PI / 180
}

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

setInterval(addParticle, delay)

onEachFrame(dt => {
  particles = particles.filter(p => {
    if (p.t < 0) return false
    updateParticle(p, dt)
    return true
  })
  candle.style.boxShadow = particles.map(getParticleShadow).join()
})

onEachMeasurement(data => {
  const orientation = getOrientation()
  let metric = 'alpha'
  let offset = 90
  let multiplier = 1
  if (orientation === 'landscape-primary') {
    if (data.do.gamma < 0) {
      multiplier = -1
    }
    metric = 'beta'
    offset = 270
  } else if (orientation === 'landscape-secondary') {
    metric = 'beta'
  }

  const rotation = toRadian((data.do[metric] + offset) * multiplier)
  const movement = [
    data.dm.x * 1,
    data.dm.y * -1
  ]
  updateGravity(rotation, movement)
})

screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation
document.documentElement.addEventListener('click', () => {
  toggleFullScreen(document.documentElement)
  screen.lockOrientationUniversal('portrait-primary')
})

