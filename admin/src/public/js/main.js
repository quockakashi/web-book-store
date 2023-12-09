function showMainAlert(type, message) {
    const mainAlert = $('#mainAlert');
    if(type === 'success') {
        mainAlert.html(
           `
            <div class="alert alert-success d-flex align-items-center" role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
            <div>
              ${message}
            </div>
          </div>
            `
        );
    } else if(type === 'danger') {
        mainAlert.html(`
            <div class="alert alert-danger d-flex align-items-center" role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
            <div>
                ${message}
            </div>
            </div>
        `)
    };
    mainAlert.removeClass('visual-hidden');
    setTimeout(function() {
        mainAlert.html('');
    }, 5000);
}