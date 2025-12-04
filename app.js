const addNewUserBtn = document.getElementById("addNewUser");
const userFormDialog = document.getElementById("userFormDialog");
const tableRow = document.getElementById("tableRows");

try {
  addNewUserBtn.addEventListener("click", () => {
    userFormDialog.showModal();
  });

  userFormDialog.querySelector("#close").addEventListener("click", () => {
    userFormDialog.close();
  });
} catch (err) {
  console.log("Element not found: ", err);
}

const createUserUrl = "https://borjomi.loremipsum.ge/api/register", //method POST  ყველა ველი სავალდებულო
  getAllUsersUrl = "https://borjomi.loremipsum.ge/api/all-users", //method GET
  getSingleUserUrl = "https://borjomi.loremipsum.ge/api/get-user/120 ", //id, method  GET
  updateUserUrl = "https://borjomi.loremipsum.ge/api/update-user/145 ", //id, method PUT  ყველა ველი სავალდებულო
  deleteUserUrl = "https://borjomi.loremipsum.ge/api/delete-user/145"; //id, method DELETE

const regForm = document.querySelector("#registration-form"),
  userName = regForm.querySelector("#userName"),
  userSurname = regForm.querySelector("#userSurname"),
  userEmail = regForm.querySelector("#userEmail"),
  userPhone = regForm.querySelector("#userPhone"),
  userPersonalID = regForm.querySelector("#userPersonalId"),
  userZip = regForm.querySelector("#userZipCode"),
  userGender = regForm.querySelector("[name='gender']:checked"),
  // user id ფორმში, რომელიც გვჭირდება დაედითებისთვის
  userId = regForm.querySelector("#userId");

function userActions() {
  // TODO:
  // 1. ცხრილში ღილაკებზე უნდა მიამაგროთ event listener-ები
  // 2. იქნება 2 ღილაკი რედაქტირება და წაშლა როგორც "ცხრილი.png" ში ჩანს
  // 3. id შეგიძლიათ შეინახოთ data-user-id ატრიბუტად ღილაკებზე, data ატრიბუტებზე წვდომა შეგიძლიათ dataset-ის გამოყენებით მაგ:selectedElement.dataset
  // 4. წაშლა ღილაკზე დაჭერისას უნდა გაიგზავნოს წაშლის მოთხოვნა (deleteUser ფუნქციის მეშვეობით) სერვერზე და გადაეცეს id
  // 5. ედიტის ღილაკზე უნდა გაიხსნას მოდალი სადაც ფორმი იქნება იმ მონაცემებით შევსებული რომელზეც მოხდა კლიკი. ედიტის ღილაკზე უნდა გამოიძახოთ getSingleUser ფუნქცია და რომ დააბრუნებს ერთი მომხმარებლის დატას (ობიექტს და არა მასივს) const data = await getSingleUser(btn.dataset.userId); ამ ინფორმაციით  უნდა შეივსოს ფორმი და ამის შემდეგ შეგიძლიათ დააედიტოთ ეს ინფორმაცია და ფორმის დასაბმითებისას უნდა მოხდეს updateUser() ფუნქციის გამოძახება, სადაც გადასცემთ განახლებულ იუზერის ობიექტს, გვჭირდება იუზერის აიდიც, რომელიც  მოდალის გახსნისას userId-ის (hidden input არის და ვიზუალურად არ ჩანს) value-ში შეგიძლიათ შეინახოთ.
  const deleteUserTable = tableRow.querySelectorAll(".delete"),
    editUserTable = tableRow.querySelectorAll(".edit");
  deleteUserTable.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.userId;
      deleteUser(id);
    });
  });

  editUserTable.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.userId;
      const userData = await getSingleUser(id);

      userId.value = userData.id;
      userName.value = userData.first_name;
      userSurname.value = userData.last_name;
      userPhone.value = userData.phone;
      userPersonalID.value = userData.id_number;
      userEmail.value = userData.email;
      userZip.value = userData.zip_code;
      regForm.querySelector(`[value="${userData.gender}"]`).checked = true;
      userFormDialog.showModal();
    });
  });
  return;
}

async function getAllUsersAsync() {
  try {
    const respone = await fetch("https://borjomi.loremipsum.ge/api/all-users");
    const data = await respone.json();

    const html = data.users
      .map((el) => {
        return `<tr>
            <td>${el.id}</td>
            <td>${el.first_name}</td>
            <td>${el.last_name}</td>
            <td>${el.email}</td>
            <td>${el.id_number}</td>
            <td>${el.phone}</td>
            <td>${el.zip_code}</td>
            <td>${el.gender}</td>
            <td>
              <div class="button-wrapper">
                <button class="edit" data-user-id="${el.id}">Edit</button>
                <button class="delete" data-user-id="${el.id}">Delete</button>
              </div>
            </td>
          </tr>`;
      })
      .join("");
    tableRow.innerHTML = html;
    userActions();
  } catch (err) {
    console.log("error message: ", err);
  }
}

getAllUsersAsync();

async function updateUser(userObj) {
  try {
    const response = await fetch(updateUserUrl + userObj.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userObj),
    });

    const result = await response.json();
    console.log("User updated successfully", result);

    userFormDialog.close();
    await getAllUsersAsync();
  } catch (err) {
    console.error("Error updating user:", err);
  }

  // მიიღებს დაედითებულ ინფორმაციას და გააგზავნით სერვერზე, ისე როგორც რეგისტრაციისას
  // TODO დაასრულეთ ფუნქცია
  //  method: "put",  http://borjomi.loremipsum.ge/api/update-user/${userObj.id}
  // TODO: ედიტირების შემდეგ ახლიდან წამოიღეთ დატა
}

async function getSingleUser(id) {
  try {
    const response = await fetch(
      `https://borjomi.loremipsum.ge/api/get-user/${id}`
    );
    const data = await response.json();
    return data.users;
  } catch (e) {
    console.log("Error - ", e);
  }
}

function createNewUser(userData) {
  fetch("https://borjomi.loremipsum.ge/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      console.log("User created successfully: ", result);

      regForm.reset();
      userFormDialog.close();

      getAllUsersAsync();
    })
    .catch((err) => {
      console.error("Error creating user: ", err);
    });
}

function deleteUser(id) {
  fetch(`https://borjomi.loremipsum.ge/api/delete-user/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("User deleted successfully: ", data);
      getAllUsersAsync();
    })
    .catch((err) => {
      console.error("Error deleting user: ", err);
    });
}

regForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (true) {
    const userData = {
      first_name: userName.value,
      last_name: userSurname.value,
      phone: userPhone.value,
      id_number: userPersonalID.value,
      email: userEmail.value,
      gender: regForm.querySelector("[name='gender']:checked").value,
      zip_code: userZip.value,
    };
    console.log(userData);
    tableRow.innerHTML += createNewUser(userData);

    //  TODO: თუ userId.value არის ცარიელი (თავიდან ცარიელია) მაშინ უნდა შევქმნათ  -->  createNewUser(userData);
    // createNewUser(userData);

    // თუ დაედითებას ვაკეთებთ, ჩვენ ვანიჭებთ მნიშვნელობას userActions ფუნქციაში
    // TODO: თუ userId.value არის (არაა ცარიელი სტრინგი) მაშინ უნდა დავაედიტოთ, (როცა ფორმს ედითის ღილაკის შემდეგ იუზერის ინფუთით ვავსებთ, ვაედითებთ და ვასაბმითებთ) -->  updateUser(userData);
  }
});
console.log(document.querySelector("button").dataset);
