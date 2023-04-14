import React from "react";
import ReactDOM from "react-dom";
import LogViewer from "./LogViewer";

const OptionsContext = React.createContext<any>(null);

export default function createExternalRoot(container: HTMLElement) {
  return {
    render(context: any) {
      ReactDOM.render(
        <OptionsContext.Provider value={context.options}>
          <OptionsContext.Consumer>
            {(options) => {
              return <a>{context.entity.renditions.downloadOriginal[0]}</a> 
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