$(document).ready(() => {
})

function displaySelectedImage(event, elementId) {
const selectedImage = document.getElementById(elementId);
const fileInput = event.target;

if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function(e) {
        selectedImage.src = e.target.result;
    };

    reader.readAsDataURL(fileInput.files[0]);
}
}

async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    const id = $('#id').val();
    const pagesInput = $('#pages').val();

    const name = $('#name').val();
    let authors = $('#authors').val();
    let categories = $
    ('#categories').val();
    const publisher = $('#publisher').val();
    const publishDate = $('#publishDate').val();
    const price = parseFloat($('#price').val());
    const language = $('#language').val();      
    const description = $('#description').val();
    const pages = parseFloat(pagesInput);
    const stock = $('#stock').val();
    const image = $('#image')[0].files[0];
    console.log()

    if(!name.trim()) {
        showMainAlert('warning', 'Name must be input');
        return false;
    }

    if(!categories.length) {
        showMainAlert('warning', 'Must select at least one category!')
        return false;
    }

    if(Number.isNaN(price) || price < 0) {
        showMainAlert('warning', 'Invalid price value');
    }

    if(pagesInput && (!Number.isInteger(pages) || pages < 0)) {
        showMainAlert('warning', 'Invalid pages value')
    }

    if(!stock || parseInt(stock) < 0) {
        console.log(stock);
        showMainAlert('warning', 'Invalid stock value!');
        return false;
    }

    if(authors) {
        authors = JSON.stringify(authors.split(',').map(author => author.trim()));
    }

    categories = JSON.stringify(categories);

    formData.append('name', name);
    if(authors) {
        formData.append('authors', authors);
    }
    if(publisher) {
        formData.append('publisher', publisher);
    }
    if(pagesInput) {
        formData.append('pages', pages);
    }
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('categories', categories);
    if(image) {
        formData.append('image', image);
    }
    if(description) {
        formData.append('description', description)
    }
    if(language) {
        formData.append('language', language);
    }
    if(publishDate) {
        formData.append('publishDate', publishDate);
    }

    const response = await fetch(`/api/products/${id}`, {
      method: 'POST',
      body: formData,
    })

    if(response.ok) {
      const json = await response.json();
      localStorage.setItem('justEditing', json.message);
      window.location.href = `/products?search=${json.data._id}`;
    } else {
      const json = await response.json();
      showMainAlert('danger', json.message);
    }

    return false;
}