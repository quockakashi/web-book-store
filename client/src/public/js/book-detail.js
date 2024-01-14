$(document).ready(async () => {
    $('.preview-btn').click(() => {
        $('.preview-box').removeClass('hide');
    });

    $('.close-preview-btn').click(() => {
        $('.preview-box').addClass('hide');
    })

    const productId = $('.product-id').val();
    let quantity = $('.quantity-input').val();
    let max_quantity = $('.quantity-input').attr('max');
    let min_quantity = $('.quantity-input').attr('min');
    $('.inc-btn').click(() => {
        if(quantity < max_quantity) {
            quantity++;
            $('.quantity-input').val(quantity);
        }
    })
    $('.desc-btn').click(() => {
        if(quantity > min_quantity) {
            quantity--;
            $('.quantity-input').val(quantity);
        }
    })

    const response = await fetch(`/api/products/book-same-categories/${productId}`);
    if (response.ok) {
        const data = (await response.json()).data;
        data.forEach(elem => {
            if (elem.products.length != 0) {
                $('main').append(
                    `
                    <section class="p-3 mt-3">
                         <h4>${elem.category.name} Books</h4>
                        <div class="new-book-container py-2 d-flex gap-3" style="overflow-x: scroll;">
                            ${elem.products.map((book) => {
                        const rating = book.rating ? `<span style="color: #ffa500;">${book.rating.toFixed(1)}</span>` : '';
                        return ` <div class="card border-0 shadow-sm" bookId="${book._id}">
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
                                                <p class="text-primary" style="margin: 0;">&#8363;${new Number(book.price).toLocaleString('vi-VN')}</p>
                                                <span style="color: #666; font-size: 14px;"> ${book.sold ? book.sold + ' sold' : ''}</span>
                                            </div>
                                        </div>
                                    </div>`
                    }).join('')}
                        </div>
                    </section>
                    `
                )
            }
        })
    }

    $('.card').each((index, card) => {
        $(card).click(() => {
            const bookId = $(card).attr('bookId');
            window.location.href = `/books/${bookId}`
        })
    })
})