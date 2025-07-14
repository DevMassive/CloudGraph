# Cloud Graph

A JavaScript library and web application to visualize numerical data as an artistic cloud graph.

## Live Demo

Check out the live demo hosted on GitHub Pages:
[https://devmassive.github.io/CloudGraph/](https://devmassive.github.io/CloudGraph/)

This live demo uses `index.html` and `src/main.js` to showcase the library's functionality in a web browser environment.

## Features

*   Visualizes numerical data as a unique cloud-like graph.
*   Exports the generated graph as a PNG image (available in the web demo).
*   Designed to be easily integrated into modern JavaScript applications, including React, with TypeScript support.

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

Here's how you can use the `drawCloudGraph` function within a React component after installing the package:

```tsx
import React, { useRef, useEffect } from 'react';
import { drawCloudGraph } from '@devmassive/cloud-graph'; // Import from the installed package

interface CloudGraphComponentProps {
  data: number[];
}

function CloudGraphComponent({ data }: CloudGraphComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawCloudGraph(canvasRef.current, data);
    }
  }, [data]); // Re-draw when data changes

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }}></canvas>
  );
}

export default CloudGraphComponent;
```

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
4.  Open `index.html` in your web browser.

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