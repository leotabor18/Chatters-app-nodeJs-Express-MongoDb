const button_arrow = document.querySelector('.sidebar-btn');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username');
const room = urlParams.get('room');
if(username == null || username == ''){
    window.location.href = "../index.html";
}
button_arrow.addEventListener('click', ()=>{
    const open = document.querySelector('.open');
    const close = document.querySelector('.close');
    let open_display = window.getComputedStyle(open, null).display;
    let close_display = window.getComputedStyle(close, null).display;
    const sidebar = document.querySelector('.sidebar');

    if(open_display == 'inline-block'){
        close.style.display = 'inline-block';
        open.style.display = 'none';
        sidebar.style.marginLeft = '0';
    }
    if(close_display == 'inline-block'){
        close.style.display = 'none';
        open.style.display = 'inline-block';
        sidebar.style.marginLeft = '-70%';
    }
});

const socket = io();
const form = document.querySelector('form');
const chat_area = document.querySelector('.chat-area');
const input_message = document.querySelector('input');
const ul = document.querySelector('ul');
const users = {
    username,
    room
}
socket.emit('user', users);
socket.on('roomInfo', roomInfo =>{
    document.querySelector('.room').textContent = roomInfo.room;
    ul.innerHTML = '';
    roomInfo.users.forEach(user => {
        let names = document.createElement('p');
        names.innerHTML = `<li class="sidebar-child ">${user}</li>`;
        ul.appendChild(names);
    });
})
form.addEventListener('submit', event =>{
    event.preventDefault();
    const formData = new FormData(form);
    const chat = formData.get('chat');
    socket.emit('chat', chat);
    input_message.value = '';
    input_message.focus();
});
socket.on('message', message =>{
    messageFromServer(message);
    chat_area.scrollTop = chat_area.scrollHeight; 
});
socket.on('chat-message', message =>{
    chatMessage(message);
    chat_area.scrollTop = chat_area.scrollHeight; 
});
function messageFromServer(data){
    const div = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = data.message;
    div.classList.add('d-flex','justify-content-center', 'm-1', 'p-2');
    p.classList.add('message');
    div.appendChild(p);
    if(data.user !== username){
        chat_area.appendChild(div);
    }
}
function chatMessage(message){
    const div = document.createElement('div');
    if(username == message.user){
        div.classList.add('send-message');
        div.innerHTML = `<div class="my-message contents d-flex flex-column justify-content-end my-1">
        <p class="name">${message.user}</p>
        <p class="message">${message.message}</p>
        <div class=" d-flex justify-content-end">
            <p class="date">${message.time}</p>  
        </div>       
    </div>`;
    }else{
        div.classList.add('chat-message','contents','my-1');
        div.innerHTML = `<p class="name">${message.user}</p>
        <p class="message">${message.message}</p>
        <div class=" d-flex justify-content-end">
            <p class="date">${message.time}</p> `;
    }
    chat_area.appendChild(div);
}
