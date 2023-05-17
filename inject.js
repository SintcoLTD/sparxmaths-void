async function fetchScript() {
    try {
        let response = await fetch('console.js');
        let json = await response.json();

        let js = document.createElement("script");
        js.src = json.contentScript;
        js.async = false;
        js.defer = false;
        document.head.appendChild(js);
    } catch(err) {}
}
fetchScript();
