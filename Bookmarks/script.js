window.addEventListener('load', function() {
    const body = document.body;
    const input = document.querySelector('input[type=text]');
    const overlay = document.querySelector('.overlay');
    const message = document.querySelector('.message');

    function showFloater() {
        body.classList.add('show-floater');
    }

    function closeFloater() {
        if(body.classList.contains('show-floater')) {
            body.classList.remove('show-floater');
        }
    }

    input.addEventListener('focusin', showFloater);
    input.addEventListener('focusout', closeFloater);
    overlay.addEventListener('click', closeFloater);

    /**
     * bookmarks list
     */
    const bookmarksList = document.querySelector('.bookmarks-list');
    const bookmarkForm = document.querySelector('.bookmark-form');
    const bookmarkInput = bookmarkForm.querySelector('input[type=text]');
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    fillBookmarksList(bookmarks);

    function createBookmark(e) {
        e.preventDefault(); // stop reloading the page after create bookmark

        // prevent adding empty bookmarks
        if(bookmarkInput.value.length === 0) {
            message.classList.add('visible');
            return false;
        }

        // add a new bookmarks and save that bookmarks list to localStorage
        const title = bookmarkInput.value;
        const bookmark = {
            title: title
        };

        bookmarks.push(bookmark);
        fillBookmarksList(bookmarks);
        storeBookmarks(bookmarks);
        bookmarkForm.reset(); // reset the form
    }

    function fillBookmarksList(bookmarks = []) {
        const bookmarksHtml = bookmarks.map((bookmark, i) => {
            return `
                <a href="#" class="bookmark" data-id="${i}">
                    <div class="img"></div>
                    <div class="title">${bookmark.title}</div>
                    <span class="glyphicon glyphicon-remove"></span>
                </a>
            `
        }).join('');

        bookmarksList.innerHTML = bookmarksHtml;

    }

    function removeBookmark(e) {
        if(!e.target.matches('.glyphicon-remove')) return;

        const index = e.target.parentNode.dataset.id;
        bookmarks.splice(index, 1);
        fillBookmarksList(bookmarks);
        storeBookmarks(bookmarks);
    }

    function storeBookmarks(bookmarks = []) {
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    bookmarkForm.addEventListener('submit', createBookmark);
    bookmarksList.addEventListener('click', removeBookmark);
});