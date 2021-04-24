const form = document.querySelector('form');

form.addEventListener('submit', event =>{
    const formData = new FormData(form);
    const username = formData.get('username');
    const room = formData.get('room');
    const error = document.querySelector('#error');
    
    if(username == '' || username == null){
        event.preventDefault();
        error.textContent = 'Username is required!';
        event.target.room.classList.remove("border-danger");
        event.target.username.classList.add("border-danger");
        return;
    }
    if(room == '' || room == null){
        event.preventDefault();
        error.textContent = 'Room is required!';
        event.target.username.classList.remove("border-danger");
        event.target.room.classList.add("border-danger");
        return;
    }
    form.action = './home.html';
});