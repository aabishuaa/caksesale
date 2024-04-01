document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var fullName = document.getElementById('fullName').value;
    
    // Save the user's name to localStorage
    localStorage.setItem('userName', fullName);

    // Now move to the cake selection page
    window.location.href = 'http://localhost/CAKE%20SALE/cakes.html';
});
