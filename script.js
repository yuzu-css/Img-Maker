const preview = document.getElementById('preview');
const textInput = document.getElementById('text-input');
const fontSizeInput = document.getElementById('font-size-input');
const textColorPicker = document.getElementById('text-color-picker');
const fontSelect = document.querySelector('.font-select');
const fontSelected = fontSelect.querySelector('.selected');
const fontOptions = fontSelect.querySelectorAll('.option');
const shapeButtons = document.querySelectorAll('.shape-btn');
const downloadBtn = document.querySelector('.download-btn');
const gradientPresets = document.querySelectorAll('.gradient-preset');
const gradientColor1 = document.getElementById('gradient-color-1');
const gradientColor2 = document.getElementById('gradient-color-2');

// Font selector
document.addEventListener('click', (e) => {
    if (!fontSelect.contains(e.target)) {
        fontSelect.classList.remove('active');
    }
});

fontSelect.addEventListener('click', () => {
    fontSelect.classList.toggle('active');
});

fontOptions.forEach(option => {
    option.addEventListener('click', () => {
        const font = option.dataset.font;
        preview.style.fontFamily = font;
        fontSelected.textContent = option.textContent;
        fontSelect.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!fontSelect.contains(e.target)) {
        fontSelect.classList.remove('active');
    }
});

// Text input
textInput.addEventListener('input', () => {
    preview.textContent = textInput.value;
});

// Font size input
fontSizeInput.addEventListener('input', () => {
    preview.style.fontSize = `${fontSizeInput.value}px`;
});

// Text color picker
textColorPicker.addEventListener('input', () => {
    preview.style.color = textColorPicker.value;
});

// Gradient presets
gradientPresets.forEach(preset => {
    preset.addEventListener('click', () => {
        const style = window.getComputedStyle(preset);
        const background = style.background;
        preview.style.background = background;
        
        // Extract colors from gradient and update color pickers
        const matches = background.match(/rgb\(\d+,\s*\d+,\s*\d+\)/g);
        if (matches && matches.length >= 2) {
            const color1 = matches[0];
            const color2 = matches[1];
            
            // Convert RGB to HEX
            const rgb2hex = (rgb) => {
                const values = rgb.match(/\d+/g);
                return '#' + values.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
            };
            
            gradientColor1.value = rgb2hex(color1);
            gradientColor2.value = rgb2hex(color2);
        }
    });
});

// Gradient controls
function updateGradient() {
    preview.style.background = `linear-gradient(45deg, ${gradientColor1.value}, ${gradientColor2.value})`;
}

gradientColor1.addEventListener('input', updateGradient);
gradientColor2.addEventListener('input', updateGradient);

// Shape selection
shapeButtons.forEach(button => {
    button.addEventListener('click', () => {
        shapeButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        preview.classList.toggle('square', button.dataset.shape === 'square');
    });
});

// Download with transparent background for circle shape
downloadBtn.addEventListener('click', async () => {
    try {
        const isCircle = !preview.classList.contains('square');
        const canvas = await html2canvas(preview, { 
            backgroundColor: null,
            onclone: (clonedDoc) => {
                const clonedPreview = clonedDoc.querySelector('#preview');
                if (isCircle) {
                    const style = document.createElement('style');
                    style.textContent = `
                        #preview {
                            -webkit-mask: radial-gradient(circle at center, black 100%, transparent 100%);
                            mask: radial-gradient(circle at center, black 100%, transparent 100%);
                        }
                    `;
                    clonedDoc.head.appendChild(style);
                }
            }
        });

        const link = document.createElement('a');
        link.download = 'profile.png';
        link.href = canvas.toDataURL();
        link.click();
    } catch (error) {
        console.error('Failed to generate image:', error);
        alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
    }
});