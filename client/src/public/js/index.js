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
                  starClass = 'fa-regular fa-star';
              }

              result += `<span class="${starClass}"></span>`;
            }
    return result;
}