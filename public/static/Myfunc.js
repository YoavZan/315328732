// let sendButton = document.querySelector('.SendButton');
async function SubmitForm(dogname) {
    if (validateForm()) {
        const dogId = Dogs.find(dog => dog.name == dogname).id;

        const body = {
            dog_id: dogId,
            first_name: document.getElementById("firstNameBox").value,
            last_name: document.getElementById("lastNameBox").value,
            email: document.getElementById("emailBox").value,
            phone: document.getElementById("phoneNumberBox").value
        }
        return fetch('/i-want-to-adopt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            .then(res => {
                if(res.status != 200){
                    console.error(res)
                    alert("Error! could not send the form, check for invalid inputs!")
                }
                else{
                    hideDetails()

                    showpopup()
    
                }
            }).catch(err => {
                console.log(err);
                alert("Error",err)
            })
    } else {}
}

function backPage() {
    hideDetails()
}

function validateForm() {

    var firstName = document.getElementById("firstNameBox").value;
    var regName = /^[a-zA-Z]+$/;
    if (!regName.test(firstName)) {
        alert("First name must be English chars only");
        return false;
    }
    var lastName = document.getElementById("lastNameBox").value;
    if (!regName.test(lastName)) {
        alert("Last name must be English chars only");
        return false
    }

    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var emailValue = document.getElementById("emailBox").value;
    if (!emailRegex.test(emailValue)) {
        alert("Invalid Email");
        return false;
    }

    let PhoneNumber = document.getElementById("phoneNumberBox").value;
    if (PhoneNumber.length !== 10) {
        alert("Invalid phone number, len should be 10");
        return false;
    }

    if (isNaN(PhoneNumber)) {
        alert("Invalid phone number");
        return false;
    }
    return true;
}

var Dogs;
function getDog(filter) {
    var dogBreed = document.getElementById("dog-breeds").value;
    var dogGender = document.getElementById("dog-genders").value;
    var dogAge = document.getElementById("dog-ages").value;
    var dogSize = document.getElementById("dog-sizes").value;
    var dogCity = document.getElementById("dog-cities").value;
    //set undefined if value is "Choose"
    if (dogBreed == "Choose") {
        dogBreed = undefined;
    }
    if (dogGender == "Choose") {
        dogGender = undefined;
    }
    if (dogAge == "Choose") {
        dogAge = undefined;
    }
    if (dogSize == "Choose") {
        dogSize = undefined;
    }
    if (dogCity == "Choose") {
        dogCity = undefined;
    }

    var TableHTML = "<table class = 'ResultTable'><tr id = 'FirstRow'> <th>Name</th> <th>Breed</th> <th>Gender</th><th>Age</th><th>Size</th><th>City</th><th>Picture</th><th>People Wanting</th></tr>"
    //fetch get dogs method GET
    fetch('/search-dogs?breed=' + dogBreed + '&gender=' + dogGender + '&age=' + dogAge + '&size=' + dogSize + '&city=' + dogCity)
    .then(res => res.json())
    .then(jsonObj => {
        Dogs = jsonObj;
        Dogs.forEach(el => {
            TableHTML += `<tr onClick='showDetails("${el.name}")'><td >` + el.name + "</td><td>" + el.breed + "</td><td>" + el.gender + "</td><td>" + el.age + "</td><td>" + el.size + "</td><td>" + el.city + "</td><td><img class='DogImg' src ='../static/images/" + el.breed + ".jpg'</td>"+"<td>"+el.inquiries+"</td>"+"</tr>";
        });
        TableHTML += "</table>"
        document.getElementById("Table").innerHTML = TableHTML;
    })
   
}



function showDetails(el) {
    var dog = Dogs.find(dog => dog.name == el);
    document.getElementById("DogName").innerText = "Meet: " + dog.name;
    document.getElementById("AboutMe").innerText = "About Me: I am a lovely " + dog.breed + "!";
    document.getElementById("SendButton").onclick = function () {
        SubmitForm(dog.name)
    };
    document.getElementById("DetailsOfDog").style.display = "block";
}

function hideDetails() {

    document.getElementById("DetailsOfDog").style.display = "none";
}

function showpopup() {
    document.getElementById("popup").style.display = "block";
}

function closepop() {

    document.getElementById("popup").style.display = "none";
}