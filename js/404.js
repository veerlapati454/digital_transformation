// Populate the attempted path from the URL, and a synthetic trace id.
try{
  var p = window.location.pathname;
  document.getElementById('pathText').textContent = (p && p !== '/') ? p : '/unknown-route';
}catch(e){}
document.getElementById('traceId').textContent =
  Math.random().toString(16).slice(2,6).toUpperCase() + '-' + Math.random().toString(16).slice(2,6).toUpperCase();

// Back button behavior
document.getElementById('backBtn').addEventListener('click', function(){
  if(window.history.length > 1){
    window.history.back();
  } else {
    window.location.href = '/';
  }
});

// ---------- Particle field: drifting binary / data motes ----------
var canvas = document.getElementById('particles');
var ctx = canvas.getContext('2d');
var particles = [];
var DPR = Math.min(window.devicePixelRatio || 1, 2);
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize(){
  canvas.width = window.innerWidth * DPR;
  canvas.height = window.innerHeight * DPR;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
}
resize();
window.addEventListener('resize', resize);

function initParticles(){
  particles = [];
  var count = Math.min(70, Math.floor(window.innerWidth / 20));
  var glyphs = ['0','1'];
  for(var i=0;i<count;i++){
    particles.push({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      vy: 0.15 + Math.random()*0.35,
      vx: (Math.random()-0.5)*0.15,
      size: 9 + Math.random()*8,
      alpha: 0.08 + Math.random()*0.22,
      glyph: glyphs[Math.floor(Math.random()*glyphs.length)],
      hue: Math.random() > 0.5 ? '51,224,255' : '139,107,255'
    });
  }
}
initParticles();
window.addEventListener('resize', initParticles);

function draw(){
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
  for(var i=0;i<particles.length;i++){
    var p = particles[i];
    ctx.font = p.size + 'px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(' + p.hue + ',' + p.alpha + ')';
    ctx.fillText(p.glyph, p.x, p.y);
    if(!reduceMotion){
      p.y -= p.vy;
      p.x += p.vx;
      if(p.y < -20){ p.y = window.innerHeight + 20; p.x = Math.random()*window.innerWidth; }
    }
  }
  requestAnimationFrame(draw);
}
draw();