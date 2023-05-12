import ReactDOM from "react-dom";
import React from "react";

const OptionsContext = React.createContext<any>(null);
//asset type 34139 image // 34138 document
//availability secured is 33973

// const getPublicLink = (context: any) => {
//   if (context?.entity?.relations?.AssetToPublicLink != null) {
//     context.client.entities
//       .getAsync(context.entity.relations?.AssetToPublicLink[0])
//       .then((result: any) => {
//         console.log(result);
//         return result.publicLink;
//       });
//   } else {
//     return "";
//   }
// };

let entityLoadedSubscription = async (context: any) => {
  // prepare query to get public links using Querying API
  let query =
    "Definition.Name == 'M.PublicLink' AND Parent('AssetToPublicLink').id == " +
    context.options.entityId;
  const theLinkHolder = document.getElementById("publicLinksToShare");
  if (theLinkHolder) {
    // fetch data from prepared query endpoint
    try {
      let publicLinksForEntity =
        "https://-----.sitecorecontenthub.cloud/api/entities/query?query=" +
        query;
      await fetch(publicLinksForEntity)
        .then((resp) => resp.json())
        .then(function (linkItems) {
          if (linkItems == null || linkItems.count == 0) {
            theLinkHolder.innerHTML =
              "No public links were found. Please create one.";
          }
          linkItems.items.forEach(function (item: any) {
            //console.log(theLinkHolder);
            //console.log(item);
            theLinkHolder.innerHTML = item.public_link;
          });
        });
    } catch {
      theLinkHolder.innerHTML =
        "No public links were found. Please create one.";
    }
  }
};

export default function createExternalRoot(container: HTMLElement) {
  return {
    render(context: any) {
      ReactDOM.render(
        <OptionsContext.Provider value={context.options}>
          <OptionsContext.Consumer>
            {(options) => {
              //console.log(context.entity);
              entityLoadedSubscription(context);
              return (
                <div>
                  {context?.entity?.relations?.AvailabilityToAsset == 33973 && (
                    <p>
                      <label>
                        <strong>Use this link to share externally</strong>
                      </label>
                      <br></br>
                      <span>
                        {window.location.protocol}//{`www.-----------.com`}
                        /download?{options.entityId}
                      </span>
                    </p>
                  )}
                  <p>
                    <label>
                      <strong>Use this link to add this to Sitecore</strong>
                    </label>
                    <br></br>
                    <span id="publicLinksToShare">
                      No public links were found. Please create one.
                    </span>
                  </p>
                </div>
              );
            }}
          </OptionsContext.Consumer>
        </OptionsContext.Provider>,
        container
      );
    },
    unmount() {
      ReactDOM.unmountComponentAtNode(container);
    },
  };
}
