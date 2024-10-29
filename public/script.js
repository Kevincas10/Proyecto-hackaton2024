document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const ocupacion = document.getElementById('ocupacion').value;

    const contacto = { nombre, email, ocupacion };

    // Guardar o actualizar contacto
    if (editingContactId !== null) {
        // Si estamos editando, enviamos la solicitud de actualización
        actualizarContacto(editingContactId, contacto);
    } else {
        // Si no, guardamos un nuevo contacto
        agregarContacto(contacto);
    }
});

let editingContactId = null; // Guardará el ID del contacto que estamos editando

function agregarContacto(contacto) {
    fetch('/guardar-contacto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contacto)
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
                    <h3>${contacto.nombre}</h3>
                    <p>Email: ${contacto.email}</p>
                    <p>Ocupación: ${contacto.ocupacion}</p>
                    <button onclick="editarContacto(${index})">Editar</button>
                    <button onclick="eliminarContacto(${index})">Eliminar</button>
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
            document.getElementById('ocupacion').value = contacto.ocupacion;
            editingContactId = id;
        })
        .catch(error => console.error('Error al obtener contacto:', error));
}

function actualizarContacto(id, contacto) {
    fetch(`/actualizar-contacto/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contacto)
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

// Llama a mostrarContactos al cargar la página
mostrarContactos();
