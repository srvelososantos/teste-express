document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  if (!bookId) return;

  const res = await fetch(`/api/books/${bookId}`);
  const book = await res.json();

  document.getElementById('coverImg').src = `/img/${book.cover}`;
  document.getElementById('audioPlayer').src = `/audio/${book.chapters[0].file}`;

  const chaptersList = document.getElementById('chaptersList');
  book.chapters.forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.textContent = `Capítulo ${i + 1}`;
    btn.onclick = () => {
      document.getElementById('audioPlayer').src = `/audio/${ch.file}`;
      document.getElementById('audioPlayer').play();
    };
    chaptersList.appendChild(btn);
  });

  document.getElementById('bookText').innerText = book.textContent || 'Texto do livro indisponível.';
});

function toggleView() {
  const bookView = document.getElementById('bookView');
  const textView = document.getElementById('textView');
  const isBookViewVisible = bookView.style.display !== 'none';

  bookView.style.display = isBookViewVisible ? 'none' : 'flex';
  textView.style.display = isBookViewVisible ? 'flex' : 'none';
}