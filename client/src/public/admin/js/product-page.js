let productId = null;
    $(document).ready(() => {
        const editingMessage = localStorage.getItem('justEditing');
        if(editingMessage) {
            showMainAlert('success', editingMessage);
            localStorage.removeItem('justEditing');
        }

       $('.card').each((index, product) => {
            $(product).click(function(e) {
                const productId = $(this).attr('cardId');
                window.location.href = `/products/${productId}`
            })
        })
        
        $('.btn-remove-product').each((index, btn) => {
            $(btn).on('click', async (e) => {
                e.stopPropagation();
                productId = $(btn).attr('productId');
                const productName = $(btn).attr('productName');
                $(".modal-body").text(`Are you sure to delete "${productName}"`);
            
        })
    


        $("#continueBtn").unbind('click').on('click', async function(e) {
            console.log(e.target);
            e.preventDefault();
            e.stopPropagation();
            const response = await fetch(`/admin/api/products/${productId}`, {
                    method: 'DELETE',
                })

                const json = await response.json();
                if(response.ok) {
                    showMainAlert('success', json.message);
                    $(`div[cardId="${productId}"]`).remove();
                } else {
                    showMainAlert('danger', json.message);
                }
            })
        })
    })

    function handleSelectCategoriesChange(e) {
      let currentHref = new URLSearchParams(window.location.search);
      const categoryId = $('#categorySelect').find(':selected').val()
      if(categoryId == 'all')
        currentHref.delete('catId');
      else {
        currentHref.set('catId', categoryId);
      }
      window.location.search = currentHref.toString();
    }

    function handleSelectSortChange(e) {
      let currentHref = new URLSearchParams(window.location.search);
      const sortVal = $('#sortSelect').find(':selected').val()
      const [sortBy, sortDir] = sortVal.split('-');
      currentHref.set('sortBy', sortBy);
      currentHref.set('sortDir', sortDir);
      window.location.search = currentHref.toString();
    }