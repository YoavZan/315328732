// let sendButton = document.querySelector('.SendButton');
function SubmitForm() {
    if (validateForm()) {
        //alert("The form was submitted");
        hideDetails()
        //noteOfPop-try
        showpopup()

    } else {
    }
}

function backPage(){ hideDetails() }

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
        return false}

    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var emailValue = document.getElementById("emailBox").value;
    if (!emailRegex.test(emailValue)) {
        alert("Invalid Email");
        return false;
    }




    let PhoneNumber = document.getElementById("phoneNumberBox").value;
    if (PhoneNumber.length !== 10) {
        alert("less Invalid phone number");
        return false;
    }

    if (isNaN(PhoneNumber)) {
        alert("Invalid phone number");
        return false;
    }
    return true;
}



var Dogs = [
        {Name: "Jina", Breed: "Labrador", Gender: "Female", Age: "Puppy", Size: "Small", City: "Beer Sheva"},
        {Name: "Chili", Breed: "Poodle", Gender: "Male", Age: "Young", Size: "Small", City: "Tel Aviv"},
        {Name: "Roki", Breed: "Mix", Gender: "Male", Age: "Adult", Size: "Medium", City: "Yehud"},
    ]
;

function getDog(filter){
    var dogBreed = document.getElementById("dog-breeds").value;
    var dogGender = document.getElementById("dog-genders").value;
    var dogAge = document.getElementById("dog-ages").value;
    var dogSize = document.getElementById("dog-sizes").value;
    var dogCity = document.getElementById("dog-cities").value;
    var TableHTML = "<table class = 'ResultTable'><tr id = 'FirstRow'> <th>Name</th> <th>Breed</th> <th>Gender</th><th>Age</th><th>Size</th><th>City</th><th>Picture</th></tr>"

    Dogs.forEach(el => {
            var FilterCondition = ((dogBreed == "Choose" || el.Breed == dogBreed)
                && (dogGender == "Choose" || el.Gender == dogGender)
                && (dogAge == "Choose" || el.Age == dogAge)
                && (dogSize == "Choose" || el.Size == dogSize)
                && (dogCity == "Choose" || el.City == dogCity));
        if(FilterCondition){
            TableHTML += "<tr><td onClick='showDetails()'>" + el.Name + "</td><td>" + el.Breed + "</td><td>" + el.Gender + "</td><td>" + el.Age + "</td><td>" + el.Size + "</td><td>" + el.City + "</td><td><img class='DogImg' src ='../static/images/" + el.Breed + ".jpg'</td></tr>";
        }
        }
    );
    TableHTML += "</table>"
    document.getElementById("Table").innerHTML = TableHTML;
}



    function showDetails(){

    document.getElementById("DetailsOfDog").style.display = "block";
 }
    function hideDetails(){

    document.getElementById("DetailsOfDog").style.display = "none";
}

    function showpopup(){

    document.getElementById("popup").style.display = "block";
}

function closepop(){

    document.getElementById("popup").style.display = "none";
}