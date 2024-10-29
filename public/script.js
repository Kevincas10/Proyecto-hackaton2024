document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const ocupacion = document.getElementById('ocupacion').value;

    const contacto = { nombre, email, ocupacion };

    // Enviar los datos al servidor
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
        } else {
            console.error('Error al guardar el contacto');
        }
    })
    .catch(error => console.error('Error en la solicitud:', error));
});

function mostrarContactos() {
    fetch('/obtener-contactos')
        .then(response => response.json())
        .then(contactos => {
            const contactsList = document.getElementById('contacts-list');
            contactsList.innerHTML = '';
            contactos.forEach(contacto => {
                const contactCard = document.createElement('div');
                contactCard.className = 'contact-card';
                contactCard.innerHTML = `
                    <h3>${contacto.nombre}</h3>
                    <p>Email: ${contacto.email}</p>
                    <p>Ocupación: ${contacto.ocupacion}</p>
                `;
                contactsList.appendChild(contactCard);
            });
        })
        .catch(error => console.error('Error al obtener contactos:', error));
}

// Llama a mostrarContactos al cargar la página
mostrarContactos();
