/* eslint-disable no-useless-assignment -- vendored EDT, kept as the original */
/* Signed distance field for the glass logo, off the main thread.
   From zanwei/glass-icon-reveal (MIT, see glassReveal.js). TEX matches the
   texture the shader samples. */
const TEX = 1024
function buildSdf(canvas) {
  const n = TEX * TEX;
  const alpha = canvas;
  const INF = 1e20;
  const outer = new Float64Array(n), inner = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const a = alpha[i * 4 + 3] / 255;
    if (a >= 1) { outer[i] = 0; inner[i] = INF; }
    else if (a <= 0) { outer[i] = INF; inner[i] = 0; }
    else {
      const dd = 0.5 - a;
      outer[i] = dd > 0 ? dd * dd : 0;
      inner[i] = dd < 0 ? dd * dd : 0;
    }
  }
  const f = new Float64Array(TEX), z = new Float64Array(TEX + 1), v = new Uint16Array(TEX);
  edt(outer, f, v, z, INF);
  edt(inner, f, v, z, INF);
  const sdf = new Float32Array(n);
  for (let i = 0; i < n; i++) sdf[i] = (Math.sqrt(outer[i]) - Math.sqrt(inner[i])) / TEX;
  return sdf;
}
function edt(grid, f, v, z, INF) {
  for (let x = 0; x < TEX; x++) edt1d(grid, x, TEX, f, v, z, INF);
  for (let y = 0; y < TEX; y++) edt1d(grid, y * TEX, 1, f, v, z, INF);
}
function edt1d(grid, offset, stride, f, v, z, INF) {
  v[0] = 0; z[0] = -INF; z[1] = INF; f[0] = grid[offset];
  for (let q = 1, k = 0, s = 0; q < TEX; q++) {
    f[q] = grid[offset + q * stride];
    const q2 = q * q;
    do {
      const r = v[k];
      s = (f[q] - f[r] + q2 - r * r) / (q - r) / 2;
    } while (s <= z[k] && --k > -1);
    k++; v[k] = q; z[k] = s; z[k + 1] = INF;
  }
  for (let q = 0, k = 0; q < TEX; q++) {
    while (z[k + 1] < q) k++;
    const r = v[k], qr = q - r;
    grid[offset + q * stride] = f[r] + qr * qr;
  }
}


self.onmessage = (e) => {
  const sdf = buildSdf(e.data)
  self.postMessage(sdf, [sdf.buffer])
}
