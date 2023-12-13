$(document).ready(() => {
    const editedId = localStorage.getItem('justEditing');
    if(editedId) {
        showMainAlert('success', `User ${editedId} edited successfully`);
        localStorage.removeItem('justEditing');
    }
    $('.btn-delete-user').each((index, btn) => {
        $(btn).on('click', async (e) => {
            const userId = $(btn).attr('userId');
            const response = await fetch(`/api/users/${userId}`, {
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
        
    })
})