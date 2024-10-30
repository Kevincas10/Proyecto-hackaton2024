document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const ocupacion = document.getElementById('ocupacion').value;
    const foto = document.getElementById('foto').files[0];

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    formData.append('ocupacion', ocupacion);
    formData.append('foto', foto);

    if (editingContactId !== null) {
        actualizarContacto(editingContactId, formData);
    } else {
        agregarContacto(formData);
    }
});

let editingContactId = null;

function agregarContacto(formData) {
    fetch('/guardar-contacto', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarContactos();
            document.getElementById('contact-form').reset();
        }
    })
    .catch(error => console.error('Error en la solicitud:', error));
}

function mostrarContactos() {
    fetch('/obtener-contactos')
        .then(response => response.json())
        .then(contactos => {
            const contactsList = document.getElementById('contacts-list');
            contactsList.innerHTML = '';
            contactos.forEach((contacto, index) => {
                const contactCard = document.createElement('div');
                contactCard.className = 'contact-card';
                contactCard.innerHTML = `
                    <img src="${contacto.foto}" alt="Foto de ${contacto.nombre}">
                    <div>
                        <h3>${contacto.nombre}</h3>
                        <p>Email: ${contacto.email}</p>
                        <p>Cursos a impartir: ${contacto.ocupacion}</p>
                        <button onclick="editarContacto(${index})">Editar</button>
                        <button onclick="eliminarContacto(${index})">Eliminar</button>
                    </div>
                `;
                contactsList.appendChild(contactCard);
            });
        })
        .catch(error => console.error('Error al obtener contactos:', error));
}

function editarContacto(id) {
    fetch('/obtener-contactos')
        .then(response => response.json())
        .then(contactos => {
            const contacto = contactos[id];
            document.getElementById('nombre').value = contacto.nombre;
            document.getElementById('email').value = contacto.email;
            document.getElementById('Cursos').value = contacto.ocupacion;
            editingContactId = id;
        })
        .catch(error => console.error('Error al obtener contacto:', error));
}

function actualizarContacto(id, formData) {
    fetch(`/actualizar-contacto/${id}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarContactos();
            document.getElementById('contact-form').reset();
            editingContactId = null;
        }
    })
    .catch(error => console.error('Error al actualizar contacto:', error));
}

function eliminarContacto(id) {
    fetch(`/eliminar-contacto/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarContactos();
        }
    })
    .catch(error => console.error('Error al eliminar contacto:', error));
}

mostrarContactos();
