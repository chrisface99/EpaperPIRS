
function select(id){ 
    // update Property Panel on country button click
    channel.publish("data", {
        type: "widgetManifest",
        payload: {
            MAP: [
                // clear gridImage value to make sure the next click on map button is detected
                {
                    id: "mapClick",
                    value: ""
                },  
                // display Property Panel's elements with lat and long + update their values 
                {
                    id: "long",
                    value: `here goes ${id}'s longitude`,
                    viewState: "show"
                },
                {
                    id: "lat",
                    value: `here goes ${id}'s latitude`,
                    viewState: "show"
                }
            ]
        }
    }
    )
    
    // hide buttons after selectiom
    for (let i=0; i<3; i++) {
        buttons[i].style.display = "none";
    }
    // return to timetable view
    body.style.backgroundImage = "url(./transitLight.jpg)";

    // display appropriate header based on User's selection
    header.innerText = `Transit info for ${id}`;

    selection = id
}

function handleConfig(config){
    // for debugging
    console.log("config: ", JSON.stringify(config))

    if (config.MAP.mapClick !== "") {
        // everytime the map button is clicked, we increment counter
        counter += 1

        if (counter === 1) {
            // display map on the Widget when the map button (in Property Panel) is clicked
            // display appropriate header if User wants to change location
            // display buttons on the Widget to enable location selection
         body.style.backgroundImage = "url(./map.jpg)";
         header.innerText = "Select location..."
         for (let i=0; i<3; i++) {
            buttons[i].style.display = "block";
        }
        }
       
        // if the map button has been clicked twice, cancel operation
        else if (counter > 1){
            console.log("reset counter, revert")
            counter = 0 
            for (let i=0; i<3; i++) {
                buttons[i].style.display = "none";
            }
            console.log(selection)
            switch (selection){
                case "Spain":
                    select("Spain")
                    break;
                case "France":
                    select("France")
                    break;
                case "Italy":
                    select("Italy")
                    break;
                case "default":
                    body.style.backgroundImage = "none"
                    header.innerText = "Default location"
                    break;
                default:
                    console.log("something went wrong when reverting to previous state")                    
            }
        }
    
  
    }
}

        function makeEditable(element) {
            if (element.isContentEditable) return;
            
            element.contentEditable = true;
            element.focus();
            
            // Select all text
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            function finishEdit(e) {
                if (e.type === 'blur' || (e.type === 'keydown' && e.key === 'Enter')) {
                    element.contentEditable = false;
                    element.removeEventListener('blur', finishEdit);
                    element.removeEventListener('keydown', finishEdit);
                    
                    // Clean up HTML for single-line elements
                    if (!element.classList.contains('banner-large') && 
                        !element.classList.contains('special-offer') &&
                        !element.classList.contains('main-title') &&
                        !element.classList.contains('subtitle')) {
                        element.innerHTML = element.innerText;
                    }
                }
            }
            
            element.addEventListener('blur', finishEdit);
            element.addEventListener('keydown', finishEdit);
        }
        
        // Auto-adjust font size for long item names
        document.addEventListener('DOMContentLoaded', function() {
            function adjustItemNameSize() {
                document.querySelectorAll('.item-name').forEach(function(el) {
                    const length = el.innerText.length;
                    if (length > 12) {
                        el.style.fontSize = Math.max(1.0, 1.3 - (length - 12) * 0.05) + 'rem';
                    } else {
                        el.style.fontSize = '1.3rem';
                    }
                });
            }
            
            adjustItemNameSize();
            
            // Re-adjust after editing
            document.querySelectorAll('.item-name').forEach(function(el) {
                el.addEventListener('input', adjustItemNameSize);
                el.addEventListener('blur', adjustItemNameSize);
            });
        });

function createChannel() {
    channel = $vxt.createChannel($vxtSubChannelId);

    channel.subscribe("config", (response) => handleConfig(response.data));

}

function waitForVxtApi() {
    const interval = setInterval(() => {
        if (window.$vxt) {
            clearInterval(interval);
            createChannel();
        }
    }, 100)
}

waitForVxtApi();