document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  if (!bookId) return;

  const res = await fetch(`/api/books/${bookId}`);
  const book = await res.json();

  console.log(book)

  document.getElementById('book-title').innerHTML = book.title

  document.getElementById('bookText').innerText = book.textContent || 'Texto do livro indisponível.';
});

function toggleView() {
  const bookView = document.getElementById('bookView');
  const textView = document.getElementById('textView');
  const isBookViewVisible = bookView.style.display !== 'none';

  bookView.style.display = isBookViewVisible ? 'none' : 'flex';
  textView.style.display = isBookViewVisible ? 'flex' : 'none';
}

document.getElementById("gohome").addEventListener('click', () => {
  window.location.href = "/home"
})

