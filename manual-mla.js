function handleClick() {
    var source = document.querySelector("#source").value;
    if (!source) alert("A citation should have source.");else {
        var author = document.querySelector("#author").value;
        var container = document.querySelector("#container").value;
        var contributors = document.querySelector("#contributors").value;
        var version = document.querySelector("#version").value;
        var number = document.querySelector("#number").value;
        var publisher = document.querySelector("#publisher").value;
        var date = document.querySelector("#date").value;
        var location = document.querySelector("#locate").value;

        //dropdown menu options
        var type = document.querySelector('#type').value;
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
        container = container ? container + ", " : "";
        contributors = contributors ? contributors + ", " : "";
        version = version ? version + ", " : "";
        number = number ? number + ", " : "";
        publisher = publisher ? publisher + ", " : "";
        date = date ? date + ", " : "";
        location = location ? location + ". " : "";

        var result = void 0;
        var latter = contributors + version + number + publisher + date + location;

        //add quotation mark on source or turning it to italics
        if (!container) {
            ReactDOM.unmountComponentAtNode(document.getElementById('output'));
            if (type === 'website') {
                source = '"' + source.substring(0, source.length - 1) + '" ';
                result = lastName + firstName + source + contributors + version + number + publisher + date + location;
                //to check if source is the last element
                if (result.substring(result.length - 2, result.length - 1) === '"') {
                    document.querySelector("#output").textContent = result;
                } else {
                    document.querySelector("#output").textContent = result.substring(0, result.length - 2) + ".";
                }
            }
            if (type === 'book') {
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
            }
        } else {
            source = '"' + source.substring(0, source.length - 1) + '" ';
            if (!latter) container = container.substring(0, container.length - 2) + '.';else latter = latter.substring(0, latter.length - 2) + ".";
            ReactDOM.render(React.createElement(
                "span",
                null,
                lastName + firstName + source,
                React.createElement(
                    "span",
                    null,
                    React.createElement(
                        "i",
                        null,
                        container
                    )
                ),
                latter
            ), document.getElementById('output'));
        }
    }
}

function icon() {
    var x = document.getElementById("nav");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

var button = document.getElementById("cite-button");
button.addEventListener('click', handleClick);