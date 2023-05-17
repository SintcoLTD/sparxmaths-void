console.log("Script is running");

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}


// CSS 
document.head.insertAdjacentHTML('beforeend','<style>' + themeStyles + '</style>');
document.head.insertAdjacentHTML('beforeend','<style>' + darkModeStyles + '</style>');

const grey = '#f8f8f7';
const orange = '#f46815';

console.log(JSON.parse(localStorage.getItem('sparx-data')));

const mutationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function() {
        main();
    });
});

mutationObserver.observe(document.documentElement, {
    attributeFilter: [ "class" ],
    characterData: true,
    childList: true,
    subtree: true,
    characterDataOldValue: true
});


// DATABASE
const appName = 'data-pddjp';
const apiKey = 'ZTxLUr2NMrbV12Bn5CGA5qGfmoG48pBhQAyEnPsClNqmVsPmAe4OM4R8C2I5T46z';
const mongoDatabaseURL = `https://data.mongodb-api.com/app/${appName}/endpoint/data/v1/action/`;
let authorisedToken = null;
let tokenLife = 0;
let userDocumentId = null;
let userName = null;
let userData = null;
let question = null;
let answer = null;

function getTimestampInSeconds () {
    return Math.floor(Date.now() / 1000)
}

function md5(inputString) {
    var hc="0123456789abcdef";
    function rh(n) {var j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
    function ad(x,y) {var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
    function rl(n,c)            {return (n<<c)|(n>>>(32-c));}
    function cm(q,a,b,x,s,t)    {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
    function ff(a,b,c,d,x,s,t)  {return cm((b&c)|((~b)&d),a,b,x,s,t);}
    function gg(a,b,c,d,x,s,t)  {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
    function hh(a,b,c,d,x,s,t)  {return cm(b^c^d,a,b,x,s,t);}
    function ii(a,b,c,d,x,s,t)  {return cm(c^(b|(~d)),a,b,x,s,t);}
    function sb(x) {
        var i;var nblk=((x.length+8)>>6)+1;var blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
        for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
        blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
    }
    var i,x=sb(""+inputString),a=1732584193,b=-271733879,c=-1732584194,d=271733878,olda,oldb,oldc,oldd;
    for(i=0;i<x.length;i+=16) {olda=a;oldb=b;oldc=c;oldd=d;
        a=ff(a,b,c,d,x[i+ 0], 7, -680876936);d=ff(d,a,b,c,x[i+ 1],12, -389564586);c=ff(c,d,a,b,x[i+ 2],17,  606105819);
        b=ff(b,c,d,a,x[i+ 3],22,-1044525330);a=ff(a,b,c,d,x[i+ 4], 7, -176418897);d=ff(d,a,b,c,x[i+ 5],12, 1200080426);
        c=ff(c,d,a,b,x[i+ 6],17,-1473231341);b=ff(b,c,d,a,x[i+ 7],22,  -45705983);a=ff(a,b,c,d,x[i+ 8], 7, 1770035416);
        d=ff(d,a,b,c,x[i+ 9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,     -42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
        a=ff(a,b,c,d,x[i+12], 7, 1804603682);d=ff(d,a,b,c,x[i+13],12,  -40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);
        b=ff(b,c,d,a,x[i+15],22, 1236535329);a=gg(a,b,c,d,x[i+ 1], 5, -165796510);d=gg(d,a,b,c,x[i+ 6], 9,-1069501632);
        c=gg(c,d,a,b,x[i+11],14,  643717713);b=gg(b,c,d,a,x[i+ 0],20, -373897302);a=gg(a,b,c,d,x[i+ 5], 5, -701558691);
        d=gg(d,a,b,c,x[i+10], 9,   38016083);c=gg(c,d,a,b,x[i+15],14, -660478335);b=gg(b,c,d,a,x[i+ 4],20, -405537848);
        a=gg(a,b,c,d,x[i+ 9], 5,  568446438);d=gg(d,a,b,c,x[i+14], 9,-1019803690);c=gg(c,d,a,b,x[i+ 3],14, -187363961);
        b=gg(b,c,d,a,x[i+ 8],20, 1163531501);a=gg(a,b,c,d,x[i+13], 5,-1444681467);d=gg(d,a,b,c,x[i+ 2], 9,  -51403784);
        c=gg(c,d,a,b,x[i+ 7],14, 1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);a=hh(a,b,c,d,x[i+ 5], 4,    -378558);
        d=hh(d,a,b,c,x[i+ 8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16, 1839030562);b=hh(b,c,d,a,x[i+14],23,  -35309556);
        a=hh(a,b,c,d,x[i+ 1], 4,-1530992060);d=hh(d,a,b,c,x[i+ 4],11, 1272893353);c=hh(c,d,a,b,x[i+ 7],16, -155497632);
        b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13], 4,  681279174);d=hh(d,a,b,c,x[i+ 0],11, -358537222);
        c=hh(c,d,a,b,x[i+ 3],16, -722521979);b=hh(b,c,d,a,x[i+ 6],23,   76029189);a=hh(a,b,c,d,x[i+ 9], 4, -640364487);
        d=hh(d,a,b,c,x[i+12],11, -421815835);c=hh(c,d,a,b,x[i+15],16,  530742520);b=hh(b,c,d,a,x[i+ 2],23, -995338651);
        a=ii(a,b,c,d,x[i+ 0], 6, -198630844);d=ii(d,a,b,c,x[i+ 7],10, 1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);
        b=ii(b,c,d,a,x[i+ 5],21,  -57434055);a=ii(a,b,c,d,x[i+12], 6, 1700485571);d=ii(d,a,b,c,x[i+ 3],10,-1894986606);
        c=ii(c,d,a,b,x[i+10],15,   -1051523);b=ii(b,c,d,a,x[i+ 1],21,-2054922799);a=ii(a,b,c,d,x[i+ 8], 6, 1873313359);
        d=ii(d,a,b,c,x[i+15],10,  -30611744);c=ii(c,d,a,b,x[i+ 6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21, 1309151649);
        a=ii(a,b,c,d,x[i+ 4], 6, -145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+ 2],15,  718787259);
        b=ii(b,c,d,a,x[i+ 9],21, -343485551);a=ad(a,olda);b=ad(b,oldb);c=ad(c,oldc);d=ad(d,oldd);
    }
    return rh(a)+rh(b)+rh(c)+rh(d);
}

async function checkUser() {
    visits = await(await fetch(counterURL)).json();

    let response = await contactDatabase('find', 'users', 'user-data'); 

    // Initialise the 'users' collection if it doesn't exist
    if (response.documents.length == 0) {
        await contactDatabase('insertOne', 'users', 'user-data', {users: {}});
        response = await contactDatabase('find', 'users', 'user-data'); 
    }

    const documentId = response.documents[0]._id; 
    const users = response.documents[0].users;

    hash = md5(userName)

    if (!(hash in users)) {
        // Create a new document for the user's answers in the 'answers' database
        let newDocumentId = await (await contactDatabase('insertOne', 'answers', 'user-data', {answers: {}})).insertedId;

        let dateObject = new Date().toJSON();
        let date = dateObject.slice(0, 10);
        let time = dateObject.slice(11, 19);
        users[hash] = {};
        users[hash].id = newDocumentId;
        users[hash].user = userName;
        users[hash].created = `${date} ${time}`;
        users[hash]['last-login'] = `${date} ${time}`;
        contactDatabase('updateOne', 'users', 'user-data', [{"users": users}, documentId]);
    } 

    userDocumentId = users[hash].id;

    // Check if the ID points to an existing document in the 'answers' database
    response = await contactDatabase('findOne', 'answers', 'user-data', { "_id": { "$oid": users[hash].id }}); 

    let dateObject = new Date().toJSON();
    let date = dateObject.slice(0, 10);
    let time = dateObject.slice(11, 19);
    users[hash]['last-login'] = `${date} ${time}`;
    contactDatabase('updateOne', 'users', 'user-data', [{"users": users}, documentId]);
    
    let userDocument = await( await contactDatabase('findOne', 'answers', 'user-data', { "_id": { "$oid": userDocumentId }})).document
    
    if (userDocument === null) {
        // Create a new document for the user's answers in the 'answers' database
        let newDocumentId = await (await contactDatabase('insertOne', 'answers', 'user-data', {answers: {}})).insertedId;

        users[hash].id = newDocumentId;
        
        contactDatabase('updateOne', 'users', 'user-data', [{"users": users}, documentId]);
    } else {
        userData = userDocument.answers;
    }
}

async function authorise() {
    timeAlive = getTimestampInSeconds() - tokenLife;
    
    if (timeAlive >= 1740) {
        let jsondata = {
            'key': apiKey
        }

        let settings = {
            "async": true,
            "crossDomain": true,
            "method": "POST",
            "headers": {
                'Content-Type': 'application/json'
            },
            'processData': false,
            body: JSON.stringify(jsondata)
        }

        let response = await (await fetch(`https://realm.mongodb.com/api/client/v2.0/app/${appName}/auth/providers/api-key/login`, settings)).json();
        authorisedToken = response.access_token;

        tokenLife = getTimestampInSeconds();
    }

    return authorisedToken;
}

async function contactDatabase(action, database, collection, content=false) {
    let token = await authorise();

    const jsonData = {
        'database': database,
        'collection': collection,
        'dataSource': 'Sparx',
    }

    if (content !== false && action == 'updateOne') {
        jsonData.filter = { "_id": { "$oid": content[1] } };
        jsonData.update = content[0];
    } else if (content !== false && action == 'findOne') {
        jsonData.filter = content;
    } else if (content !== false) {
        jsonData.document = content;
    }

    const settings = {
        "async": true,
        "crossDomain": true,
        "method": "POST",
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        'processData': false,
        body: JSON.stringify(jsonData)
    }

    response = await (await fetch(mongoDatabaseURL + action, settings)).json();
    
    return response
}

async function main() {    
    if (document.querySelector('.package-container') !== null) { showThemes(); }

    if (document.querySelector('.status-bar-label.status-bar-label-username') !== null && userName == null) { userName = document.querySelector('.status-bar-label.status-bar-label-username').textContent }

    const xpElement = document.querySelector('.status-bar-label-text') //XP header
    if (xpElement !== null) {
        xpElement.textContent = "Made by Najm A";
    } 

    // Display stored answer
    let correctStatusElement = document.querySelector('.page.result .result-inner .correct');
    if (correctStatusElement !== null && document.querySelector('#shown-answer') === null) {
        try {
            const bookworkCodeElement = document.querySelector('.bookwork-code');
            let bookworkCode = bookworkCodeElement.textContent;
            bookworkCode = bookworkCode.replace("Bookwork code: ", '');
            
            const sparxData = JSON.parse(localStorage.getItem('sparx-data'));
            let answer = sparxData[bookworkCode];
            answer = answer.map(element => element.replace('\n', ''));
            answer = answer.map(element => element.replace(/\\\\/g, '\\'));

            // Show saved answer 
            if (answer.every(hasSource)) {
                const divNode = document.createElement('div');
                const imageNode = document.createElement('img');
                imageNode.src = answer.toString();
                imageNode.setAttribute('id', 'shown-answer');
                imageNode.style['height'] = "4rem";

                divNode.appendChild(imageNode);
                divNode.style['margin-bottom'] = '20px';
                divNode.style['margin-top'] = '20px';
                divNode.style.color = grey;
                document.querySelector('.result-inner').append(divNode);
            } else {
                let answers = answer.join(', ');

                const textNode = document.createElement('span');
                textNode.textContent = `Answer: ${answers}`;
                textNode.style['font-size'] = '2.5rem';
                textNode.style['color'] = 'white';
                textNode.setAttribute('id', 'shown-answer');

                const divNode = document.createElement('div');
                divNode.style['display'] = 'flex';
                divNode.style['align-items'] = 'center';
                divNode.style['justify-content'] = 'center';

                divNode.appendChild(textNode);
                divNode.style['margin-bottom'] = '20px';
                divNode.style['margin-top'] = '20px';
                document.querySelector('.result-inner').append(divNode);

                katex.render(answers, document.getElementById('shown-answer'), {
                    throwOnError: false
                });
            }
        } catch(err) {console.log(err)}
    }

    // Display correct bookwork code 
    const bookworkCodeElement = document.querySelector('.wac-text-container .bookwork-code');
    if (bookworkCodeElement !== null && document.querySelector('#custom-answer') === null) {
        try {
            let bookworkCode = bookworkCodeElement.textContent;
            bookworkCode = bookworkCode.replace("Bookwork code: ", '');
            console.log(bookworkCode);

            const sparxData = JSON.parse(localStorage.getItem('sparx-data'));
            let bookworkAnswer = sparxData[bookworkCode];
            bookworkAnswer = bookworkAnswer.map(element => element.replace('\n', ''));
            bookworkAnswer = bookworkAnswer.map(element => element.replace(/\\\\/g, '\\'));
            console.log(bookworkAnswer);

            // Show saved answer 
            if (bookworkAnswer.every(hasSource)) {
                const divNode = document.createElement('div');
                const imageNode = document.createElement('img');
                imageNode.src = bookworkAnswer.toString();
                imageNode.setAttribute('id', 'custom-answer');
                imageNode.style['width'] = "50%";

                divNode.appendChild(imageNode);
                divNode.style['margin-bottom'] = '20px';
                divNode.style.color = grey;
                document.querySelector('.wac-text-container').append(divNode);
            } else {
                let answers = bookworkAnswer.join(', ');
                const textNode = document.createElement('span');
                textNode.textContent = `Answer: ${answers}`;
                textNode.style['color'] = 'white';

                const divNode = document.createElement('div');
                divNode.style['display'] = 'flex';
                divNode.style['align-items'] = 'center';
                divNode.style['justify-content'] = 'center';
                textNode.setAttribute('id', 'custom-answer');

                divNode.appendChild(textNode);
                divNode.style['margin-bottom'] = '20px';
                document.querySelector('.wac-text-container').append(divNode);

                katex.render(answers, document.getElementById('custom-answer'), {
                    throwOnError: false
                });
            }

            // Get choices
            answerOptions = document.querySelectorAll('.choice-wac-options .item');
            if (answerOptions !== null) {
                for (let i = 0; i < answerOptions.length; i++) {
                    answerOption = answerOptions[i].textContent;
                    let similarityCount = 0
                    for (let a = 0; a < bookworkAnswer.length; a++) {
                        if (answerOption.includes(bookworkAnswer[a])) {similarityCount++;}
                    }
                    if (similarityCount == bookworkAnswer.length){
                        answerOptions[i].style.border = '5px solid var(--light)';
                    }
                    let answerArray = bookworkAnswer.join('');
                    answerArray = answerArray.split('');
                    uniques = answerArray.unique();
                    answerOptions[i].querySelector('.answer-markup.choice-wac-option').style.border = '5px solid var(--orange)';
                    for (let u = 0; u < uniques.length; u++) {
                        if (!(answerOption.includes(uniques[u]))) {
                            answerOptions[i].querySelector('.answer-markup.choice-wac-option').style.border = 'none';
                        }
                    }
                }
            }
        } catch (err) {console.log(err)}
    }

    let questionContainer = document.querySelector('.question');
    if (questionContainer !== null) {
        question = questionContainer.innerText;
        questionImages = document.querySelectorAll('[data-test-target="image-img"]');

        question = question.replace(/\r?\n|\r/g, '');

        if (questionImages.length == 0 || questionImages[0]) { return }
        else {
            questionImages.forEach(function(image) {
                question += `$$ ${image.currentSrc}`;
            })
        }
    }
}


// SUBMITS ANSWER 
async function sendAnswerToDatabase() {
    await sleep(500);

    let correctStatusElement = document.querySelector('.page.result .result-inner .correct');
    console.log(correctStatusElement);
    if (correctStatusElement !== null) {
        if (question in userData) {
            console.log("Question already in database");
            return;
        }
    
        // Update MongoDB database if answer is correct
        try {
            console.log("POSTing answer data to database")
            let dateObject = new Date().toJSON();
            let date = dateObject.slice(0, 10);
            let time = dateObject.slice(11, 19);
            let questionDict = {};
            questionDict.answer = answer;
            questionDict.time = `${date} ${time}`;
            userData[question] = questionDict;
            contactDatabase('updateOne', 'answers', 'user-data', [{"answers": userData}, userDocumentId]);
        } catch(err) {console.log(err)}
    }
}

document.addEventListener("click", function(e) {
    if(e.target) {
        try {
            if (
                (e.target.id == "skill-delivery-submit-button" && e.target.innerText == "Submit") ||
                (e.target.className == "button-text" && e.target.textContent == "Submit") || 
                (e.target.className == "button-all" && e.target.textContent == "Submit") || 
                (e.target.className == "button-icon button-icon-right" && e.target.parentElement.innerText == "Submit") ||
                (e.target.parentElement.className == "button-icon button-icon-right" && e.target.parentElement.parentElement.innerText == "Submit") ||
                (e.target.parentElement.parentElement.className == "button-icon button-icon-right" && e.target.parentElement.parentElement.parentElement.innerText == "Submit")) {

                console.log("---PROCESSING ANSWER---");
    
                const bookworkCodeElement = document.querySelector('.bookwork-code');
                let bookworkCode = bookworkCodeElement.textContent;
                bookworkCode = bookworkCode.replace("Bookwork code: ", '');
    
                answer = getInput(bookworkCode);
                updateLocalStorage('sparx-data', bookworkCode, answer);

                sendAnswerToDatabase();
            }
        } catch(err) {}
    }
});

document.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        // Submit answer
        const submitButton = document.querySelector('#skill-delivery-submit-button');
        if (submitButton !== null) {
            console.log("---PROCESSING ANSWER---");

            const bookworkCodeElement = document.querySelector('.bookwork-code');
            let bookworkCode = bookworkCodeElement.textContent;
            bookworkCode = bookworkCode.replace("Bookwork code: ", '');

            answer = getInput(bookworkCode);
            updateLocalStorage('sparx-data', bookworkCode, answer);

            sendAnswerToDatabase();
        }

        // Select next task
        const taskItems = document.querySelectorAll('.taskitem-selectable');
        if (taskItems.length > 0) {
            taskItems.forEach(function(taskItem) {
                if (!(taskItem.classList.contains('done'))) {
                    taskItem.click();
                }
            });
        }

        const revisionItems = document.querySelectorAll('.revision-task-item.btn-menu-item');
        if (revisionItems.length > 0) {
            revisionItems.forEach(function(revisionItem) {
                if (revisionItem.querySelector('.pill.done') === null) {
                    revisionItem.click();
                }
            });
        }

        // Select auto higher or lower
        const minigames = document.querySelectorAll('.minigame-choice-card');
        if (minigames.length > 0) {
            minigames.forEach(function(minigame) {
                if (minigame.querySelector('.minigame-title').textContent == 'Auto Higher or Lower?') {
                    minigame.click();
                }
            });
        }
    }
});


// FUNCTIONS

Array.prototype.unique = function() {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        if (!arr.includes(this[i]) && isDigit(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}

function isDigit(c) {
    return c >= '0' && c <= '9';
}

function getLocalStorage(itemName) {
    if (localStorage.getItem(itemName) === null) {
        return null
    } else {
        return JSON.parse(localStorage.getItem(itemName));
    }
}

function updateLocalStorage(itemName, key, newValue) {
    console.log("Updating database");

    if (localStorage.getItem(itemName) === null) {
        const defaultJSON = {"Placeholder": 0};
        localStorage.setItem(itemName, JSON.stringify(defaultJSON));
    }

    let item = JSON.parse(localStorage.getItem(itemName));
    item[key] = newValue;

    console.log("New value: ", item);

    console.log(key, newValue);

    localStorage.setItem(itemName, JSON.stringify(item));

    console.log("Database updated");
}

function hasCurly(answer) {
    if (answer.toString().includes('{')  && answer.toString().includes('}')) {
        return true
    } else { return false}
}

function hasSource(answer) {
    if (answer.toString().includes('https') || answer.toString().includes('http')) {
        return true
    } else { return false}
}

//function showThemes() {
//    if (!(document.querySelector('.themes-container') === null)) { return }
//
//    const container = document.querySelector('.package-container');
//
//    let textNode = document.createElement('b');
//    let themesContainer = document.createElement('section');
//    let themesList = document.createElement('ul');
//    textNode.innerText = 'Themes';
//    themesContainer.setAttribute('class', 'themes-container');
//
//    for (const [index, theme] of Object.entries(themes)) {
//        let themeNode = document.createElement('li');
//        for (const [_, colour] of Object.entries(theme)) {
//            let colourNode = document.createElement('div');
//            colourNode.style['background-color'] = colour;
//            themeNode.appendChild(colourNode);
//        };
//        themeNode.addEventListener('click', function() {
//            console.log(`You clicked theme ${index}`);
//            updateLocalStorage('colour-theme', 'theme', index)
//            document.documentElement.style.setProperty('--darkest', theme['darkest']);
//            document.documentElement.style.setProperty('--dark', theme['dark']);
//            document.documentElement.style.setProperty('--light', theme['light']);
//            document.documentElement.style.setProperty('--lightest', theme['lightest']);
//        });
//        themesList.appendChild(themeNode);
//    };
//
//    themesContainer.appendChild(textNode);
//    themesContainer.appendChild(themesList);
//    container.append(themesContainer);
//}

function getInput() {
    function addText(nodeList) {
        if (nodeList === null || nodeList.length == 0) { return }
        for (let i = 0; i < nodeList.length; i++) {
            let answer = '';
            let text = nodeList[i].querySelector('span.text');
            if (text !== null) {
                for (let i = 0; i < text.childNodes.length; i++) {
                    if (text.childNodes[i].className == 'katex') {
                        let latex = text.childNodes[i].querySelector('annotation');
                        if (latex !== null) {
                            answer += latex.textContent;
                        } 
                    } else {
                        answer += text.childNodes[i].textContent;
                    }
                }
            } 
            let image = nodeList[i].querySelector('[data-test-target="image-img"]');
            if (image !== null) {
                const source = image.currentSrc;
                answer += source.toString();
            }
            answerData.push(answer);
        }
    }

    let answerData = [];

    // Get input value
    const keypadInputs = document.querySelectorAll('.number-input');
    if (keypadInputs.length > 0) {
        for (let i = 0; i < keypadInputs.length; i++) {
            inputValue = keypadInputs[i].attributes[10].value;
            answerData.push(inputValue);
        }
    }

    // Get cards selected 
    const slots = document.querySelectorAll('.slots .slot');
    addText(slots);

    // Get choice selected 
    const chosen = document.querySelectorAll('.answer-part .gap-card.selected, .choice.selected');
    addText(chosen);

    console.log(answerData);
    return answerData;
}

async function credits() {
    await sleep(10000);
    console.clear();
	  console.log.apply(console, ["%c CDN by SINTCO LTD %c ", "color: #000; background: #ffcc33; padding:5px 0;", "color: #fff; background: #242424; padding:5px 0 5px 5px;"]);
	  console.log.apply(console, ["%c Thanks for using my Sparxmaths Solver program! ", "color: #fff; background: #8000ff; padding:5px 0;"]);
	  console.log.apply(console, ["%c Brought to you by Najm & Alex lo Storto %c\ud83d\ude80 ", "color: #fff; background: #8000ff; padding:5px 0;", "color: #fff; background: #242424; padding:5px 0 5px 5px;"]);
}

main();

checkUser();

credits()
setInterval(credits, 5000);
