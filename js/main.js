var Request = {};
Request.execute = function(url, callback, method, data) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("readystatechange", function() {
        if (this.readyState !== 4) {
            return;
        }
        callback(this.response);
    });
    var dataToSend = null;
    if (data) {
        dataToSend = JSON.stringify(data);
    }
    xhr.send(dataToSend);
};
Request.get = function(url, callback) {
    Request.execute(url, callback, "get");
};
Request.post = function(url, callback, data) {
    Request.execute(url, callback, "post", data);
};
Request.put = function(url, callback, data) {
    Request.execute(url, callback, "put", data);
};
Request.delete = function(url, callback) {
    Request.execute(url, callback, "delete");
};


var table = document.getElementById("users-table");

function addCountriesToSelect(countries) {
    var country = document.getElementById("country");
    for (var i = 0; i < countries.length; i++) {
        var count_count = countries[i];

        var cc = document.createElement("option");
        cc.innerText = count_count;

        country.appendChild(cc);
    }
}
Request.get("/countries", addCountriesToSelect);
function createCell(data, row) {
    var td = document.createElement("td");
    td.innerHTML = data;
    row.appendChild(td);
}

function createButton(text) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = text;
    return btn;
}
Request.get("/user", function(json) {
    for (var i = 0; i < json.length; i++) {
        var obj_info = json[i];
        addUserToTable(obj_info);
    }
});

///////////////////_________BUTTON ________________REMOVE___________________//////////////////////////////

// table.addEventListener("click", function (e) {
//         console.log(e.target.tagName);
//         if (e.target.tagName.toLowerCase() == "button") {
//             remove_tr(e.target);
//         }
//     }
// );

function remove_tr(id) {
    Request.delete("/user?id=" + id, function() {
        var row = document.getElementById(id);
        row.parentNode.removeChild(row);
    });
}

////////////////////////__________________FORMS_______BUTTON_____EDIT__________________/////////////////
table.addEventListener("click", function (e) {
        if (e.target.tagName.toLowerCase() == "button") {
            var btn = e.target;
            if (btn.classList.contains("remove-button")) {
                remove_tr(btn.id);
            } else if (btn.classList.contains("edit-button")) {
                edit_tr(e.target);
            }
        }
    }
);

function edit_tr(btn_edit) {
    Request.get("/user?id=" + btn_edit.id, function(edit_json) {
            vForm.classList.remove("users-edit-hidden");

            vForm.id.value = edit_json.id;
            vForm.fullname.value = edit_json.fullName;
            vForm.birthday.value = edit_json.birthday;
            vForm.profession.value = edit_json.profession;
            vForm.address.value = edit_json.address;
            vForm.country.value = edit_json.country;
            vForm["short-info"].value = edit_json.shortInfo;
            vForm["full-info"].value = edit_json.fullInfo;
    });
}


///////////////////_______________FORMS___________BUTTON___________________////////////////////////
var vForm = document.forms["users-edit"];
var btn_create = document.getElementById("create"),
    btn_cancel = document.getElementById("cancel");

btn_cancel.addEventListener("click", function (e) {
    e.preventDefault();
    vForm.reset();
    vForm.classList.add("users-edit-hidden");
});

btn_create.addEventListener("click", function () {
    vForm.classList.remove("users-edit-hidden");
    vForm.reset();
});
/////////////////////__________END____FORMS____BUTTON_________________///////////////////////

function addUserToTable(user) {
    var row = document.createElement("tr");
    row.id = user.id;
    createCell(user.fullName, row);
    createCell(user.profession, row);
    createCell(user.shortInfo, row);

    var td = document.createElement("td");
    var btn_remv = createButton("Remove");
    btn_remv.id = user.id;
    btn_remv.classList.add("remove-button");
    td.appendChild(btn_remv);

    var btn_edit = createButton("Edit");
    btn_edit.id = user.id;
    btn_edit.classList.add("edit-button");
    td.appendChild(btn_edit);

    row.appendChild(td);
    table.appendChild(row);
}

vForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var fn = document.getElementById("fullname"),
        bd = document.getElementById("birthday"),
        pf = document.getElementById("profession"),
        add = document.getElementById("address"),
        ctr = document.getElementById("country"),
        sI = document.getElementById("short-info"),
        fI = document.getElementById("full-info");

    var obj = {
        fullName: fn.value,
        birthday: bd.value,
        profession: pf.value,
        address: add.value,
        country: ctr.value,
        shortInfo: sI.value,
        fullInfo: fI.value
    };

    Request.post("/user", addUserToTable, obj);
    vForm.classList.add("users-edit-hidden");
});