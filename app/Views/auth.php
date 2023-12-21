<div class="statbox widget box box-shadow">
    <div class="widget-content widget-content-area mt-3">
        <div class="row">
            <div class="col-md-12">
                <div class="text-center">
                    <h4>Login to Connect Spotify</h4>
                    <button class="btn btn-primary mt-4" id="btn-auth">Login</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    $('#btn-auth').on('click', function(e) {
        e.preventDefault()
        const w = 400;
        const h = 600;
        const left = Number((screen.width / 2) - (w / 2));
        const top = Number((screen.height / 2) - (h / 2));
        $.ajax({
            url: `${SITE_URL}/home/accessToken`,
            success: (respon) => {
                if (respon.status) {
                    window.open(respon.callback, "Connect Spotify", `height=${h},width=${w},left=${left},top=${top},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=auto,resizable=yes,copyhistory=no`);
                }
            },
            error: (xhr, status, message) => {

            }
        })
    })
</script>