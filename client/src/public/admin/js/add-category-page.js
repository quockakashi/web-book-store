async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    const name = $('#name').val();
    const description = $('#description').val();

    formData.append('name', name);
    formData.append('description', description);

    const response = await fetch(`/admin/api/categories`, {
      method: 'POST',
      body: formData,
    })

    if(response.ok) {
      const json = await response.json();
      localStorage.setItem('justEditing', json.message);
      window.location.href = `/admin/categories?search=${json.data._id}`;
    } else {
      const json = await response.json();
      showMainAlert('danger', json.message)
    }

    return false;
}