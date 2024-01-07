$(document).ready(async() => {
  await loadCategories();
    $('.category-btn').on('click', () => {
        $('.category-menu').toggleClass('hide')
    })
})

const renderStar = (rating) => {
    if(!rating || rating < 1) {
        return '';
    }
    let result = '';
            for (let i = 1; i <= 5; i++) {
              let starClass = '';
              if(rating >= i) {
                  starClass = 'fa-solid fa-star checked-star';
              } else if(Math.round(rating) >= i) {
                starClass = 'fa-solid fa-star-half-stroke checked-star'
              } else {
                  starClass = 'fa-regular fa-star checked-star';
              }

              result += `<span class="${starClass}"></span>`;
            }
    return result;
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