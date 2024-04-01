<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "CakeSale";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$fullName = $_POST['fullName'];
$cartData = json_decode($_POST['cartData'], true); // Decode the JSON string

if (!empty($cartData)) {
    foreach ($cartData as $item) {
        $cakeName = $item['cakeName'];
        $quantity = $item['quantity'];
        // Insert each item into the database
        $sql = "INSERT INTO CAKES (FullName, CakeType, Quantity) VALUES ('$fullName', '$cakeName', $quantity)";
        if (!$conn->query($sql) === TRUE) {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
    echo "New record created successfully";
} else {
    echo "Error: Cart data is missing";
}

$conn->close();
?>
