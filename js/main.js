const toast = document.getElementById('toast');

function notify(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// Theme settings
try {
  if (localStorage.getItem('predia-theme') === 'dark') {
    document.body.classList.add('dark');
  }
} catch (error) {}

document.getElementById('themeToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  try {
    localStorage.setItem(
      'predia-theme',
      document.body.classList.contains('dark') ? 'dark' : 'light'
    );
  } catch (error) {}
});

// Mobile menu
document.getElementById('menuButton')?.addEventListener('click', () => {
  document.getElementById('mainNav').classList.toggle('open');
});

// Notice buttons
document.querySelectorAll('[data-notice]').forEach(button => {
  button.onclick = () => notify(button.dataset.notice);
});

// Available tools
const allTools = [
  ["pdf-to-word", "PDF to Word", "document", "Convert PDF documents to editable Word files."],
  ["word-to-pdf", "Word to PDF", "document", "Convert Word documents to PDF."],
  ["compress-pdf", "Compress PDF", "pdf", "Reduce PDF file size."],
  ["merge-pdf", "Merge PDF", "pdf", "Combine multiple PDF documents."],
  ["split-pdf", "Split PDF", "pdf", "Extract pages from a PDF."],
  ["jpg-to-pdf", "JPG to PDF", "image", "Turn images into a PDF."],
  ["image-compressor", "Image Compressor", "image", "Compress images in your browser."],
  ["image-resizer", "Image Resizer", "image", "Resize images to a chosen size."],
  ["png-to-jpg", "PNG to JPG", "image", "Convert PNG images to JPG."],
  ["rotate-pdf", "Rotate PDF", "pdf", "Rotate PDF pages."],
  ["add-watermark", "Add Watermark", "pdf", "Add a text watermark to PDF pages."],
  ["remove-pdf-pages", "Remove PDF Pages", "pdf", "Remove selected PDF pages."],
  ["word-counter", "Word Counter", "text", "Count words, characters and lines."],
  ["text-to-speech", "Text to Speech", "text", "Read text aloud using browser speech."]
];

// Tool listing and filters
const grid = document.getElementById('toolGrid');

if (grid) {
  function renderTools(query = '', category = 'all') {
    grid.innerHTML = '';

    let shown = 0;

    allTools
      .filter(tool =>
        (category === 'all' || tool[2] === category) &&
        (tool[1] + ' ' + tool[3]).toLowerCase().includes(query.toLowerCase())
      )
      .forEach(tool => {
        shown++;

        const link = document.createElement('a');
        link.className = 'tile';
        link.href = 'tools/' + tool[0] + '.html';

        const title = document.createElement('b');
        title.textContent = tool[1];

        const description = document.createElement('p');
        description.textContent = tool[3];

        link.append(title, description);
        grid.append(link);
      });

    document.getElementById('empty').hidden = shown > 0;
  }

  renderTools();

  document.getElementById('toolSearch').oninput = event => {
    const activeCategory =
      document.querySelector('.filters .active')?.dataset.filter || 'all';

    renderTools(event.target.value, activeCategory);
  };

  document.querySelectorAll('[data-filter]').forEach(button => {
    button.onclick = () => {
      document.querySelectorAll('[data-filter]').forEach(item => {
        item.classList.remove('active');
      });

      button.classList.add('active');

      renderTools(
        document.getElementById('toolSearch').value,
        button.dataset.filter
      );
    };
  });

  document.querySelector('[data-filter="all"]')?.classList.add('active');
}

// Home search
document.getElementById('homeSearch')?.addEventListener('submit', event => {
  event.preventDefault();

  location.href =
    'all-tools.html?q=' +
    encodeURIComponent(document.getElementById('toolSearch').value);
});

// Search query from URL
if (grid) {
  const query = new URLSearchParams(location.search).get('q') || '';

  document.getElementById('toolSearch').value = query;

  if (query) {
    document.getElementById('toolSearch').dispatchEvent(
      new Event('input')
    );
  }
}

// Login form
document.getElementById('loginForm')?.addEventListener('submit', event => {
  event.preventDefault();
  notify('Authentication is not connected yet.');
});

// Registration form
document.getElementById('registerForm')?.addEventListener('submit', event => {
  event.preventDefault();

  if (
    document.getElementById('pass1').value !==
    document.getElementById('pass2').value
  ) {
    notify('Passwords do not match.');
    return;
  }

  notify('Registration UI validated; account service is not connected.');
});

// Forgot password
document.getElementById('forgotForm')?.addEventListener('submit', event => {
  event.preventDefault();
  notify('Password reset is not connected.');
});

// Contact form
document.getElementById('contactForm')?.addEventListener('submit', event => {
  event.preventDefault();
  notify('Message delivery is not connected.');
});

// PDF preview
const pdfFile = document.getElementById('pdfFile');

pdfFile?.addEventListener('change', () => {
  const file = pdfFile.files[0];

  if (file) {
    const frame = document.getElementById('pdfFrame');

    frame.src = URL.createObjectURL(file);
    frame.hidden = false;

    document.getElementById('pdfName').textContent = file.name;
  }
});
