
var author = "";
var source = "";
var publisher = "";
var date = "";

function handleFetch() {
    var isbnNumber = document.querySelector('#isbn').value;
    if (!isbnNumber || isbnNumber < 0) {
        alert("Please input the isbn number");
        return;
    }

    if (!(isbnNumber.length === 10 || isbnNumber.length === 13)) {
        alert("Please input the correct isbn number");
        return;
    }

    var url = 'https://www.googleapis.com/books/v1/volumes?q=' + isbnNumber;
    console.log(url);
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (jsonResponse) {
        var item = jsonResponse.items[0];
        var info = item.volumeInfo;
        if (info.authors === undefined) author = '';else author = info.authors[0];

        source = info.title;
        publisher = info.publisher;
        date = info.publishedDate;
        var image = void 0;
        if (info.imageLinks === undefined) image = '';else image = info.imageLinks.thumbnail;

        ReactDOM.render(React.createElement(
            "div",
            null,
            React.createElement(
                "p",
                null,
                "Author: ",
                author
            ),
            React.createElement(
                "p",
                null,
                "Source Title: ",
                source
            ),
            React.createElement(
                "p",
                null,
                "Publisher: ",
                publisher
            ),
            React.createElement(
                "p",
                null,
                "Published Date: ",
                date
            ),
            React.createElement(
                "figure",
                null,
                React.createElement("img", { src: image, alt: "image of the book" }),
                React.createElement(
                    "figcaption",
                    null,
                    "Title Page Image"
                )
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "button",
                    { onClick: updateInputField, id: "cc" },
                    "Create Citation"
                ),
                React.createElement(
                    "button",
                    { onClick: backToOriginalPage, id: "back" },
                    "Back"
                )
            )
        ), document.getElementById('book-info'));
    }).catch(function (error) {
        ReactDOM.render(React.createElement(
            "p",
            null,
            "You met ",
            error,
            " error."
        ), document.getElementById('book-info'));
    });

    //remove isbn input field
    ReactDOM.render(React.createElement("div", null), document.getElementById('input-field'));
}

function updateInputField() {
    changeDateFormat(date);
    console.log(date);
    ReactDOM.render(React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            { className: "required-field" },
            React.createElement(
                "h3",
                null,
                "Required Field: "
            ),
            React.createElement(
                "p",
                null,
                "Title of Source: ",
                React.createElement("input", { type: "text", name: "Source Title", id: "source", defaultValue: source, required: true })
            )
        ),
        React.createElement(
            "div",
            { className: "suggested-field" },
            React.createElement(
                "h3",
                null,
                "Suggested Field: "
            ),
            React.createElement(
                "p",
                null,
                "Author: ",
                React.createElement("input", { type: "text", name: "Author", id: "author", defaultValue: author })
            ),
            React.createElement(
                "label",
                null,
                "Responsibility of other contributor: "
            ),
            React.createElement(
                "select",
                { id: "responsibility", name: "other-contributors-responsibility" },
                React.createElement("option", null),
                React.createElement(
                    "option",
                    { value: "editor" },
                    "editor"
                ),
                React.createElement(
                    "option",
                    { value: "translator" },
                    "translator"
                )
            ),
            React.createElement(
                "p",
                null,
                "Other Contributor Name: ",
                React.createElement("input", { type: "text", name: "other contributors", id: "contributors", placeholder: "editor, translator, etc." })
            ),
            React.createElement(
                "p",
                null,
                "Publisher: ",
                React.createElement("input", { type: "text", name: "publisher", id: "publisher", defaultValue: publisher })
            ),
            React.createElement(
                "p",
                null,
                "Publication Date: ",
                React.createElement("input", { type: "text", name: "date", id: "date", defaultValue: date })
            ),
            React.createElement(
                "p",
                null,
                "Location: ",
                React.createElement("input", { type: "text", name: "location", id: "locate", placeholder: "Page Number or URL" })
            )
        ),
        React.createElement(
            "div",
            { className: "optional-field" },
            React.createElement(
                "h3",
                null,
                "Optional Field: "
            ),
            React.createElement(
                "p",
                null,
                "Version: ",
                React.createElement("input", { type: "text", name: "version", id: "version" })
            ),
            React.createElement(
                "p",
                null,
                "Number: ",
                React.createElement("input", { type: "text", name: "number", id: "number", placeholder: "volume and issue numbers" })
            )
        ),
        React.createElement(
            "button",
            { onClick: handleCitation },
            "Cite"
        )
    ), document.getElementById('input-field'));

    //clean the book info
    ReactDOM.render(React.createElement("p", null), document.getElementById('book-info'));
}

function handleCitation() {
    source = document.querySelector("#source").value;
    if (!source) {
        alert("A citation should have source.");
        return;
    }
    author = document.querySelector("#author").value;
    var contributors = document.querySelector("#contributors").value;
    var version = document.querySelector("#version").value;
    var number = document.querySelector("#number").value;
    publisher = document.querySelector("#publisher").value;
    date = document.querySelector("#date").value;
    var location = document.querySelector("#locate").value;

    //dropdown menu options
    var responsibility = document.querySelector('#responsibility').value;

    //setup contributors
    if (contributors && !responsibility) {
        alert("You should assign a responsibility to other contributors");
        return;
    }
    if (contributors && responsibility) {
        if (responsibility === 'editor') contributors = "Edited by " + contributors;
        if (responsibility === 'translator') contributors = "Translated by " + contributors;
    }

    //find first name and last name
    var nameArr = author.split(' ');
    var lastName = "";
    var firstName = "";
    if (nameArr.length === 1 && author) {
        lastName = nameArr[0] + '. ';
    } else if (!author) {} else {
        lastName = nameArr[nameArr.length - 1] + ', ';
        for (var i = 0; i < nameArr.length - 1; i++) {
            firstName += ' ' + nameArr[i];
        }
        firstName += '. ';
    }

    source = source ? source + ". " : "";
    contributors = contributors ? contributors + ", " : "";
    version = version ? version + ", " : "";
    number = number ? number + ", " : "";
    publisher = publisher ? publisher + ", " : "";
    date = date ? date + ", " : "";
    location = location ? location + ". " : "";

    var latter = contributors + version + number + publisher + date + location;

    //to check if source is the last element
    if (latter) {
        latter = latter.substring(0, latter.length - 2) + ".";
    }
    ReactDOM.render(React.createElement(
        "span",
        null,
        lastName + firstName,
        React.createElement(
            "span",
            null,
            React.createElement(
                "i",
                null,
                source
            )
        ),
        latter
    ), document.getElementById('output'));

    //Go back to the original isbn page
    ReactDOM.render(React.createElement(
        "button",
        { onClick: backToOriginalPage },
        "Back"
    ), document.getElementById('input-field'));
}

function backToOriginalPage() {
    ReactDOM.render(React.createElement(
        "div",
        null,
        React.createElement(
            "p",
            null,
            "ISBN Number: ",
            React.createElement("input", { type: "number", name: "ISBN Number", id: "isbn", placeholder: "10 or 13 digits number" })
        ),
        React.createElement(
            "button",
            { onClick: handleFetch },
            "Search"
        )
    ), document.getElementById('input-field'));
    ReactDOM.unmountComponentAtNode(document.getElementById('output'));
    document.querySelector('#output').textContent = '';

    ReactDOM.render(React.createElement("div", null), document.getElementById('book-info'));
}

function changeDateFormat(val) {
    if (!val) return;
    var dateArr = val.split('-');
    //console.log(dateArr);
    var year = '';
    var month = '';
    var day = '';
    for (var i = 0; i < dateArr.length; i++) {
        if (i === 0) year = dateArr[0];
        if (i === 1) month = dateArr[1];
        if (i === 2) day = dateArr[2];
    }

    if (month === '01') month = 'Jan.';else if (month === '02') month = 'Feb.';else if (month === '03') month = 'March';else if (month === '04') month = 'April';else if (month === '05') month = 'May';else if (month === '06') month = 'June';else if (month === '07') month = 'July';else if (month === '08') month = 'Aug.';else if (month === '09') month = 'Sept.';else if (month === '10') month = 'Oct.';else if (month === '11') month = 'Nov.';else if (month === '12') month = 'Dec.';else month = '';
    date = day + ' ' + month + ' ' + year;
    //console.log(date);
}

function icon() {
    var x = document.getElementById("nav");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

var search_btn = document.getElementById("isbn-search-button");
search_btn.addEventListener('click', handleFetch);