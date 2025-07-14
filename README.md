# Cloud Graph

![npm version](https://img.shields.io/npm/v/@devmassive/cloud-graph) ![npm downloads](https://img.shields.io/npm/dm/@devmassive/cloud-graph)

A JavaScript library and web application to visualize numerical data as an artistic cloud graph.

## Live Demo

Check out the live demo hosted on GitHub Pages:
[https://devmassive.github.io/CloudGraph/](https://devmassive.github.io/CloudGraph/)

This live demo uses `index.html` and `src/main.js` to showcase the library's functionality in a web browser environment.

## Features

*   Visualizes numerical data as a unique cloud-like graph.
*   Exports the generated graph as a PNG image (available in the web demo).
*   Designed to be easily integrated into modern JavaScript applications, including React, with TypeScript support.

### Example Graph

![Example Cloud Graph](assets/cloud-graph-example.png)

## Usage as a Node.js Module (for React, etc.)

This library provides a core `drawCloudGraph` function that can be used in your JavaScript/TypeScript projects (e.g., React, Vue, Angular).

### Installation

Once this library is published to npm (or GitHub Packages), you can install it like any other package:

Once this library is published to npm (or GitHub Packages), you can install it like any other package:

```bash
npm install @devmassive/cloud-graph
# or
yarn add @devmassive/cloud-graph
```

### Example in React (with TypeScript)

Here's how you can use the `drawCloudGraph` function within a React component. This example shows a self-contained component that defines its own data and customization options.

```tsx
import React, { useRef, useEffect } from 'react';
import { drawCloudGraph, CloudGraphOptions } from '@devmassive/cloud-graph';

// Sample data and options are defined directly within the component
function CloudGraphComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sampleData = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const customOptions: CloudGraphOptions = {
    backgroundColor: '#2c3e50',
    cloudColor: '#ecf0f1',
    width: 300,
    height: 300,
  };

  useEffect(() => {
    if (canvasRef.current) {
      // Pass the data and options to the drawing function
      drawCloudGraph(canvasRef.current, sampleData, customOptions);
    }
    // Empty dependency array ensures this runs once after the initial render
  }, []);

  return (
    <div>
      <h1>Customized Cloud Graph</h1>
      <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }}></canvas>
    </div>
  );
}

export default CloudGraphComponent;
```

### Customization Options

The `drawCloudGraph` function accepts an optional `options` object to customize the appearance of the graph. The available options are defined in the `CloudGraphOptions` interface:

| Option          | Type     | Default     | Description                                          |
|-----------------|----------|-------------|------------------------------------------------------|
| `width`         | `number` | `240`       | The internal rendering width of the graph.           |
| `height`        | `number` | `240`       | The internal rendering height of the graph.          |
| `backgroundColor` | `string \| string[]` | `["#B0E0E6", "#C5F5FB"]` | The background color(s) of the canvas (hex string or array of hex strings for gradient).     |
| `cloudColor`    | `string` | `"#FFFFFF"` | The color of the cloud graph (hex string).           |
| `blurStrong`    | `number` | `4`         | The strength of the strong blur effect.              |
| `blurWeak`      | `number` | `2`         | The strength of the weak blur effect.                |
| `noiseScale`    | `number` | `0.08`      | The scale of the Perlin noise used for texture.      |

**Note:** The `drawCloudGraph` function expects an `HTMLCanvasElement` and an array of numbers. Ensure your `data` prop provides valid numerical data.

## Local Development

To run the web application locally:

1.  Clone the repository:
    ```bash
    git clone https://github.com/DevMassive/CloudGraph.git
    cd CloudGraph
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the TypeScript files:
    ```bash
    npm run build
    ```
4.  Start the local development server (with live-reloading):
    ```bash
    npm run dev
    ```
    This will open a new browser window/tab with the live preview. Any changes to `index.html`, `src/` (JS/TS), `dist/` (JS/TS), or `assets/` will automatically trigger a browser refresh.

## Publishing to npm

To publish this library to the npm registry:

1.  Make sure you have an npm account and are logged in via `npm login`.
2.  Update the `version` in `package.json` if necessary.
3.  Run the publish command:
    ```bash
    npm publish
    ```

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.