const addNewUserBtn = document.getElementById("addNewUser");
const userFormDialog = document.getElementById("userFormDialog");
const tableRow = document.getElementById("tableRows");

try {
  addNewUserBtn.addEventListener("click", () => {
    regForm.reset();
    userId.value = "";
    userFormDialog.showModal();
  });

  userFormDialog.querySelector("#close").addEventListener("click", () => {
    userFormDialog.close();
  });
} catch (err) {
  console.log("Element not found: ", err);
}
const createUserUrl = "https://borjomi.loremipsum.ge/api/register",
  getAllUsersUrl = "https://borjomi.loremipsum.ge/api/all-users",
  getSingleUserUrl = "https://borjomi.loremipsum.ge/api/get-user/",
  updateUserUrl = "https://borjomi.loremipsum.ge/api/update-user/",
  deleteUserUrl = "https://borjomi.loremipsum.ge/api/delete-user/";

const regForm = document.querySelector("#registration-form"),
  userName = regForm.querySelector("#userName"),
  userSurname = regForm.querySelector("#userSurname"),
  userEmail = regForm.querySelector("#userEmail"),
  userPhone = regForm.querySelector("#userPhone"),
  userPersonalID = regForm.querySelector("#userPersonalId"),
  userZip = regForm.querySelector("#userZipCode"),
  userId = regForm.querySelector("#userId");

async function getAllUsersAsync() {
  try {
    const response = await fetch(getAllUsersUrl);
    const data = await response.json();

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
    addRowEventListeners();
  } catch (err) {
    console.log("error message: ", err);
  }
}

getAllUsersAsync();

function addRowEventListeners() {
  const deleteButtons = document.querySelectorAll(".delete");
  const editButtons = document.querySelectorAll(".edit");

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteUser(btn.dataset.userId);
    });
  });

  editButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const userData = await getSingleUser(btn.dataset.userId);

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
}

async function getSingleUser(id) {
  try {
    const response = await fetch(getSingleUserUrl + id);
    const data = await response.json();
    return data.users;
  } catch (e) {
    console.log("Error - ", e);
  }
}

function createNewUser(userData) {
  fetch(createUserUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
    .then((res) => res.json())
    .then(() => {
      regForm.reset();
      userFormDialog.close();
      getAllUsersAsync();
    });
}

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
}

function deleteUser(id) {
  fetch(deleteUserUrl + id, { method: "DELETE" })
    .then((res) => res.json())
    .then(() => getAllUsersAsync());
}

regForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userData = {
    id: userId.value,
    first_name: userName.value,
    last_name: userSurname.value,
    phone: userPhone.value,
    id_number: userPersonalID.value,
    email: userEmail.value,
    gender: regForm.querySelector("[name='gender']:checked").value,
    zip_code: userZip.value,
  };

  if (userId.value === "") {
    createNewUser(userData);
  } else {
    updateUser(userData);
  }
});
