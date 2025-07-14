import { drawCloudGraph } from '../dist/cloudGraph.js';

function updateFavicon(canvas) {
    const faviconCanvas = document.createElement('canvas');
    const faviconCtx = faviconCanvas.getContext('2d');
    if (!faviconCtx) return;

    const size = 32; // ファビコンのサイズ (例: 32x32px)
    faviconCanvas.width = size;
    faviconCanvas.height = size;

    // メインのCanvasの内容をファビコン用Canvasに描画し、縮小
    faviconCtx.drawImage(canvas, 0, 0, size, size);

    const link = document.querySelector('link[rel="icon"]');
    if (link) {
        link.href = faviconCanvas.toDataURL('image/png');
    } else {
        // linkタグがない場合は新しく作成
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.type = 'image/png';
        newLink.href = faviconCanvas.toDataURL('image/png');
        document.head.appendChild(newLink);
    }
}

function renderGraph() {
    const canvas = document.getElementById("cloudCanvas");
    const dataInput = document.getElementById("dataInput");
    if (!canvas || !dataInput) {
        console.error("Canvas or data input element not found.");
        return;
    }
    // 表示用のCanvasサイズを設定
    canvas.width = 240;
    canvas.height = 240;

    const values = dataInput.value.split(",").map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    drawCloudGraph(canvas, values);
    updateFavicon(canvas); // グラフ描画後にファビコンを更新
}

// 画像保存処理
const saveButton = document.getElementById('saveButton');
if (saveButton) {
    saveButton.addEventListener('click', () => {
        const canvas = document.getElementById('cloudCanvas'); // 現在表示されているCanvas
        if (!canvas) return;

        // 保存用の新しいCanvasを作成
        const saveCanvas = document.createElement('canvas');
        const saveCtx = saveCanvas.getContext('2d');
        if (!saveCtx) return;

        saveCanvas.width = 480; // 保存したいサイズ
        saveCanvas.height = 480; // 保存したいサイズ

        // 現在表示されているCanvasの内容を新しいCanvasに拡大してコピー
        saveCtx.drawImage(canvas, 0, 0, saveCanvas.width, saveCanvas.height);

        const link = document.createElement('a');
        link.download = 'cloud-graph.png';
        link.href = saveCanvas.toDataURL('image/png');
        link.click();
    });
}

// 入力のたびに再描画（デバウンス処理付き）
let debounceTimer;
const dataInput = document.getElementById('dataInput');
if (dataInput) {
    dataInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(renderGraph, 300);
    });
}

// 初期描画とウィンドウリサイズ時の再描画
window.onload = renderGraph;
window.onresize = renderGraph;
