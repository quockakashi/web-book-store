$(document).ready(() => {
    const editedId = localStorage.getItem('justEditing');
    if(editedId) {
        showMainAlert('success', `User ${editedId} edited successfully`);
        localStorage.removeItem('justEditing');
    }
    $('.btn-delete-user').each((index, btn) => {
        $(btn).on('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const userId = $(btn).attr('userId');
            const response = await fetch(`/admin/api/users/${userId}`, {
                method: 'DELETE',
            })

            const json = await response.json();
            if(response.ok) {
                showMainAlert('success', json.message);
                $(`tr[rowid="${userId}"]`).remove();
            } else {
                showMainAlert('danger', json.message);
            }
        })
        
    });

    $('tr').each((index, row) => {
        $(row).click(() => {
            const userId = $(row).attr('rowId');
            window.location.href = `/admin/users/${userId}`
        })
    })
})