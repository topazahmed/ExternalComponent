declare global {
  interface Window {
    dataLayer: any;
  }
}

export default function createExternal(container: any) {
  let shareLinkEventHandler: EventListenerOrEventListenerObject | null = null;
  let createLinkEventHandler: any = null;
  let copyLinkEventHandler: EventListenerOrEventListenerObject | null = null;
  let shareEmailEventHandler: EventListenerOrEventListenerObject | null = null;

  const removeListener = () => {
    if (shareLinkEventHandler) {
      shareLinkEventHandler = null;
      createLinkEventHandler = null;
      copyLinkEventHandler = null;
      shareEmailEventHandler = null;
    }
  };

  console.log("Custom external react component loaded!");
  var collectionId = location.pathname.split("/").pop();
  console.log("Collection id: " + collectionId);

  return {
    render: (context: { options: { entityId: any } }) => {
      removeListener();

      //modal loaded so check the checkbox
      createLinkEventHandler = (event: any) => {
        console.log("Create external link checkbox clicked");
        window.dataLayer.push({
          event: "createExternalLinkPublicCollection",
          definitionName: "createExternalLinkPublicCollection", //event.detail.definitionName,
          description: "create external link for Public Collection",
          collectionId: collectionId,
        });
      };

      shareLinkEventHandler = async (event) => {
        console.log("Share link button clicked");

        await sleep(1000);
        var createExternalLinkButton = document.getElementById(
          `${collectionId}-Create-external-link`
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
          collectionId: collectionId,
        });
        //console.log(window.dataLayer);
      };

      copyLinkEventHandler = (event) => {
        console.log("Copy external link button clicked");
        window.dataLayer.push({
          event: "copyLinkPublicCollection",
          definitionName: "copyLinkPublicCollection", //event.detail.definitionName,
          description: "copy external link for Public Collection",
          collectionId: collectionId,
        });
      };

      shareEmailEventHandler = (event) => {
        console.log("Email button clicked");
        window.dataLayer.push({
          event: "emailPublicCollection",
          //entityId: context.options.entityId,
          definitionName: "emailPublicCollection", //event.detail.definitionName,
          description: "email link for Public Collection",
          collectionId: collectionId,
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
    },
    unmount: () => {
      removeListener();
    },
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
