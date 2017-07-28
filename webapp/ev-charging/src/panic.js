$(".submit").click(function() {
    var id = "1234";
    var hours = $("input[name=hours]").val();
    var minutes = $("input[name=minutes]").val();
    console.log(hours);
    console.log(minutes);

    $.post("https://ev-charging.herokuapp.com/" + id,
    {
        estimatedTime: {
            hours: hours,
            minutes: minutes
        }
    },
    function(data, status) {
        alert("Data: " + data + "\nStatus: " + status);
    });
});
