declare global {
  interface Window {
    dataLayer: any;
  }
}

export default async function createExternal(container: any) {
  let shareLinkEventHandler: EventListenerOrEventListenerObject | null = null;
  let createLinkEventHandler: any = null;
  let copyLinkEventHandler: EventListenerOrEventListenerObject | null = null;
  let shareEmailEventHandler: EventListenerOrEventListenerObject | null = null;

  let CopyPublicLinkEventHandler: EventListenerOrEventListenerObject | null =
    null;
  let publicLinkMenuItemEventHandler: EventListenerOrEventListenerObject | null =
    null;
  let shareAssetByEmailEventHandler: EventListenerOrEventListenerObject | null =
    null;

  const removeListener = () => {
    if (shareLinkEventHandler) {
      shareLinkEventHandler = null;
      createLinkEventHandler = null;
      copyLinkEventHandler = null;
      shareEmailEventHandler = null;

      CopyPublicLinkEventHandler = null;
      shareAssetByEmailEventHandler = null;
    }
  };

  let pageType = "";
  console.log("Custom external react component loaded!");
  var locationParts = location.pathname.toLocaleLowerCase().split("/");
  if (locationParts.indexOf("asset") > -1) {
    pageType = "Asset";
  } else if (locationParts.indexOf("collection") > -1) {
    pageType = "Colelction";
  }

  var entityId = location.pathname.split("/").pop();
  console.log("Collection id: " + entityId);

  const copyPublicLinkMenuItem = document.querySelectorAll(
    "[data-testid='publiclink']"
  )[0];

  const copyPublicLinkButton = await waitForElm(
    "[data-testid='copy-public-link']"
  );

  const shareAssetEmail = document.querySelectorAll(
    "[data-testid='modalSaveButton'][aria-label='Send']"
  )[0];
  console.log(shareAssetEmail);

  return {
    render: async (context: { options: { entityId: any } }) => {
      removeListener();

      shareAssetByEmailEventHandler = async (event: any) => {
        console.log("Share asset email clicked");

        // window.dataLayer.push({
        //   event: "copyPublicLink menu item",
        //   definitionName: "copyPublicLink",
        //   description: "Copy Public Link",
        //   assetId: entityId,
        // });
      };

      /*
      publicLinkMenuItemEventHandler = async (event: any) => {
        console.log("Public link menu item clicked");
        await sleep(1000);

        const copyPublicLinkButton = document.querySelectorAll(
          "[data-testid='copy-public-link']"
        )[0];

        var linkElement =
          copyPublicLinkButton?.parentElement?.previousElementSibling;
        var textToCopy = linkElement?.getAttribute("href");
        console.log(textToCopy);

        window.dataLayer.push({
          event: "copyPublicLink menu item",
          definitionName: "copyPublicLink",
          description: "Copy Public Link",
          assetId: entityId,
        });
      };
      */

      //modal loaded so check the checkbox
      createLinkEventHandler = (event: any) => {
        console.log("Create external link checkbox clicked");
        window.dataLayer.push({
          event: "createExternalLinkPublicCollection",
          definitionName: "createExternalLinkPublicCollection", //event.detail.definitionName,
          description: "create external link for Public Collection",
          collectionId: entityId,
        });
      };

      shareLinkEventHandler = async (event) => {
        console.log("Share link button clicked");

        await sleep(1000);
        var createExternalLinkButton = document.getElementById(
          `${entityId}-Create-external-link`
        );
        createExternalLinkButton?.addEventListener(
          "change",
          createLinkEventHandler
        );

        //gtm push for clicking the header button
        window.dataLayer.push({
          event: "sharePublicCollection",
          //entityId: context.options.entityId,
          definitionName: "sharePublicCollection", //event.detail.definitionName,
          description: "share Public Collection",
          collectionId: entityId,
        });
        //console.log(window.dataLayer);
      };

      copyLinkEventHandler = (event) => {
        console.log("Copy external link button clicked");
        window.dataLayer.push({
          event: "copyLinkPublicCollection",
          definitionName: "copyLinkPublicCollection", //event.detail.definitionName,
          description: "copy external link for Public Collection",
          collectionId: entityId,
        });
      };

      shareEmailEventHandler = (event) => {
        console.log("Email button clicked");
        window.dataLayer.push({
          event: "emailPublicCollection",
          //entityId: context.options.entityId,
          definitionName: "emailPublicCollection", //event.detail.definitionName,
          description: "email link for Public Collection",
          collectionId: entityId,
        });
        //console.log(window.dataLayer);
      };

      document
        .querySelectorAll("[data-testid='sharePublicCollection']")[0]
        ?.addEventListener("click", shareLinkEventHandler);

      const copyLinkButton = document.querySelectorAll(
        "[data-testid='copy-external-link']"
      )[0];
      copyLinkButton?.addEventListener("click", copyLinkEventHandler);

      const shareEmailButton = document.querySelectorAll(
        "[data-testid='share-via-email']"
      )[0];
      shareEmailButton?.addEventListener("click", shareEmailEventHandler);

      //copy Public link button
      //   copyPublicLinkMenuItem?.addEventListener(
      //     "click",
      //     publicLinkMenuItemEventHandler
      //   );

      //   copyPublicLinkButton?.addEventListener(
      //     "click",
      //     CopyPublicLinkEventHandler
      //   );

      shareAssetEmail?.addEventListener("click", shareAssetByEmailEventHandler);
    },
    unmount: () => {
      removeListener();
    },
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pushToGoogle(
  event: string,
  definition: string,
  description: string,
  entityType: string,
  entityId: string
) {
  window.dataLayer.push({
    event: event,
    type: entityType,
    definitionName: definition,
    description: description,
    entityId: entityId,
  });
}

function waitForElm(selector: string) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

//modal loaded so check the checkbox
const CopyPublicLinkEventHandler = async (event: any) => {
  console.log("Public link copy button clicked");

  //await sleep(1000);

  //   var linkElement = copyPublicLinkButton?.parentElement?.previousElementSibling;
  //   var textToCopy = linkElement?.getAttribute("href");
  //   console.log(textToCopy);

  window.dataLayer.push({
    event: "copyPublicLink",
    definitionName: "copyPublicLink",
    description: "Copy Public Link",
    //assetId: entityId,
  });
};

const observer = new MutationObserver(function (mutations, mutationInstance) {
  const copyPublicLinkButton = document.querySelectorAll(
    "[data-testid='copy-public-link']"
  )[0];
  if (copyPublicLinkButton) {
    console.log("public link copied");
    copyPublicLinkButton?.addEventListener("click", CopyPublicLinkEventHandler);
    mutationInstance.disconnect();
  }
});

observer.observe(document, {
  childList: true,
  subtree: true,
});
