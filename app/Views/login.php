<div class="layout-spacing">
    <div class="statbox widget box box-shadow">
        <div class="widget-content widget-content-area">
            <div class="col-lg-6 mx-md-auto">
                <div class="text-center">
                    <h4>Login Admin</h4>
                </div>
                <form id="form-login">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" class="form-control" id="username" name="username">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" name="password">
                    </div>
                    <div class="text-center">
                        <button id="btn-login" type="submit" class="btn btn-button-7 mb-4">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
    $('#btn-login').on('click', function(e) {
        e.preventDefault()
        let form = $('#form-login')
        form.validate({
            errorElement: "div",
            errorClass: "is-invalid",
            rules: {
                username: "required",
                password: "required",
            },
        });

        if (form.valid()) {
            $.ajax({
                type: 'post',
                url: `${SITE_URL}/home/login`,
                data: $('form').serialize(),
                success: (respon) => {
                    if (respon.status) {
                        getData('setting')
                    } else {
                        toast({
                            type: 'error',
                            title: respon.pesan,
                        })
                    }
                },
                error: (xhr, status, messages) => {
                    toast({
                        type: 'error',
                        title: messages,
                    })
                }
            })
        };
    })
</script>