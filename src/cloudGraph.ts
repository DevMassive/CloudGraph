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
 * Configuration options for drawing the cloud graph.
 */
export interface CloudGraphOptions {
    width?: number;
    height?: number;
    backgroundColor?: string;
    cloudColor?: string;
    blurStrong?: number;
    blurWeak?: number;
    noiseScale?: number;
}

type Point = { x: number; y: number };

function createInMemoryCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    return [canvas, ctx];
}

function calculatePoints(values: number[], size: number): Point[] {
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const valRange = maxVal - minVal;
    const totalPoints = values.length;
    const stepX = size / (totalPoints - 1);

    const maxCloudElementHeight = 40 + 4;
    const topPadding = maxCloudElementHeight + 5;
    const bottomPadding = 5;
    const effectiveGraphHeight = size - topPadding - bottomPadding;

    return values.map((v, i) => {
        const x = i * stepX;
        const normalizedY = valRange > 0 ? (v - minVal) / valRange : 0.5;
        const y = size - bottomPadding - normalizedY * effectiveGraphHeight;
        return { x, y };
    });
}

function drawBaseCloudShape(context: CanvasRenderingContext2D, points: Point[], color: string, size: number) {
    context.fillStyle = color;
    const stepX = size / (points.length - 1);
    points.forEach((p) => {
        for (let i = 0; i < 20; i++) {
            const offsetX = (Math.random() - 0.5) * stepX * 1.5;
            const randomY = p.y + Math.random() * (size - p.y);
            const progress = (randomY - p.y) / (size - p.y);
            const radius = 6 + progress * 28 + Math.random() * 6;
            context.beginPath();
            context.arc(p.x + offsetX, randomY, radius, 0, Math.PI * 2);
            context.fill();
        }
    });
}

function createBlurredLayer(points: Point[], size: number, blurValue: number, color: string): ImageData {
    const [canvas, ctx] = createInMemoryCanvas(size);
    ctx.filter = `blur(${blurValue}px)`;
    drawBaseCloudShape(ctx, points, color, size);
    return ctx.getImageData(0, 0, size, size);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

function combineLayersWithNoise(
    strongData: ImageData,
    weakData: ImageData,
    size: number,
    noiseScale: number,
    color: string
): HTMLCanvasElement {
    const [canvas, ctx] = createInMemoryCanvas(size);
    const finalImageData = ctx.createImageData(size, size);
    const noiseMap = generateNoiseMap(size, size, noiseScale);
    const rgbColor = hexToRgb(color);

    if (!rgbColor) {
        console.error("Invalid cloudColor format. Please use a valid hex color string (e.g., '#FFFFFF').");
        return canvas;
    }

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            const noiseVal = noiseMap[y][x];
            const finalAlpha = (1 - noiseVal) * strongData.data[idx + 3] + noiseVal * weakData.data[idx + 3];
            finalImageData.data[idx] = rgbColor.r;
            finalImageData.data[idx + 1] = rgbColor.g;
            finalImageData.data[idx + 2] = rgbColor.b;
            finalImageData.data[idx + 3] = finalAlpha;
        }
    }
    ctx.putImageData(finalImageData, 0, 0);
    return canvas;
}


/**
 * Draws a cloud graph on the given canvas with the provided data values.
 * @param {HTMLCanvasElement} canvas - The target canvas element to draw on.
 * @param {number[]} values - An array of numerical data points.
 * @param {CloudGraphOptions} [options={}] - Optional configuration for the graph.
 */
export function drawCloudGraph(canvas: HTMLCanvasElement, values: number[], options: CloudGraphOptions = {}): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Could not get 2D rendering context for canvas.");
        return;
    }

    const config = {
        width: 240,
        height: 240,
        backgroundColor: "#B0E0E6",
        cloudColor: "white",
        blurStrong: 4,
        blurWeak: 2,
        noiseScale: 0.08,
        ...options,
    };

    // Set background color
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!values || values.length < 2) {
        return;
    }

    const internalSize = Math.min(config.width, config.height);

    const points = calculatePoints(values, internalSize);

    const strongBlurLayer = createBlurredLayer(points, internalSize, config.blurStrong, config.cloudColor);
    const weakBlurLayer = createBlurredLayer(points, internalSize, config.blurWeak, config.cloudColor);

    const finalCloudCanvas = combineLayersWithNoise(
        strongBlurLayer,
        weakBlurLayer,
        internalSize,
        config.noiseScale,
        config.cloudColor
    );

    ctx.drawImage(finalCloudCanvas, 0, 0, canvas.width, canvas.height);
}