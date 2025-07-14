import { drawCloudGraph } from '../dist/cloudGraph.js';

function renderGraph() {
    const canvas = document.getElementById("cloudCanvas");
    const dataInput = document.getElementById("dataInput");
    if (!canvas || !dataInput) {
        console.error("Canvas or data input element not found.");
        return;
    }
    const values = dataInput.value.split(",").map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    drawCloudGraph(canvas, values);
}

// 画像保存処理
const saveButton = document.getElementById('saveButton');
if (saveButton) {
    saveButton.addEventListener('click', () => {
        const canvas = document.getElementById('cloudCanvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'cloud-graph.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
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
