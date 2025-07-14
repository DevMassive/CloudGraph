import { drawCloudGraph } from './cloudGraph';

describe('drawCloudGraph', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;
  let mockLinearGradient: CanvasGradient;

  beforeEach(() => {
    mockCanvas = document.createElement('canvas');
    mockContext = mockCanvas.getContext('2d')!;

    Object.defineProperty(mockCanvas, 'width', { value: 240 });
    Object.defineProperty(mockCanvas, 'height', { value: 240 });

    mockLinearGradient = {
      addColorStop: jest.fn(),
    } as unknown as CanvasGradient;

    jest.spyOn(mockContext, 'createLinearGradient').mockReturnValue(mockLinearGradient);
    jest.spyOn(mockContext, 'fillRect');
    jest.spyOn(mockContext, 'drawImage');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should draw a cloud graph on the canvas', () => {
    const values = [10, 20, 15, 25, 30];
    const options = {};

    drawCloudGraph(mockCanvas, values, options);

    expect(mockContext.createLinearGradient).toHaveBeenCalled();
    expect(mockLinearGradient.addColorStop).toHaveBeenCalledTimes(2);
    expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, mockCanvas.width, mockCanvas.height);

    expect(mockContext.drawImage).toHaveBeenCalled();
  });

  it('should handle empty values array', () => {
    const values: number[] = [];
    const options = {};

    drawCloudGraph(mockCanvas, values, options);

    expect(mockContext.fillRect).toHaveBeenCalled();
    expect(mockContext.drawImage).not.toHaveBeenCalled();
  });

  it('should use custom options', () => {
    const values = [10, 20, 15];
    const customOptions = {
      width: 300,
      height: 300,
      backgroundColor: '#FF0000',
      cloudColor: '#00FF00',
      blurStrong: 10,
      blurWeak: 5,
      noiseScale: 0.1,
    };

    drawCloudGraph(mockCanvas, values, customOptions);

    expect(mockContext.createLinearGradient).not.toHaveBeenCalled();
    expect(mockContext.fillStyle).toBe('#ff0000'); // 小文字に修正
    expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, mockCanvas.width, mockCanvas.height);

    expect(mockContext.drawImage).toHaveBeenCalled();
  });
});
