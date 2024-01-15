let catId = null;
$(document).ready(() => {
    const editingMessage = localStorage.getItem('justEditing');
    if(editingMessage) {
        showMainAlert('success', editingMessage);
        localStorage.removeItem('justEditing');
    }
    
    $('.btn-delete-category').each((index, btn) => {
        $(btn).on('click', async (e) => {
            catId = $(btn).attr('catId');
            const catName = $(btn).attr('catName');
            $(".modal-body").text(`Are you sure to delete ${catName}`);
        
    })

    $("#continueBtn").unbind('click').on('click', async function(e) {
        console.log(e.target);
        e.preventDefault();
        e.stopPropagation();
        console.log('Hello');
        const response = await fetch(`/admin/api/categories/${catId}`, {
                method: 'DELETE',
            })

            const json = await response.json();
            if(response.ok) {
                showMainAlert('success', json.message);
                $(`tr[rowid="${catId}"]`).remove();
            } else {
                showMainAlert('danger', json.message);
            }
        })
    })
})