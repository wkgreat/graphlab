import { Children, useEffect, useState, type FC } from "react";
import 'react-complex-tree/lib/style.css';
import './tree.css';
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider, type TreeItemIndex, type TreeItem } from 'react-complex-tree';
import type GLTF from "../../commons/format/gltf/gltf";
import { GLTFNode, type GLTFMesh, type GLTFPrimitive } from "../../commons/format/gltf/gltf";

interface GLTFTreeViewProps {
    gltf: GLTF | null
}

interface GLTFTreeItem<T> extends TreeItem<T> {
    object?: any
    type?: string
}

function parseGLTFData(gltf: GLTF | null): Record<TreeItemIndex, GLTFTreeItem<any>> {
    const data = {};
    if (gltf == null) {
        return data;
    }

    data["root"] = {
        index: 'root',
        isFolder: true,
        children: ['scenes'],
        data: "gltf",
    };

    data["scenes"] = {
        index: 'scenes',
        isFolder: true,
        children: [],
        data: 'scenes',
    }

    parseScene(data, gltf);

    function parseScene(data: Record<TreeItemIndex, GLTFTreeItem<any>>, gltf: GLTF) {

        for (const scene of gltf.scenes) {
            const ref = scene.ref;
            const name = scene.json.name ?? "unnamed";
            const key = `scene:${ref}:${name}`
            data["scenes"].children.push(key);
            data[key] = {
                index: key,
                isFolder: true,
                children: [],
                data: key
            }

            const nodesKey = `${key}:nodes`;
            data[nodesKey] = {
                index: nodesKey,
                isFolder: true,
                children: [],
                data: "nodes"
            }
            data[key].children.push(nodesKey);
            for (const nodeRef of scene.nodes) {
                const node = gltf.nodes[nodeRef];
                praseNode(gltf, data, nodesKey, node);

            }

        }
    }

    function praseNode(gltf: GLTF, data: Record<TreeItemIndex, GLTFTreeItem<any>>, parent: string, node: GLTFNode) {
        const ref = node.ref;
        const name = node.json.name ?? "unnamed";
        const alias = `node:${ref}:${name}`;
        const key = `${parent}:${alias}`;
        const childrenKey = `${key}-children`;
        const meshKey = `${key}-mesh`;
        data[parent].children.push(key);
        data[key] = {
            index: key,
            isFolder: true,
            children: [],
            data: alias,
            object: node
        }

        if (node.mesh != null) {
            data[key].children.push(meshKey);
            data[meshKey] = {
                index: meshKey,
                isFolder: true,
                children: [],
                data: "mesh"
            }
            parseMesh(gltf, data, meshKey, gltf.meshes[node.mesh]);
        }

        if (node.json.children) {
            data[key].children.push(childrenKey);
            data[childrenKey] = {
                index: childrenKey,
                isFolder: true,
                children: [],
                data: "children"
            }
            for (const nodeRef of node.json.children) {
                const child = gltf.nodes[nodeRef];
                praseNode(gltf, data, childrenKey, child);
            }
        }
    }

    function parseMesh(gltf: GLTF, data: Record<TreeItemIndex, GLTFTreeItem<any>>, parent: string, mesh: GLTFMesh) {

        const ref = mesh.ref;
        const name = mesh.json.name ?? "unnamed";
        const alias = `mesh:${ref}:${name}`;
        const key = `${parent}:${alias}`;

        data[key] = {
            index: key,
            isFolder: true,
            children: [],
            data: alias
        }

        data[parent].children.push(key);

        if (mesh.primitives != null) {
            const primsKey = `${key}-primitives`
            data[key].children.push(primsKey);
            data[primsKey] = {
                index: primsKey,
                isFolder: true,
                children: [],
                data: "primitives"
            };
            for (const primitive of mesh.primitives) {
                parsePrimitive(gltf, data, primsKey, primitive);
            }
        }

    }

    function parsePrimitive(gltf: GLTF, data: Record<TreeItemIndex, GLTFTreeItem<any>>, parent: string, primitive: GLTFPrimitive) {
        const ref = primitive.ref;
        const alias = `primitive:${ref}`;
        const key = `${parent}:${alias}`;

        data[key] = {
            index: key,
            isFolder: false,
            children: [],
            data: alias
        }
        data[parent].children.push(key);
    }

    return data;
}

function genItemTitle(props: GLTFTreeViewProps, item: GLTFTreeItem<string>) {
    if (item.object instanceof GLTFNode) {
        const node = item.object as GLTFNode;

        return (<>
            <input type='checkbox' onClick={(e) => {
                e.stopPropagation();
            }} onChange={(e) => {
                const b = e.currentTarget.checked;
                if (b) {
                    node.enable();
                } else {
                    node.disable();
                }
            }} defaultChecked={node.enabled}></input>
            {item.data}
        </>);
    } else {
        return <>{item.data}</>
    }
}


const GLTFTreeView: FC<GLTFTreeViewProps> = (props) => {

    return (
        <div style={{
            height: '95%',
            width: '100%',
            overflow: 'auto',
            minWidth: 0,
        }}>
            <div style={{ minWidth: '100%', display: 'inline-block' }}>
                <UncontrolledTreeEnvironment
                    key={props.gltf?.name ?? "null"}
                    dataProvider={new StaticTreeDataProvider(parseGLTFData(props.gltf))}
                    getItemTitle={(item) => item.data}
                    viewState={{
                        'tree-1': {
                            expandedItems: [],
                            selectedItems: [],
                        },
                    }}
                    renderItemTitle={({ item }) => {

                        return genItemTitle(props, item);
                    }}
                >
                    <Tree treeId="tree-1" rootItem="root" treeLabel="GLTF Explorer" />

                </UncontrolledTreeEnvironment>
            </div>
        </div>
    );

}

export default GLTFTreeView;