async function getAuthenticatedUser() {
    const response = await fetch('/api/users/self');
    if(response.ok) {
        const data = (await response.json()).data;
        $('.user-avatar').attr('src', data.avatar);

        $('.user-avatar').click(function() {
            $('.profile-popover').toggleClass('hide')
        })

        $('.full-name').text(data.fullName);
    }
}