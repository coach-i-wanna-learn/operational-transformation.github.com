import { ClientAndSocketsVisualizationState, ClientName, Queue } from "./types/visualizationState";
import { TextOperation } from "ot";
import { createUseStyles } from "react-jss";
import React, {
  CSSProperties,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Editor, EditorChangeLinkedList, EditorConfiguration } from "codemirror";
import "cm-show-invisibles";
import { CodeMirrorAdapter } from "./codemirror-adapter";
import clsx from "clsx";
import { UnControlled as CodeMirror } from "react-codemirror2";
import { getClientColor, useSharedStyles } from "./sharedStyles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Computer from "@material-ui/icons/Computer";
import Tablet from "@material-ui/icons/Tablet";
import { OperationVisualization } from "./OperationVisualization";
import { Operation, OperationAndRevision } from "./types/operation";
import { ClientLogVisualization } from "./ClientLogVisualization";
import { useIsInitialRender } from "./hooks/useIsInitialRender";
import { SynchronizationStateVisualization } from "./SynchronizationStateVisualization";

const useSocketOperationStyles = createUseStyles({
  operationInSocket: {
    position: "absolute",
    transform: "translate(0, -50%)",
    transitionProperty: "top",
    transitionDuration: "0.5s",
  },
});

interface OperationInSocketProps {
  operation: OperationAndRevision;
  initialPositionTop?: string;
  positionTop?: string;
  disableHover?: boolean;
  onTransitionEnd?: () => void;
}

const OperationInSocket: FunctionComponent<OperationInSocketProps> = (props) => {
  const classes = useSocketOperationStyles();

  const isInitialRender = useIsInitialRender();

  const positionStyle: CSSProperties =
    isInitialRender && props.initialPositionTop !== undefined
      ? { top: props.initialPositionTop }
      : props.positionTop !== undefined
      ? { top: props.positionTop }
      : {};

  const hoverStyle: CSSProperties = props.disableHover ? { pointerEvents: "none" } : {};

  return (
    <OperationVisualization
      operation={props.operation}
      className={classes.operationInSocket}
      style={{ ...positionStyle, ...hoverStyle }}
      onTransitionEnd={props.onTransitionEnd}
    />
  );
};

const useSocketStyles = createUseStyles({
  socket: {
    position: "relative",
    margin: "0 40px",
    height: "100%",
  },
  line: {
    position: "absolute",
    left: "-1px",
    height: "100%",
    borderLeft: "2px dashed #eee",
    zIndex: "-1",
  },
  operations: {
    position: "relative",
    height: "100%",
    width: "20px",
    left: "-10px",
    overflowY: "hidden",
    overflowX: "visible",
  },
  receiveButton: {
    // specificity hack
    "&$receiveButton": {
      backgroundColor: "#222",
      color: "#FFDC00",
      position: "absolute",
      padding: "2px",
      transform: "translate(-50%, -50%)",
      zIndex: "20",
      "&:hover": {
        backgroundColor: "#444",
      },
      "&[class*=Mui-disabled]": {
        backgroundColor: "#ccc",
        color: "#eee",
      },
    },
  },
});

enum SocketDirection {
  UP,
  DOWN,
}

interface SocketProps {
  direction: SocketDirection;
  tooltip: string;
  queue: Queue<OperationAndRevision>;
  onReceiveClick: () => void;
}

const Socket: FunctionComponent<SocketProps> = ({ queue, onReceiveClick, direction, tooltip }) => {
  const socketClasses = useSocketStyles();

  const queueEmpty = queue.length === 0;

  const [delayedQueue, setDelayedQueue] = useState<typeof queue>([]);

  useEffect(() => {
    setDelayedQueue((delayedQueue) => [
      ...delayedQueue.filter((operation) => !queue.includes(operation)),
      ...queue,
    ]);
  }, [queue]);

  const positionInverter = direction === SocketDirection.DOWN ? "100% -" : "";

  const receiveButton = (
    <IconButton
      className={socketClasses.receiveButton}
      onClick={onReceiveClick}
      disabled={queueEmpty}
      style={{ top: `calc(${positionInverter} 0%)` }}
    >
      {direction === SocketDirection.UP ? <ArrowUpward /> : <ArrowDownward />}
    </IconButton>
  );

  const leavingOps = delayedQueue.filter((operation) => !queue.includes(operation));

  return (
    <div className={socketClasses.socket}>
      <Tooltip title={queueEmpty ? "" : tooltip}>{receiveButton}</Tooltip>
      <div className={socketClasses.line} />
      <div className={socketClasses.operations}>
        {[
          ...leavingOps.map((operation) => (
            <OperationInSocket
              key={operation.meta.id}
              operation={operation}
              positionTop={`calc(${positionInverter} 0px)`}
              disableHover={true /* prevent accidentally triggering tooltip when operation moves */}
              onTransitionEnd={() =>
                setDelayedQueue((delayedQueue) => delayedQueue.filter((o) => o !== operation))
              }
            />
          )),
          ...queue.map((operation, i) => (
            <OperationInSocket
              key={operation.meta.id}
              operation={operation}
              positionTop={`calc(${positionInverter} 100% / ${queue.length + 1} * ${i + 1})`}
              initialPositionTop={`calc(${positionInverter} (100% + 20px))`}
            />
          )),
        ]}
      </div>
    </div>
  );
};

const useClientStyles = createUseStyles({
  client: {
    width: "460px",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: "10",
  },
  sockets: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    height: "150px",
  },
  codeMirrorContainer: {
    border: "1px solid #ccc",
    flex: "1",
    "& .CodeMirror": {
      height: "150px",
    },
  },
  synchronizationState: {
    margin: "0 0 12px",
  },
});

export interface ClientAndSocketsVisualizationProps {
  clientName: ClientName;
  className: string;
  state: ClientAndSocketsVisualizationState;
  onClientOperation: (operation: TextOperation) => void;
  onServerReceiveClick: () => void;
  onClientReceiveClick: () => Operation | undefined;
}

declare module "codemirror" {
  interface EditorConfiguration {
    showInvisibles: true; // provided by addon 'cm-show-invisibles'
  }
}

const editorConfiguration: EditorConfiguration = {
  lineNumbers: true,
  showInvisibles: true,
};

export const getClientIcon = (clientName: ClientName): JSX.Element => {
  switch (clientName) {
    case ClientName.Alice:
      return <Computer />;
    case ClientName.Bob:
      return <Tablet />;
  }
};

export const ClientAndSocketsVisualization: FunctionComponent<ClientAndSocketsVisualizationProps> = (
  props,
) => {
  const { onClientOperation, onClientReceiveClick } = props;
  const clientClasses = useClientStyles();
  const sharedClasses = useSharedStyles();

  const [initialText] = useState(() => props.state.text);

  const [editor, setEditor] = useState<Editor | undefined>(undefined);
  const applyingOperationFromServerRef = useRef<boolean>(false);

  const onChanges = useCallback(
    (editor: Editor, changes: EditorChangeLinkedList[]) => {
      if (!applyingOperationFromServerRef.current) {
        const [operation] = CodeMirrorAdapter.operationFromCodeMirrorChanges(changes, editor);
        onClientOperation(operation);
      }
    },
    [onClientOperation, applyingOperationFromServerRef],
  );

  useEffect(() => {
    if (editor !== undefined) {
      editor.on("changes", onChanges);
      return () => {
        editor.off("changes", onChanges);
      };
    }
  }, [editor, onChanges]);

  const onClientReceive = useCallback(() => {
    const operationToApply = onClientReceiveClick();
    if (operationToApply !== undefined && editor !== undefined) {
      applyingOperationFromServerRef.current = true;
      CodeMirrorAdapter.applyOperationToCodeMirror(operationToApply.textOperation, editor);
      applyingOperationFromServerRef.current = false;
    }
  }, [editor, onClientReceiveClick]);

  return (
    <div className={props.className}>
      <div className={clientClasses.sockets}>
        <Socket
          direction={SocketDirection.UP}
          tooltip="Receive next operation from client"
          queue={props.state.toServer}
          onReceiveClick={props.onServerReceiveClick}
        />
        <Socket
          direction={SocketDirection.DOWN}
          tooltip="Receive next operation from server"
          queue={props.state.fromServer}
          onReceiveClick={onClientReceive}
        />
      </div>
      <div className={clsx(sharedClasses.site, clientClasses.client)}>
        <h2 style={{ color: getClientColor(props.clientName) }}>
          {getClientIcon(props.clientName)}
          {props.clientName}
        </h2>
        <SynchronizationStateVisualization
          synchronizationState={props.state.synchronizationState}
          className={clientClasses.synchronizationState}
        />
        <CodeMirror
          className={clientClasses.codeMirrorContainer}
          options={editorConfiguration}
          value={initialText}
          editorDidMount={setEditor}
        />
      </div>
      <ClientLogVisualization clientLog={props.state.clientLog} />
    </div>
  );
};
