/**
 * Configuration options for drawing the cloud graph.
 */
export interface CloudGraphOptions {
    width?: number;
    height?: number;
    backgroundColor?: string | string[];
    cloudColor?: string;
    blurStrong?: number;
    blurWeak?: number;
    noiseScale?: number;
}
/**
 * Draws a cloud graph on the given canvas with the provided data values.
 * @param {HTMLCanvasElement} canvas - The target canvas element to draw on.
 * @param {number[]} values - An array of numerical data points.
 * @param {CloudGraphOptions} [options={}] - Optional configuration for the graph.
 */
export declare function drawCloudGraph(canvas: HTMLCanvasElement, values: number[], options?: CloudGraphOptions): void;
