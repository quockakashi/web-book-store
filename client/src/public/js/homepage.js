$(document).ready(async() => {
    await loadCategories();
    $('.category-btn').on('click', () => {
        $('.category-menu').toggleClass('hide')
    })
    await loadBook($('.new-book-container'), 'new-books');
    await loadBook($('.top-rating-container'), 'top-rating');
    await loadBook($('.best-seller-container'), 'best-seller');
    await loadBook($('.for-kid-container'), 'for-kids');
    $('.card').each((index, card) => {
        $(card).click(() => {
            const bookId = $(card).attr('bookId');
            window.location.href = `/books/${bookId}`
        })
    })
})

async function loadBook(container, urlPrams) {
    const res = await fetch(`api/products/${urlPrams}`);
    if(res.ok) {
        const data = (await res.json()).data;
        data.forEach(book => {
            const rating = book.rating ? `<span style="color: #ffa500;">${book.rating.toFixed(1)}</span>` : '';
            container.append(
            `
            <div class="card border-0 shadow-sm" bookId="${book._id}">
                    <img class="card-image" src="${book.image}">
                    <div class="card-body p-1 d-flex flex-column gap-1">
                        <h5 class="card-title mb-0">${book.name}</h5>
                        <div class="mt-auto" style="font-size: 12px;">
                            ${rating}
                            <span>
                                ${renderStar(book.rating)}
                            </span>
                        </div>
                        <div class="price-box d-flex align-items-center mt-auto">
                            <p class="text-primary" style="margin: 0;">\$${book.price}</p>
                            <span style="color: #666; font-size: 14px;"> ${book.sold ? book.sold + ' sold' : ''}</span>
                        </div>
                    </div>
                  </div>
            `
        )
        })
    }
}

async function loadCategories() {
    const response = await fetch('/api/categories');

    if(response.ok) {
        data = (await response.json()).data;
        data.forEach(category => {
            $('.category-list').append(`
            <li>
                <a class="category-link" href="/books?cat=${category._id}">${category.name}</a>
            </li>`)
        }) 
    }
}
