import React from "react";
import ReactDOM from "react-dom";

const OptionsContext = React.createContext<any>(null);

// const onEntitySaved = (evt: Event): void => {
//     const { definitionName, id } = (evt as CustomEvent<{ definitionName: string; id: number }>).detail;

//     alert(`Entity with id ${id} and definition ${definitionName} was saved`);
// };

//const EVENT_NAME = "ENTITY_SAVED";
declare global{
    interface Window {dataLayer:any}
}

export default function createExternal (container:any) {
    let eventHandler: EventListenerOrEventListenerObject | null = null;

    const removeListener = () => {
        if (eventHandler) {
            //window.removeEventListener(EVENT_NAME, eventHandler);
            eventHandler = null;
        }
    };
    console.log("We are in here");

    return {
        render: (context: { options: { entityId: any; }; }) => {
            //removeListener();
            //var dataLayer:any = dataLayer || [];
            eventHandler = event => {
                console.log("button clicked");
                //window && window.dataLayer && 
                window.dataLayer.push({
                    event: "sharePublicCollection",
                    //entityId: context.options.entityId,
                    definitionName: 'sharePublicCollection', //event.detail.definitionName,
                    description: 'share Public Collection',
                    collectionId: '111'
                });

                console.log(window.dataLayer);
            }

            //window.addEventListener(EVENT_NAME, eventHandler);
            const button = document.querySelectorAll("[data-testid='sharePublicCollection']")[0];
            button?.addEventListener("click", eventHandler);

        },
        unmount: () => {
            removeListener();
        }
    };
};