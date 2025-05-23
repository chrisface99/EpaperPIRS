// draw Property Panel
const configuration = {
    
    MAP:[

    // additional guide for User
    {
        type: "message",
        id: "guide1",
        value: "Click the Map to select preferred location... "
    },
    // display map
    {
        type: "gridImage",
        id: "mapClick",
        caption: "", // this caption is empty because it looked differently than message below and we want our app to look consistent - the role of the caption has been taken over by message above (id: guide1)
        value: "", // this property will get updated on click on the type:img button (specified in the list below) to its (type:img) value = path to image
        list: [
            {
                type: "img",
                id: "map",
                caption: "map",
                value: "https://cdn.pixabay.com/photo/2018/11/25/01/41/europe-night-map-3836707_960_720.jpg"
            }
        ]
    },
    // additional guide for User
    {
        type: "message",
        id: "guide2",
        value: "...then click 'View Mode' on the Widget. ",
        position: { // bring the message a bit closer to the map button (up)
            x: 0,
            y: -6
        }
    },
    // these two elements below are hidden by default and will be shown and their values will be updated based on User's selection later
        {
            type: "text",
            id: "long",
            caption: "Long:",
            value: "default longitude",
            viewState: "hide",
            position: { // position Long and Lat elements lower to separate them from the map button functionality (Lat element will follow Long when it comes to position)
                x: 0,
                y: 70
            }
        },
        {
            type: "text",
            id: "lat",
            caption: "Lat:",
            value: "default latitude",
            viewState: "hide"
        }
]
}



function createChannel() {

    const channel = $vxt.createChannel($vxtSubChannelId);

    channel.subscribe("get", (response) => {

        channel.publish("data", {
            type: "contents",
            payload: {

                categories: [{
                    name: "Transit", 
                    displayMode: "grid" // or "carousel" - if we have more than 2 widgets
                }], 

                content: [
                    {
                        resourceType: "CONTENT",
                        resourceId: "1",
                        resourceName: "Demo",
                        thumbnailPath: "https://cdn.pixabay.com/photo/2015/05/31/12/01/pay-791398_960_720.jpg",
                        isLandscape: true,
                        category: "Transit",
                        orientation: "landscape",
                        viewEdit: {
                            // extra guide for the User
                            message: "If you cannot see the map picker, click on the map button in Property Panel."
                        },
                        keywords: "demo",
                        config: configuration // Property Panel is sent in "config" property for showcasing purposes (to be able to insert comments)
                        // in real-life scenario, in such case, Property Panel would be defined in manifest.json in widget.zip file, not the "config" property
                    }
            ]
            }
        });
  
})}


function waitForVxtApi() {

    const interval = setInterval(() => {
        if (window.$vxt) {
            clearInterval(interval);
            createChannel();
        }
    }, 100);
};

waitForVxtApi();

