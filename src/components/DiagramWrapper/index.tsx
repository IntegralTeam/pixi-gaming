import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import * as React from 'react';

import './Diagram.css';

interface DiagramProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

export class DiagramWrapper extends React.Component<DiagramProps, {}> {
  /**
   * Ref to keep a reference to the Diagram component, which provides access to the GoJS diagram via getDiagram().
   */
  private diagramRef: React.RefObject<ReactDiagram>;

  /** @internal */
  constructor(props: DiagramProps) {
    super(props);
    this.diagramRef = React.createRef();
  }

  /**
   * Get the diagram reference and add any desired diagram listeners.
   * Typically the same function will be used for each listener, with the function using a switch statement to handle the events.
   */
  public componentDidMount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Get the diagram reference and remove listeners that were added during mounting.
   */
  public componentWillUnmount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Diagram initialization method, which is passed to the ReactDiagram component.
   * This method is responsible for making the diagram and initializing the model, any templates,
   * and maybe doing other initialization tasks like customizing tools.
   * The model's data should not be set here, as the ReactDiagram component handles that.
   */
  private initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram =
      $(go.Diagram,
        {
          'undoManager.isEnabled': false,  // must be set to allow for model change listening
          layout: $(go.ForceDirectedLayout),
          model: $(go.GraphLinksModel,
            {
              linkKeyProperty: 'key',  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
              // positive keys for nodes
              makeUniqueKeyFunction: (m: go.Model, data: any) => {
                let k = data.key || 1;
                while (m.findNodeDataForKey(k)) k++;
                data.key = k;
                return k;
              },
              // negative keys for links
              makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
                let k = data.key || -1;
                while (m.findLinkDataForKey(k)) k--;
                data.key = k;
                return k;
              }
            })
        });

    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, 'Auto',  // the Shape will go around the TextBlock
        {doubleClick: function(e, node) {
          diagram.zoomToRect(node.actualBounds);
          diagram.centerRect(node.actualBounds);
        }},
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'Ellipse',
          {
            name: 'SHAPE', fill: 'white', strokeWidth: 0,
            // set the port properties:
            portId: '', fromLinkable: false, toLinkable: false, cursor: 'pointer'
          },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
        $(go.TextBlock,
          { margin: 8, editable: false, font: '400 .875rem Roboto, sans-serif' },  // some room around the text
          new go.Binding('text').makeTwoWay()
        )
      );

    // relinking depends on modelData
    const path = 'm 990 491.9 c -2.9 -77.9 -157.9 -95.4 -334.7 -90.1 l -102.6 -155.4 h 4.5 c 9.4 0 17.1 -7.6 17.1 -17 c 0 -9.3 -7.7 -16.9 -17.1 -16.9 h -27 l -101.3 -153.5 c -9.4 -16.3 -30.3 -21.8 -46.6 -12.4 s -21.9 30.1 -12.5 46.3 l 3.6 5.5 l 58.5 319.2 c -112.5 11.8 -210.2 26.5 -259.4 34.4 c -0.5 -0.7 -0.2 -1.6 -0.8 -2.2 l -102.8 -108.7 c -13.1 -13.8 -34.3 -13.8 -47.4 0 l -11.5 12 c 21.7 31.9 35.2 74.7 35.2 122 c 0 47.2 -13.5 89.8 -35 121.7 l 11.2 11.9 c 13.1 13.8 34.3 13.8 47.4 0 l 66 -69.9 c 4 0.6 7.7 1.8 11.9 1.8 c 0 0 130.4 15.3 288.7 25 l -62.1 336.1 l -3.6 5.5 c -9.4 16.1 -3.8 36.9 12.5 46.2 c 16.3 9.4 37.2 3.8 46.6 -12.4 l 89.7 -135.5 h 21.6 c 9.4 0 17 -7.6 17 -16.9 c 0 -9.1 -7.3 -16.3 -16.4 -16.6 l 132 -198.6 c 172.2 -0.8 319.6 -19.4 317.3 -81.5 Z';
    var W_geometry = go.Geometry.parse(path, false);
    diagram.linkTemplate =
      $(go.Link,
        $(go.Shape),
        $(go.Shape, { toArrow: 'Standard' }),
        $(go.Shape, { geometry: W_geometry, strokeWidth: 2, width: 40, height: 40, fill: 'black' }),
      );

    diagram.isReadOnly = true;
    return diagram;
  }

  public render() {
    return (
      <ReactDiagram
        ref={this.diagramRef}
        divClassName='diagram-component'
        initDiagram={this.initDiagram}
        nodeDataArray={this.props.nodeDataArray}
        linkDataArray={this.props.linkDataArray}
        modelData={this.props.modelData}
        onModelChange={this.props.onModelChange}
        skipsDiagramUpdate={this.props.skipsDiagramUpdate}
      />
    );
  }
}