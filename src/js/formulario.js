$(document).ready(function() {
//    const part2 = "http://localhost";
const part2 = "https://apirest2";
const button = document.getElementById("btn_form");
//const part1 = ":3001/api/regionalartist";
const email = document.getElementById("email");
 const part1 = "-mysql.onrender.com/api/regionalartist";


//validar que no se repita el correo
email.addEventListener("change", () => {
var data = {
  correo : email.value
}

const options = {
  method: "POST",
  body: JSON.stringify(data),
  headers:{
    'Content-Type':'application/json'
  }
}

fetch("https://apirest2-mysql.onrender.com/api/regionalartist/getEmail",options)
.then(resp=> resp.json())
.then(resp => {
  console.log(resp.length)
  if (resp.length > 0) {
    Swal.fire({
      position: "top-center",
      icon: "error",
      title: "lo sentimos, este correo ya fue registrado",
      showConfirmButton: true,
      timer: 10000,
    }); 
    email.value = "";
  }
  
})

})

const Body = `
<div style="background-color: #ececec; padding: 0; margin: 0 auto; font-weight: 200; width: 100%!important;">
  <p> </p>
  <center>
    <h2 style="color: #3b693c;">REGISTRO</h2>
  </center>
  <br />
  <table style="width: 600px; margin-left: auto; margin-right: auto; background-color: #ffffff; height: 165px;">
    <tbody>
      <tr style="height: 61px;">
        <td style="width: 590px; background-color: #3b693c; text-align: center; height: 61px;" colspan="2">
          <h2><span style="color: #ffffff;"><strong>GRACIAS POR REGISTRAR TU PARTICIPACIÓN</strong></span></h2>
        </td>
      </tr>
    </tbody>
  </table>
  <p> </p>
  <p> </p>
</div>
`;

$('#file').on('change', function(event) {
  const file = event.target.files[0];
  const fileType = file ? file.type : '';
  const validFileTypes = ['application/pdf'];
  const maxSizeInBytes = 400 * 1024; // 400 KB en bytes

  if (!validFileTypes.includes(fileType)) {
      $('#file').addClass('is-invalid');
      $('#fileFeedback').show();
      $('#filePreview').hide();
      $('#file').val(''); // Limpiar el campo de file
  } else if (file.size > maxSizeInBytes) {
      alert('El archivo es muy pesado. El tamaño máximo permitido es de 400 KB.');
      $('#file').val(''); // Limpiar el campo de file
  } else {
      $('#file').removeClass('is-invalid');
      $('#fileFeedback').hide();

      const fileReader = new FileReader();
      fileReader.onload = function() {
          $('#filePreview').attr('src', fileReader.result);
          $('#filePreview').show();
      };
      fileReader.readAsDataURL(file);
  }
});


    $('#registroForm').on('submit', function(event) {
        event.preventDefault();

        button.disabled = true;
  
        $("#bnt_form").append("<div class='spinner-border text-dark' role='status'>"+
            "<span class='sr-only'>Loading...</span>"+
          "</div>");

        if ($('#file').hasClass('is-invalid')) {
            alert('Por favor, selecciona un file PDF válido.');
            return;
        }

        const formData = new FormData(this);

        fetch(part2+part1+"/saveusuario", {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data >= 0) {
                enviar()
                setTimeout(() => {
                    window.location.href = "carga.html";
                   },2000)  
            }  else{
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: "No se genero el registro, volver a inter o reportar al correo: info@omodaregionalartist.com",
                    showConfirmButton: false,
                    timer: 40000
                  })
            }  
        })
    });


    function enviar(){
    var data = {
  
     toEmail: $("#email").val(),
    fromEmail: "info@omodaregionalartist.com",
    html: Body
    }
  
    var options = {
      method: "POST",
      body: JSON.stringify(data),
      headers:{
        "Content-Type":"application/json"
      }
    }
  
    fetch("https://apirest2-mysql.onrender.com/api/correo/sendEmail",options)
    .then(resp => resp.json())
    .then(resp => {
  console.log(resp)
  if (resp != 'CORRECTO') {
    Swal.fire({
      position: "top-center",
      icon: "error",
      title: "Error al enviar el correo, pedir soporte a TI",
      showConfirmButton: false,
      timer: 10000,
    }); 
  }
    })
  
      }
});



function validarNombre(input) { 
    // Eliminar números
    let valor = input.value.replace(/[0-9]/g, '');
    
    // Convertir la primera letra después de cada espacio a mayúscula y el resto a minúscula
    valor = valor.toLowerCase().replace(/\b\w/g, function (letra) {
        return letra.toUpperCase();
    });

    // Actualizar el valor del input
    input.value = valor;
}

function validarTelefono(input) {
    // Eliminar cualquier carácter que no sea un número
    let valor = input.value.replace(/\D/g, '');
    
    // Limitar el valor a 10 dígitos
    if (valor.length > 10) {
        valor = valor.slice(0, 10);
    }
    
    // Actualizar el valor del input
    input.value = valor;

    // Validar la longitud del número
    if (valor.length === 10) {
        input.setCustomValidity('');
    } else {
        input.setCustomValidity('El número de teléfono debe tener 10 dígitos');
    }
}



