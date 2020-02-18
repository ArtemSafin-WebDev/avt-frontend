/**
 * Type declerations for global development variables
 */
/* tslint:disable:interface-name ban-types no-namespace */
/*declare interface Window {
  // A hack for the Redux DevTools Chrome extension.
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <F extends Function>(f: F) => F;
  __INITIAL_STATE__?: any;
  jQuery?: any;
}*/

interface Window {
  // Allow us to put arbitrary objects in window
  [key: string]: any;
}
interface Webflow {
  // Allow us to put arbitrary objects in window
  [key: string]: any;
}
declare const Webflow: Webflow;

interface ObjectConstructor {
  assign(target: any, ...sources: any[]): any;
}
// Remove those when type definitions are available
interface NodeModule {
  hot: {
    accept: (pathToRootComponent: string, callback: () => void) => void,
  };
}

declare module 'react-hot-loader' {
  const AppContainer: (props?: { children: JSX.Element }) => JSX.Element;
}

declare module 'react-dropzone/dist/index' {
  import { CSSProperties, Component, DragEvent, InputHTMLAttributes } from "react";

  namespace Dropzone {
    export interface ImageFile extends File {
      preview?: string;
    }

    export type DropFileEventHandler = (acceptedOrRejected: ImageFile[], event: DragEvent<HTMLDivElement>) => void;
    export type DropFilesEventHandler = (accepted: ImageFile[], rejected: ImageFile[], event: DragEvent<HTMLDivElement>) => void;

    type PickedAttributes = "accept" | "className" | "multiple" | "name" | "onClick" | "onDragStart" | "onDragEnter" | "onDragOver" | "onDragLeave" | "style";

    export interface DropzoneProps extends Pick<InputHTMLAttributes<HTMLDivElement>, PickedAttributes> {
      disableClick?: boolean;
      disabled?: boolean;
      disablePreview?: boolean;
      preventDropOnDocument?: boolean;
      inputProps?: InputHTMLAttributes<HTMLInputElement>;
      maxSize?: number;
      minSize?: number;
      activeClassName?: string;
      acceptClassName?: string;
      rejectClassName?: string;
      disabledClassName?: string;
      activeStyle?: CSSProperties;
      acceptStyle?: CSSProperties;
      rejectStyle?: CSSProperties;
      disabledStyle?: CSSProperties;
      onDrop?: DropFilesEventHandler;
      onDropAccepted?: DropFileEventHandler;
      onDropRejected?: DropFileEventHandler;
      onFileDialogCancel?: () => void;
    }
  }

  class Dropzone extends Component<Dropzone.DropzoneProps> {
    open(): void;
  }
  export = Dropzone
}
