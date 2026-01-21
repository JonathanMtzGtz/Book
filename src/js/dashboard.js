$(document).ready(() => {
//const part2 = "http://localhost";
const part2 = "https://apirest2";
    const solicitudes = document.getElementById("solicitudes");
    const aprobados = document.getElementById("aprobados");
    const rechazados = document.getElementById("rechazados");
    const pendientes = document.getElementById("pendientes");
    const logout = document.getElementById("logout");
//const part1 = ":3001/api/regionalartist";
const part1 = "-mysql.onrender.com/api/regionalartist";

    var data = {
        proceso: 2
      }
    
      var options = {
        method : "POST",
        body: JSON.stringify(data),
        headers : {
            'Content-Type':'application/json'
        }
      }
    fetch(part2+part1+"/getRegistros",options)
    .then(resp => resp.json())
    .then(resp => {
       // console.log(resp.length)
        solicitudes.innerHTML = resp.length;
    })
    .then(resp => {
        fetch(part2+part1+"/getRechazados",options)
        .then(resp => resp.json())
        .then(resp => {
            //console.log(resp.length)
            rechazados.innerHTML = resp.length;
        })
        .then(resp => {
            fetch(part2+part1+"/getAprobados",options)
            .then(resp => resp.json())
            .then(resp => {
                //console.log(resp.length)
                aprobados.innerHTML = resp.length;
            })
            .then(resp => {
                fetch(part2+part1+"/getSolicitudes",options)
                .then(resp => resp.json())
                .then(resp => {
                    console.log(resp.length)
                    pendientes.innerHTML = resp.length;
                })
            })
        })
    })

    logout.addEventListener("click", () => {
        logout.innerHTML = '...cerrando sessión';
        sessionStorage.removeItem('token');
  
        setTimeout(() => {
          window.location.href = "admin.html"
        },1500)
      });

      if (!sessionStorage.getItem("token")) {
        window.location.href = "admin.html";
      };
})