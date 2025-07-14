/**
 * 2D Perlin Noise functions.
 */
function noiseHash2D(x: number, y: number): number {
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return s - Math.floor(s);
}

function perlinNoise2D(x: number, y: number): number {
    function lerp(a: number, b: number, t: number): number {
        return a + t * (b - a);
    }
    const intX = Math.floor(x),
        fracX = x - intX;
    const intY = Math.floor(y),
        fracY = y - intY;
    const v1 = noiseHash2D(intX, intY),
        v2 = noiseHash2D(intX + 1, intY);
    const v3 = noiseHash2D(intX, intY + 1),
        v4 = noiseHash2D(intX + 1, intY + 1);
    const i1 = lerp(v1, v2, fracX),
        i2 = lerp(v3, v4, fracX);
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
 * The drawing parameters are scaled based on the canvas's current size.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
 * @param {number[]} values - An array of numerical data points.
 */
export function drawCloudGraph(canvas: HTMLCanvasElement, values: number[]): void {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Could not get 2D rendering context for canvas.");
        return;
    }

    // Canvasのサイズは呼び出し元で設定されることを想定
    const currentCanvasSize = canvas.width; // widthとheightは同じと仮定
    const baseSize = 420; // 元の基準サイズ
    const scaleFactor = currentCanvasSize / baseSize;

    // Canvasの背景にグラデーションを描画
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, "#B0E0E6"); // bodyの背景色と合わせる
    bgGrad.addColorStop(1, "#B0E0E6"); // 下部も同じ空の色に
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!values || values.length < 2) {
        // データが不足している場合はCanvasをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const minVal = Math.min(...values),
        maxVal = Math.max(...values);
    const valRange = maxVal - minVal;
    const totalPoints = values.length;
    const graphWidth = canvas.width,
        graphHeight = canvas.height,
        baseY = canvas.height;
    const stepX = graphWidth / (totalPoints - 1);

    // 雲の最大半径と最大ぼかし範囲を考慮した上部パディング
    const baseMaxCloudElementHeight = 70 + 8; // 元の基準サイズでの値
    const baseTopPadding = baseMaxCloudElementHeight + 10; // 元の基準サイズでの値
    const baseBottomPadding = 10; // 元の基準サイズでの値

    const maxCloudElementHeight = baseMaxCloudElementHeight * scaleFactor;
    const topPadding = baseTopPadding * scaleFactor;
    const bottomPadding = baseBottomPadding * scaleFactor;

    // データを描画する有効な高さ
    const effectiveGraphHeight = canvas.height - topPadding - bottomPadding;

    const points = values.map((v, i) => {
        const x = i * stepX;
        const normalizedY = valRange > 0 ? (v - minVal) / valRange : 0.5;
        // データを有効な高さにマッピングし、下部パディングを考慮してY座標を計算
        const y = baseY - bottomPadding - normalizedY * effectiveGraphHeight;
        return { x, y };
    });

    const blurStrongCanvas = document.createElement("canvas");
    blurStrongCanvas.width = canvas.width;
    blurStrongCanvas.height = canvas.height;
    const blurStrongCtx = blurStrongCanvas.getContext("2d");

    if (!blurStrongCtx) {
        console.error("Could not get 2D rendering context for blurStrongCanvas.");
        return;
    }

    const blurWeakCanvas = document.createElement("canvas");
    blurWeakCanvas.width = canvas.width;
    blurWeakCanvas.height = canvas.height;
    const blurWeakCtx = blurWeakCanvas.getContext("2d");

    if (!blurWeakCtx) {
        console.error("Could not get 2D rendering context for blurWeakCanvas.");
        return;
    }

    function drawCloudShape(context: CanvasRenderingContext2D) {
        context.fillStyle = "white";
        points.forEach((p) => {
            for (let i = 0; i < 20; i++) {
                const offsetX = (Math.random() - 0.5) * stepX * 1.5;
                const randomY = p.y + Math.random() * (baseY - p.y);
                const progress = (randomY - p.y) / (baseY - p.y);
                const baseRadius = 10 + progress * 50 + Math.random() * 10; // 元の基準サイズでの値
                const radius = baseRadius * scaleFactor;
                context.beginPath();
                context.arc(p.x + offsetX, randomY, radius, 0, Math.PI * 2);
                context.fill();
            }
        });
    }

    const baseBlurStrong = 8; // 元の基準サイズでの値
    const baseBlurWeak = 4; // 元の基準サイズでの値
    blurStrongCtx.filter = `blur(${baseBlurStrong * scaleFactor}px)`;
    drawCloudShape(blurStrongCtx);

    blurWeakCtx.filter = `blur(${baseBlurWeak * scaleFactor}px)`;
    drawCloudShape(blurWeakCtx);

    const baseNoiseScale = 0.08; // 元の基準サイズでの値
    const noiseMap = generateNoiseMap(canvas.width, canvas.height, baseNoiseScale / scaleFactor); // 逆比率で調整
    const strongData = blurStrongCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    const weakData = blurWeakCtx.getImageData(0, 0, canvas.width, canvas.height).data;

    const finalCloudCanvas = document.createElement("canvas");
    finalCloudCanvas.width = canvas.width;
    finalCloudCanvas.height = canvas.height;
    const finalCloudCtx = finalCloudCanvas.getContext("2d");

    if (!finalCloudCtx) {
        console.error("Could not get 2D rendering context for finalCloudCanvas.");
        return;
    }

    const finalCloudData = finalCloudCtx.createImageData(canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const noiseVal = noiseMap[y][x];
            const finalAlpha = (1 - noiseVal) * strongData[idx + 3] + noiseVal * weakData[idx + 3];
            finalCloudData.data[idx] = 255;
            finalCloudData.data[idx + 1] = 255;
            finalCloudData.data[idx + 2] = 255;
            finalCloudData.data[idx + 3] = finalAlpha;
        }
    }
    finalCloudCtx.putImageData(finalCloudData, 0, 0);
    ctx.drawImage(finalCloudCanvas, 0, 0);
}
