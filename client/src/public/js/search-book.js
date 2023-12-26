$(document).ready(async() => {
    const url = new URL(window.location.href);
    const keyword = url.searchParams.get('keyword') || '';
    $('.search-input').val(keyword);
    await loadBooks(url.search);


    $('.sort-select').change(async function(e) {
        const sortItem = $(this).find(':selected').val();
        const [sortBy, sortDir] = sortItem.split('-');
        let query = new URL(window.location.href);
        query.searchParams.set('sortBy', sortBy)
        query.searchParams.set('sortDir', sortDir);
        window.history.pushState({}, "", query)

        await loadBooks(query.search)
    })

    $('.review-rating-filter').each((index, filter) => {
        $(filter).click(async function() {
            const ratingFilter = $(this).attr('value');
            let url = new URL(window.location.href);
            url.searchParams.set('ratingFilter', ratingFilter)
            window.history.pushState({}, "", url)

            await loadBooks(url.search);
        })
    });

    $('.price-range').submit(async(e) => {
        e.preventDefault();
        let minPrice = parseFloat($('.min-price').val());
        const maxInput = $('.max-price').val();
        let maxPrice = parseFloat(maxInput);
        if(minPrice !== 0 && (!minPrice || minPrice < 0)) {
            $('.price-range-error').text('Please input valid price range');
            return;
        }

        if(maxInput && maxPrice !== 0 && (!maxPrice || maxPrice < minPrice)) {
            $('.price-range-error').text('Please input valid price range');
            return;
        }

        $('.price-range-error').text('');
        let url = new URL(window.location.href);
        url.searchParams.set('minPrice', minPrice);
        if(maxInput) {
                url.searchParams.set('maxPrice', maxInput);
        }
        window.history.pushState({}, "", url);
        await loadBooks(url.search);

    })

    $('.clear-filter-btn').click(async() => {
        window.history.pushState({}, "", window.location.pathname + `?keyword=${keyword}`)
        await loadBooks(url.search);
    })

    $('.card').each((index, card) => {
        $(card).click(() => {
            const bookId = $(card).attr('bookId');
            window.location.href = `/books/${bookId}`
        })
    })
})

async function loadBooks(query) {
    const response = await fetch(`/api/products${query || ''}`);
    if(response.ok) {
        const data = await response.json();

        $('.product-container').text('');
        const books = data.data;
        $('.product-container').append('<div class="product-box d-grid w-100" style="grid-template-columns: 1fr 1fr 1fr 1fr; row-gap: 16px; column-gap: 24px"></div>')
        books.forEach(book => {
            $('.product-box').append(
                `
                    <div class="card border-0 shadow-sm" bookid="${book._id}" style="width: 11rem;">
                    <img class="card-image" src="${book.image}" style="height: 14rem;">
                    <div class="card-body p-1 d-flex flex-column gap-1">
                        <h5 class="card-title mb-0">${book.name}</h5>
                        ${book.rating >= 1 ? `
                        <div class="mt-auto" style="font-size: 14px;">
                            <span style="color: #ffa500;">${book.rating}</span>
                            ${renderStar(book.rating)}
                        </div>` : ''}
                        <div class="price-box d-flex align-items-center mt-auto">
                            <p class="text-primary" style="margin: 0;">\$${book.price}</p>
                            <span style="color: #666; font-size: 14px;">${book.sold} sold</span>
                        </div>
                    </div>
                </div>
    
                `
            )
        })
        if(books.length == 0) {
            $('.product-container').append(
                `<div class="w-100 d-flex flex-column align-items-center justify-content-center mt-5">
                    <img src="/images/nodata.svg" style="max-width: 100px">
                    <p class="text-secondary mt-2">No books match your query</p>
                <div>`)
        }

        const _metadata = data._metadata;
        if(_metadata.page_count > 1) {
            $('.product-container').append(`
            <div class="mt-5 d-flex flex-column align-items-center w-100 gap-2">
                <p class="text-secondary">Shows ${Math.min(_metadata.total_count - (_metadata.page - 1) * (_metadata.per_page), _metadata.per_page)} of ${_metadata.total_count}</p>
                <nav aria-label="Page navigation example">
                    <ul class="pagination justify-content-center">
                        <li class="page-item ${_metadata.page == 1 ? 'disabled' : ''}"><a class="page-link" page="${_metadata.page - 1}"><i class="fa-solid fa-chevron-left"></i></a></li>
                        ${createPageItems(_metadata.page_count, _metadata.page)}
                        <li class="page-item ${_metadata.page == _metadata.page_count ? 'disabled' : ''}"><a class="page-link" page="${_metadata.page + 1}"><i class="fa-solid fa-chevron-right"></i></a></li>
                    </ul>
                </nav>
            </div>
            `)

            $(".page-link").each((index, pageLink) => {
                $(pageLink).click(async function() {
                    const page = $(this).attr('page');
                    let url = new URL(window.location.href);
                    url.searchParams.set('page', page);
                    window.history.pushState({}, "", url);
                    await loadBooks(url.search);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                })
            })
        } 

    }
}

function createPageItems(pages, current_page) {
    let result = '';
    for(let i = 1; i <= pages; i++) {
        result += `<li class="page-item ${i == current_page ?'active' : ''}"><a class="page-link" page="${i}">${i}</a></li>`
    } 

    return result;
}