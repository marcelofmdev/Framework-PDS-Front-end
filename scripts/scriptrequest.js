const xhr = new XMLHttpRequest();

xhr.open("GET", "http://localhost:8080/users/2&Marcola");

xhr.send();

xhr.onload = function() {
    if (xhr.status === 200) {
      //parse JSON datax`x
      data = JSON.parse(xhr.responseText)
      console.log(data.count)
      console.log(data.products)
    } else if (xhr.status === 404) {
      console.log("No records found")
    }
  }