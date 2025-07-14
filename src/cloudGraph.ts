/**
 * 2D Perlin Noise functions.
 */
function noiseHash2D(x: number, y: number): number {
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return s - Math.floor(s);
}

function perlinNoise2D(x: number, y: number): number {
    function lerp(a: number, b: number, t: number): number { return a + t * (b - a); }
    const intX = Math.floor(x), fracX = x - intX;
    const intY = Math.floor(y), fracY = y - intY;
    const v1 = noiseHash2D(intX, intY), v2 = noiseHash2D(intX + 1, intY);
    const v3 = noiseHash2D(intX, intY + 1), v4 = noiseHash2D(intX + 1, intY + 1);
    const i1 = lerp(v1, v2, fracX), i2 = lerp(v3, v4, fracX);
    return lerp(i1, i2, fracY);
}

function generateNoiseMap(width: number, height: number, scale: number = 0.01): number[][] {
    const map: number[][] = [];
    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = perlinNoise2D(x * scale, y * scale);
        }
    }
    return map;
}

/**
 * Draws a cloud graph on the given canvas with the provided data values.
 * Internally, it renders at a fixed resolution (240px) and then scales to the target canvas size.
 * @param {HTMLCanvasElement} canvas - The target canvas element to draw on.
 * @param {number[]} values - An array of numerical data points.
 */
export function drawCloudGraph(canvas: HTMLCanvasElement, values: number[]): void {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Could not get 2D rendering context for canvas.");
        return;
    }

    // 内部描画解像度を固定
    const internalSize = 240;

    // 内部描画用のCanvasを作成
    const internalCanvas = document.createElement("canvas");
    internalCanvas.width = internalSize;
    internalCanvas.height = internalSize;
    const internalCtx = internalCanvas.getContext("2d");

    if (!internalCtx) {
        console.error("Could not get 2D rendering context for internalCanvas.");
        return;
    }

    // Canvasの背景にグラデーションを描画 (内部Canvasに)
    const bgGrad = internalCtx.createLinearGradient(0, 0, 0, internalCanvas.height);
    bgGrad.addColorStop(0, "#B0E0E6");
    bgGrad.addColorStop(1, "#B0E0E6");
    internalCtx.fillStyle = bgGrad;
    internalCtx.fillRect(0, 0, internalCanvas.width, internalCanvas.height);

    if (!values || values.length < 2) {
        internalCtx.clearRect(0, 0, internalCanvas.width, internalCanvas.height);
        ctx.drawImage(internalCanvas, 0, 0, canvas.width, canvas.height); // クリアした内容を最終Canvasに描画
        return;
    }

    const minVal = Math.min(...values), maxVal = Math.max(...values);
    const valRange = maxVal - minVal;
    const totalPoints = values.length;
    const graphWidth = internalCanvas.width, graphHeight = internalCanvas.height, baseY = internalCanvas.height;
    const stepX = graphWidth / (totalPoints - 1);

    // 描画パラメータを内部解像度に合わせて調整
    const maxCloudElementHeight = 40 + 18; // 240px基準での値
    const topPadding = maxCloudElementHeight + 5;
    const bottomPadding = 5;

    const effectiveGraphHeight = internalCanvas.height - topPadding - bottomPadding;

    const points = values.map((v, i) => {
        const x = i * stepX;
        const normalizedY = valRange > 0 ? (v - minVal) / valRange : 0.5;
        const y = baseY - bottomPadding - normalizedY * effectiveGraphHeight;
        return { x, y };
    });

    const blurStrongCanvas = document.createElement("canvas");
    blurStrongCanvas.width = internalSize;
    blurStrongCanvas.height = internalSize;
    const blurStrongCtx = blurStrongCanvas.getContext("2d");

    if (!blurStrongCtx) {
        console.error("Could not get 2D rendering context for blurStrongCanvas.");
        return;
    }

    const blurWeakCanvas = document.createElement("canvas");
    blurWeakCanvas.width = internalSize;
    blurWeakCanvas.height = internalSize;
    const blurWeakCtx = blurWeakCanvas.getContext("2d");

    if (!blurWeakCtx) {
        console.error("Could not get 2D rendering context for blurWeakCanvas.");
        return;
    }

    function drawCloudShape(context: CanvasRenderingContext2D) {
        context.fillStyle = "white";
        points.forEach(p => {
            for (let i = 0; i < 20; i++) {
                const offsetX = (Math.random() - 0.5) * stepX * 1.5;
                const randomY = p.y + Math.random() * (baseY - p.y);
                const progress = (randomY - p.y) / (baseY - p.y);
                const radius = 6 + progress * 28 + Math.random() * 6; // 240px基準での調整
                context.beginPath();
                context.arc(p.x + offsetX, randomY, radius, 0, Math.PI * 2);
                context.fill();
            }
        });
    }

    const blurStrong = 18; // 240px基準での値
    const blurWeak = 9; // 240px基準での値
    blurStrongCtx.filter = `blur(${blurStrong}px)`;
    drawCloudShape(blurStrongCtx);

    blurWeakCtx.filter = `blur(${blurWeak}px)`;
    drawCloudShape(blurWeakCtx);

    const noiseMap = generateNoiseMap(internalSize, internalSize, 0.014); // 240px基準での調整
    const strongData = blurStrongCtx.getImageData(0, 0, internalSize, internalSize).data;
    const weakData = blurWeakCtx.getImageData(0, 0, internalSize, internalSize).data;

    const finalCloudCanvas = document.createElement('canvas');
    finalCloudCanvas.width = internalSize;
    finalCloudCanvas.height = internalSize;
    const finalCloudCtx = finalCloudCanvas.getContext('2d');

    if (!finalCloudCtx) {
        console.error("Could not get 2D rendering context for finalCloudCanvas.");
        return;
    }

    const finalCloudData = finalCloudCtx.createImageData(internalSize, internalSize);

    for (let y = 0; y < internalSize; y++) {
        for (let x = 0; x < internalSize; x++) {
            const idx = (y * internalSize + x) * 4;
            const noiseVal = noiseMap[y][x];
            const finalAlpha = (1 - noiseVal) * strongData[idx + 3] + noiseVal * weakData[idx + 3];
            finalCloudData.data[idx] = 255;
            finalCloudData.data[idx + 1] = 255;
            finalCloudData.data[idx + 2] = 255;
            finalCloudData.data[idx + 3] = finalAlpha;
        }
    }
    finalCloudCtx.putImageData(finalCloudData, 0, 0);

    // 最終的なCanvasに内部描画結果を拡大・縮小して描画
    ctx.drawImage(finalCloudCanvas, 0, 0, canvas.width, canvas.height);
}