$(document).ready(() => {
//const part2 = "http://localhost";
const part2 = "https://apirest2";

const email = document.getElementById("email");
const pass = document.getElementById("password");
const button = document.getElementById("login");
//const part1 = ":3001/api/token";
const part1 = "-mysql.onrender.com/api/token";

button.addEventListener("submit",(e) => {
    e.preventDefault();
    //console.log(email.value,pass.value);
button.disabled = true;
  
        $("#bnt_click").append("<div class='spinner-border text-dark' role='status'>"+
            "<span class='sr-only'>Loading...</span>"+
          "</div>");
    

    var data = {
    correo: email.value,
    password: pass.value
    }

    const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers:{
            'Content-Type':'application/json'
        }
    }

    fetch(part2+part1+"/login",options)
    .then(resp => resp.json())
    .then(resp => {
        //console.log(resp);
        if (resp.message == "User not found" ||  resp.message == "Incorrect password") {
            Swal.fire({
                position: "top-center",
                icon: "error",
                title: "Error en las credenciales",
                showConfirmButton: false,
                timer: 3000,
              });   
              $("#bnt_click").html("");
              $("#bnt_click").html("Login");
              button.disabled = false;
        }else{
            sessionStorage.setItem("token",resp.token);
            Swal.fire({
                position: "top-center",
                icon: "success",
                title: "Sea Bienvenid@",
                showConfirmButton: false,
                timer: 1500,
              });
              setTimeout(() => {
window.location.href = "solicitudes.html";
              },2000)
        }
    })
})
})