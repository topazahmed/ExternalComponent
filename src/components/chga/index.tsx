declare global {
  interface Window {
    dataLayer: any;
  }
}

export default async function createExternal(container: any) {
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

  //modal loaded so check the checkbox
  const CopyPublicLinkEventHandler = async (event: any) => {
    console.log("Public link copy button clicked");

    const copyPublicLinkButton = document.querySelectorAll(
      "[data-testid='copy-public-link']"
    )[0];
    var linkElement =
      copyPublicLinkButton?.parentElement?.parentElement?.getElementsByTagName(
        "a"
      )[0].innerText;

    pushToGoogle(
      "Copy_PublicLink",
      "Copied public link: " + linkElement,
      entityType,
      entityId
    );
  };

  //modal loaded so check the checkbox
  const createLinkEventHandler = (event: any) => {
    console.log("Create external link checkbox clicked");

    pushToGoogle(
      "Create_External_Link_Collection",
      "create external link for Public Collection",
      entityType,
      entityId
    );
  };

  const shareLinkEventHandler = async (event: any) => {
    console.log("Share link button clicked");

    await sleep(1000);
    var createExternalLinkButton = document.getElementById(
      `${entityId}-Create-external-link`
    );
    createExternalLinkButton?.addEventListener(
      "change",
      createLinkEventHandler
    );

    pushToGoogle(
      "Share_Collection_Link",
      "Share link Clicked for public collection id: " + entityId,
      entityType,
      entityId
    );
  };

  const shareEmailEventHandler = (event: any) => {
    console.log("Send Email popup open");

    pushToGoogle(
      "Send_Email_Popup_Open",
      "Opening popup to send email",
      entityType,
      entityId
    );
  };

  const copyLinkEventHandler = (event: any) => {
    console.log("Copy external link button clicked");
    pushToGoogle(
      "Copy_Collection_Link",
      "Copy Collection Link",
      entityType,
      entityId
    );
  };

  const shareAssetByEmailEventHandler = async (event: any) => {
    console.log("Share by email clicked");

    var emails = (
      document.querySelectorAll(
        "[data-testid='email-editor-input']"
      )[0] as HTMLElement
    ).innerText;

    pushToGoogle(
      "Send_Email",
      "Sending email to: " + emails.replaceAll("\n", ","),
      entityType,
      entityId
    );
  };

  const observer = new MutationObserver(function (mutations, mutationInstance) {
    const copyPublicLinkButton = document.querySelectorAll(
      "[data-testid='copy-public-link']"
    )[0];

    if (copyPublicLinkButton) {
      copyPublicLinkButton?.addEventListener(
        "click",
        CopyPublicLinkEventHandler
      );
      mutationInstance.disconnect();
    }

    const copyLinkButton = document.querySelectorAll(
      "[data-testid='copy-external-link']"
    )[0];

    if (copyLinkButton) {
      copyLinkButton?.addEventListener("click", copyLinkEventHandler);
      mutationInstance.disconnect();
    }
    const shareEmailButton = document.querySelectorAll(
      "[data-testid='share-via-email']"
    )[0];

    if (shareEmailButton) {
      shareEmailButton?.addEventListener("click", shareEmailEventHandler);
      mutationInstance.disconnect();
    }

    const shareAssetEmail = document.querySelectorAll(
      "[data-testid='modalSaveButton'][aria-label='Send']"
    )[0];

    if (shareAssetEmail) {
      shareAssetEmail?.addEventListener("click", shareAssetByEmailEventHandler);
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });

  return {
    render: async (context: { options: { entityId: any } }) => {
      document
        .querySelectorAll("[data-testid='sharePublicCollection']")[0]
        ?.addEventListener("click", shareLinkEventHandler);
    },
    unmount: () => {
      console.log("External component unmounted");
    },
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pushToGoogle(
  event: string | undefined,
  description: string | undefined,
  entityType: string | undefined,
  entityId: string | undefined
) {
  window.dataLayer.push({
    event: event,
    description: description,
    entityType: entityType,
    entityId: entityId || location.pathname.split("/").pop(),
  });
}
