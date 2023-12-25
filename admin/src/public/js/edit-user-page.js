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
        const fullName = $('#fullName').val();
        const email = $('#email').val();
        const password = $('#password').val();
        const role = $('#role').find(':selected').val();
        const avatar = $('#avatar')[0].files[0];
        const username = $('#username').val();
        const balance =$('#balance').val();

        if(!/^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(username)) {
            scrollToTop();
            showMainAlert('warning', 'Invalid username, try another!')
            return false;
        }

        formData.append('username', username)
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        formData.append('balance',balance)
        if(avatar) {
          formData.append('avatar', avatar);
        };

        const response = await fetch(`/api/users/${id}`, {
          method: 'POST',
          body: formData,
        })

        if(response.ok) {
          const json = await response.json();
          localStorage.setItem('justEditing', id);
          window.location.href = `/users?search=${id}`;
        } else {
        scrollToTop();
          const json = await response.json();
          showMainAlert('danger', json.message)
        }
        return false;
    }

    $(document).ready(() => {
      $('.form').on('submit', (e) => {
        return true;
      })
    }) 