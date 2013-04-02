requirejs.config({
    paths: {
        "jquery": [
            "https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min",
            "/javascripts/jquery-1.9.1.min"
        ]
    }
});

require(["jquery"], function($) {

     require(["http://code.jquery.com/ui/1.9.2/jquery-ui.js"], function() {
        $(function() {
            $("#datepicker").datepicker();
        });
     });

     require(["/javascripts/jquery.formvalidator.min.js"], function() {
         $(document).ready(function(){
            $('#articleForm').submit(function() {
                return $(this).validate();
            });
        });
     });

});