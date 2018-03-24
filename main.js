const delay = 30
let particles = []
const candle = document.querySelector('.candle')

function onEachFrame (callback, oldTime = 0) { 
    requestAnimationFrame(newTime => {
        callback(newTime - oldTime)
        onEachFrame(callback, newTime)
    })
}

function addParticle () {
    particles.push({
        x: 0,
        y: 0,
        t: 1,
        s: 10,
        v: 150
    })
}

function getParticleShadow (particle) {
    const { x, y, s, t } = particle
    const hue = Math.round(255 * t)
    const alpha = t
    const blur = 3
    return `${x}px ${y}px ${blur}px ${s}px rgba(255,${hue},0,${alpha})`
}

function updateParticle (particle, dt) {
    particle.y -= particle.v / (1000 / dt)
    particle.x += (Math.random() * 2) - 1
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
