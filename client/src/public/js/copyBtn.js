function copyText() {
    /* Lấy nội dung của ô */
    var text = document.getElementById("myInput").value;

    /* Tạo một phần tử input ẩn */
    var tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);

    /* Chọn toàn bộ nội dung trong phần tử input */
    tempInput.select();

    /* Sao chép nội dung vào clipboard */
    document.execCommand("copy");

    /* Xóa phần tử input ẩn */
    document.body.removeChild(tempInput);

    /* Hiển thị thông báo */
    alert("Đã sao chép: " + text);
}