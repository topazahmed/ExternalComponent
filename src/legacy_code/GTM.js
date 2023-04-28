window.dataLayer = window.dataLayer || [];

var target = document.getElementsByTagName('body')[0];

let entityType = "";
console.log("Custom external react component loaded.");
var locationParts = location.pathname.toLocaleLowerCase().split("/");
if (locationParts.indexOf("asset") > -1) {
    entityType = "Asset";
} else if (locationParts.indexOf("collection") > -1) {
    entityType = "Collection";
}
var entityId = location.pathname.split("/").pop();
console.log("Entity id: " + entityId);

function shareLinkEventHandler(event) {
    createEventHandler(event, "Share link button clicked", "Share_Collection_Link", "Share link Clicked for public collection id: " + entityId);
};

function publicLinkEventHandler(event) {
    createEventHandler(event, "Public link button clicked", "Public_Link", "Public link Clicked for asset id: " + entityId);
};

function shareEmaailEventHandler(event) {
    createEventHandler(event, "Share via Email button clicked", "Share_Via_Email", "Share via email Clicked for asset id: " + entityId);
};

function createEventHandler(event, message, eventName, eventDescription) {
    event.stopImmediatePropagation();
    console.log(message);

    pushToGoogle(
        eventName,
        eventDescription,
        entityType,
        entityId
    );
}

var observer = new MutationObserver(function (mutations, mutationInstance) {
    mutations.forEach(function (mutation) {
        var shareCollectionLinkButton = $('#mModalAction[title="Share link"][aria-label="Share link"]')[0];
        var createPublicLinkButtons = $('.btn.btn-default[title="Public links"]')[0];
        var shareViaEmailButton = $('#share-via-email.btn.btn-default[title="Share via email"]')[0];

        if (shareCollectionLinkButton) {
            $(shareCollectionLinkButton).one('click', shareLinkEventHandler);
            mutationInstance.disconnect();
        }

        if (createPublicLinkButtons) {
            $(createPublicLinkButtons).on('click', publicLinkEventHandler);
            mutationInstance.disconnect();
        }

        if (shareViaEmailButton) {
            $(shareViaEmailButton).on('click', shareEmaailEventHandler);
            mutationInstance.disconnect();
        }

    });
});

// configuration of the observer:
var config = {
    attributes: true,
    childList: true,
    characterData: true
};

// pass in the target node, as well as the observer options
observer.observe(target, config);

function pushToGoogle(
    event,
    description,
    entityType,
    entityId
) {
    var GtmData = {
        event: event,
        description: description,
        entityType: entityType,
        entityId: entityId || location.pathname.split("/").pop(),
        url: location.pathname,
    };
    //console.log(GtmData);
    window.dataLayer.push(GtmData);
}