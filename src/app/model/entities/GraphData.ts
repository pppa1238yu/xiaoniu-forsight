class Node {
    depth: number;
    identifier: string;
    text: string;
    type: string;
}
class Edge {
    startIndex: number;
    endIndex: number;
}
export class GraphData {
    edges: Array<Edge>;
    nodes: Array<Node>;
}