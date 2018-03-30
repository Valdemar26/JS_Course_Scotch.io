window.addEventListener('load', function() {
    const body = document.body;
    const input = document.querySelector('input[type=text]');
    const overlay = document.querySelector('.overlay');
    const message = document.querySelector('.message');

    /**
     * credentials from opengraph.io
     */
    const apiUrl = 'https://opengraph.io/api/1.0/site';
    const appId = '5abe0a670e40872a0745c088';

    function showFloater() {
        body.classList.add('show-floater');
    }

    function closeFloater() {
        if(body.classList.contains('show-floater')) {
            body.classList.remove('show-floater');
        }
    }

    input.addEventListener('focusin', showFloater);
    // input.addEventListener('focusout', closeFloater);
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
        if(!bookmarkInput.value) {
            message.classList.add('visible');
            return false;
        }

        const myUrl = encodeURIComponent(bookmarkInput.value);

        fetch(`${apiUrl}/${myUrl}?app_id=${appId}`)
            .then(response => response.json())
            .then(data => {
                // const description = data.hybridGraph.description;
                console.log(data.hybridGraph);

                // add a new bookmarks and save that bookmarks list to localStorage
                const title = bookmarkInput.value;

                const bookmark = {
                    title: data.hybridGraph.title,
                    image: data.hybridGraph.image,
                    link: data.hybridGraph.url
                };

                bookmarks.push(bookmark);
                fillBookmarksList(bookmarks);
                storeBookmarks(bookmarks);
                bookmarkForm.reset(); // reset the form

            })
            .catch(error => {
                console.log('There is a problem to getting info!');
            })

    }

    function fillBookmarksList(bookmarks = []) {
        const bookmarksHtml = bookmarks.map((bookmark, i) => {
            return `
                <a href="${bookmark.link}" target="_blank" class="bookmark" data-id="${i}">
                    <div class="img" style="background-image: url('${bookmark.image}')"></div>
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