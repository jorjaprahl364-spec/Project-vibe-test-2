// js/components/particle-bg.js
// Эффект падающих золотых частиц (потоков матрицы) на Canvas.
// Размер файла контролируется (до 150 строк).

export function initParticleBg(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 60;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      speed: Math.random() * 2 + 1,
      length: Math.random() * 60 + 20,
      opacity: Math.random() * 0.6 + 0.2,
      size: Math.random() * 1.5 + 0.5
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Рисуем светящуюся точку (падающую частицу)
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      ctx.fillStyle = `rgba(251, 191, 36, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Рисуем вертикальный шлейф (светящийся хвост)
      ctx.shadowBlur = 0;
      const gradient = ctx.createLinearGradient(p.x, p.y, p.x, p.y - p.length);
      gradient.addColorStop(0, `rgba(212, 175, 55, ${p.opacity * 0.4})`);
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y - p.length);
      ctx.stroke();

      // Смещение вниз
      p.y += p.speed;

      // Если частица упала — возвращаем её наверх
      if (p.y > height + 60) {
        p.x = Math.random() * width;
        p.y = -p.length;
        p.speed = Math.random() * 2 + 1;
        p.opacity = Math.random() * 0.6 + 0.2;
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}
