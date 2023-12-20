$(document).ready(() => {
    let showPw = false;
    $('#show-pw-btn').on('click', (e) => {
        if(!showPw) {
            $("#password").attr('type', 'text');
            $('.show-pw-icon').removeClass('fa-eye');
            $('.show-pw-icon').addClass('fa-eye-slash');
            showPw = true;
        } else {
            $("#password").attr('type', 'password');
            $('.show-pw-icon').removeClass('fa-eye-slash');
            $('.show-pw-icon').addClass('fa-eye');
            showPw = false;
        }
    })
});

const handleSubmit = async (e) => {
    e.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();
    const rememberMe = $('#rememberMe').prop('checked');
    //console.log(email, password, rememberMe);

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password, rememberMe})
        });
        if(res.ok) {
            const user = (await res.json()).user;
            console.log(user);
            localStorage.setItem('authenticatedUser', JSON.stringify(user));
            window.location.href = '/';
        } else {
            console.log('Authenticate failed')
            $('.alert-message').html('Invalid Credential!');
            $('.alert').css({
                'opacity': '1',
            })
        }
    } catch(err) {
        console.log(err);
    }

    return false;
};