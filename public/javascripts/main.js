requirejs.config({
    paths: {
        "jquery": [
            "http://code.jquery.com/jquery-1.9.1.min",
            "/javascripts/jquery-1.9.1.min"
        ],
        "jquery-ui": [
            "http://code.jquery.com/ui/1.9.2/jquery-ui.min",
            "/javascripts/jquery-ui.min"
        ],
        "jquery-form-validator": [
            "/javascripts/jquery.formvalidator.min"
        ]
    }
});

require(["jquery"], function($) {

    require(["jquery-ui"], function() {
        $(function() {
            $("#datepicker").datepicker();
        });
    });

    require(["jquery-form-validator"], function() {
         $(document).ready(function(){
            $('#articleForm').submit(function() {
                return $(this).validate();
            });
        });
    });

});