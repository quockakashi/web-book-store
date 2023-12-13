let catId = null;
    $(document).ready(() => {
        $('.status-select').each((index, select) => {
            setBgSelect($(select));
            $(select).change(handleChangeStatus);
        })
        const editingMessage = localStorage.getItem('justEditing');
        if(editingMessage) {
            showMainAlert('success', editingMessage);
            localStorage.removeItem('justEditing');
        }
    })

    function setBgSelect(select) {
        const status = select.find(':selected').val();
        switch(status) {
            case 'processing':
                select.removeClass();
                select.addClass('form-select status-select bg-warning text-light');
                break;
            case 'delivering':
                select.removeClass();
                select.addClass('form-select status-select bg-primary text-light');
                break;
            case 'completed':
                select.removeClass();
                select.addClass('form-select status-select bg-success text-light');
                break;
            case 'canceled':
                select.removeClass();
                select.addClass('form-select status-select bg-danger text-light');
                break;
        }
    }

    async function handleChangeStatus(e) {
        const select = $(this);
        const orderId = select.attr('orderId');
        const status = select.find(':selected').val();
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({status})
        });

        const message = await response.json();

        if(response.ok) {
            setBgSelect(select);
            showMainAlert('success', message.message);
        } else {
            showMainAlert('danger', message.message);
        }
    }

     function handleSelectStatusChange(e) {
      let currentHref = new URLSearchParams(window.location.search);
      const status = $('#statusSelect').find(':selected').val()
      if(status == 'all')
        currentHref.delete('status');
      else {
        currentHref.set('status', status);
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