# Cloud Graph

A JavaScript library and web application to visualize numerical data as an artistic cloud graph.

## Live Demo

Check out the live demo hosted on GitHub Pages:
[https://devmassive.github.io/CloudGraph/](https://devmassive.github.io/CloudGraph/)

## Features

*   Visualizes numerical data as a unique cloud-like graph.
*   Exports the generated graph as a PNG image.
*   Designed to be easily integrated into modern JavaScript applications, including React.

## Usage as a Node.js Module (for React, etc.)

This library can be installed and used as a Node.js module in your JavaScript projects (e.g., React, Vue, Angular).

### Installation

Currently, this module is not published to npm. You can use it by cloning the repository or by directly importing the `cloudGraph.js` file in your project.

**Option 1: Clone the repository (for development or direct import)**

```bash
git clone https://github.com/DevMassive/CloudGraph.git
cd CloudGraph
```

Then, you can import `src/cloudGraph.js` directly into your project.

**Option 2: Install via `npm` or `yarn` (if published to npm/GitHub Packages in the future)**

```bash
npm install cloud-graph # Not yet available
# or
yarn add cloud-graph # Not yet available
```

### Example in React

Here's how you can use the `drawCloudGraph` function within a React component:

```jsx
import React, { useRef, useEffect } from 'react';
import { drawCloudGraph } from './path/to/CloudGraph/src/cloudGraph'; // Adjust path as needed

function CloudGraphComponent({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Ensure data is an array of numbers
      const numericData = data.map(Number).filter(n => !isNaN(n));
      drawCloudGraph(canvasRef.current, numericData);
    }
  }, [data]); // Re-draw when data changes

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }}></canvas>
  );
}

export default CloudGraphComponent;
```

**Note:** The `drawCloudGraph` function expects a `HTMLCanvasElement` and an array of numbers. Ensure your `data` prop provides valid numerical data.

## Local Development

To run the web application locally:

1.  Clone the repository:
    ```bash
    git clone https://github.com/DevMassive/CloudGraph.git
    cd CloudGraph
    ```
2.  Open `index.html` in your web browser.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.
