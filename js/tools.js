const form = document.getElementById('toolForm');

if (form) {
  const input = document.getElementById('fileInput');
  const message = document.getElementById('toolMessage');
  const download = document.getElementById('download');
  const fileName = document.getElementById('fileName');

  // Display selected files
  input?.addEventListener('change', () => {
    fileName.textContent =
      [...input.files].map(file => file.name).join(', ') ||
      'No file selected';
  });

  // Word counter
  const textInput = document.getElementById('textInput');

  textInput?.addEventListener('input', () => {
    const value = textInput.value.trim();

    const words = value ? value.split(/\s+/).length : 0;
    const characters = textInput.value.length;

    document.getElementById('countOutput').textContent =
      words + ' words · ' + characters + ' characters';
  });

  // Text to speech
  document.getElementById('speak')?.addEventListener('click', () => {
    const value = document.getElementById('speechInput').value;

    if (!value.trim()) {
      message.textContent = 'Enter text first.';
      return;
    }

    speechSynthesis.speak(
      new SpeechSynthesisUtterance(value)
    );
  });

  document.getElementById('stop')?.addEventListener('click', () => {
    speechSynthesis.cancel();
  });

  // Process files
  form.addEventListener('submit', async event => {
    event.preventDefault();

    download.hidden = true;

    const tool = form.dataset.tool;

    if (tool === 'word-counter' || tool === 'text-to-speech') {
      message.textContent = 'Use the text controls above.';
      return;
    }

    const file = input.files[0];

    if (!file) {
      message.textContent = 'Please select a file.';
      return;
    }

    try {
      const imageTools = [
        'image-compressor',
        'image-resizer',
        'png-to-jpg'
      ];

      if (imageTools.includes(tool)) {
        if (!file.type.startsWith('image/')) {
          throw new Error('Choose an image file.');
        }

        const image = await createImageBitmap(file);
        const canvas = document.createElement('canvas');

        let width = image.width;
        let height = image.height;

        if (tool === 'image-resizer') {
          width = Number(document.getElementById('width').value) || width;
          height = Number(document.getElementById('height').value) || height;
        }

        if (tool === 'image-compressor' && width > 1600) {
          height = Math.round(height * 1600 / width);
          width = 1600;
        }

        canvas.width = width;
        canvas.height = height;

        canvas.getContext('2d').drawImage(
          image,
          0,
          0,
          width,
          height
        );

        const mime =
          tool === 'png-to-jpg'
            ? 'image/jpeg'
            : file.type === 'image/png'
              ? 'image/png'
              : 'image/jpeg';

        const blob = await new Promise(resolve => {
          canvas.toBlob(resolve, mime, 0.82);
        });

        if (!blob) {
          throw new Error('Image processing failed.');
        }

        download.href = URL.createObjectURL(blob);

        download.download =
          'predia-output.' +
          (mime === 'image/png' ? 'png' : 'jpg');

        download.hidden = false;

        message.textContent =
          'Done. Download your processed image below.';

      } else {
        message.textContent =
          'This operation needs a PDF/document processing engine or backend. ' +
          'The upload UI is ready, but processing is not implemented in this starter.';
      }

    } catch (error) {
      message.textContent =
        error.message || 'Processing failed.';
    }
  });
}
