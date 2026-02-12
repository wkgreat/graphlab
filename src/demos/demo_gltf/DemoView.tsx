import { Box } from "@radix-ui/themes";
import type { FC } from "react";
import React, { useEffect } from "react";
import GLTF, { type GLTFRef } from "../../commons/format/gltf/gltf";
import { GLTFDemo } from "./demo";
import GLTFTreeView from "./GLTFTreeView";

import { mat4 } from "gl-matrix";
import { Pane } from "tweakpane";
import CarConceptGLTFURL from '/data/mesh/gltf/CarConcept/CarConcept.gltf?url';
import ChronographWatchGLTFURL from '/data/mesh/gltf/ChronographWatch/ChronographWatch.gltf?url';
import DamagedHelmetGLTFURL from '/data/mesh/gltf/DamagedHelmet/DamagedHelmet.gltf?url';
import DiffuseTransmissionTeacupGLTFURL from '/data/mesh/gltf/DiffuseTransmissionTeacup/DiffuseTransmissionTeacup.gltf?url';

import modern_evening_stree_url from '/data/ibl/modern_evening_stree/ibl.json?url';
import ferndale_studio_04_url from '/data/ibl/ferndale_studio_04/ibl.json?url';
import IBL from "../../commons/ibl";

interface GLTFSource {
    name: string
    uri: string
    scene: GLTFRef
    matrix: mat4
}

const GLTFResources: Record<string, GLTFSource> = {
    DamagedHelmet: {
        name: "DamagedHelmet",
        uri: DamagedHelmetGLTFURL,
        scene: 0,
        matrix: (() => {
            const m = mat4.create();
            mat4.rotateX(m, m, Math.PI / 2);
            return m;
        })()
    },
    ChronographWatch: {
        name: "ChronographWatch",
        uri: ChronographWatchGLTFURL,
        scene: 0,
        matrix: mat4.create()
    },
    CarConcept: {
        name: "CarConcept",
        uri: CarConceptGLTFURL,
        scene: 0,
        matrix: mat4.create()
    },
    DiffuseTransmissionTeacup: {
        name: "DiffuseTransmissionTeacup",
        uri: DiffuseTransmissionTeacupGLTFURL,
        scene: 0,
        matrix: (() => {
            const m = mat4.create();
            mat4.rotateX(m, m, Math.PI / 2);
            return m;
        })()
    }
}

interface IBLSource {
    name: string;
    uri: string;
}

const IBLSources: Record<string, IBLSource> = {
    modern_evening_stree: {
        name: "modern_evening_stree",
        uri: modern_evening_stree_url
    },
    ferndale_studio_04: {
        name: "ferndale_studio_04",
        uri: ferndale_studio_04_url
    }
}

interface DemoViewProps {}

const DemoView: FC<DemoViewProps> = (props) => {

    const [showSidebar, setShowSidebar] = React.useState(true);
    const [ready, setReady] = React.useState(false);
    const [gltf, setGLTF] = React.useState(null);
    const demoRef = React.useRef<GLTFDemo>(null);
    const paneRef = React.useRef<Pane>(null);
    const paneDataRef = React.useRef<object>(null);

    useEffect(() => {
        if (demoRef.current == null) {
            demoRef.current = new GLTFDemo();
        }
        if (paneDataRef.current == null) {
            paneDataRef.current = {
                gltf: GLTFResources.DamagedHelmet.name,
                ibl: IBLSources.modern_evening_stree.name
            }
        }
        if (paneRef.current == null) {
            paneRef.current = new Pane({
                title: "设置"
            });
            const gltfOptions = Object.fromEntries(Object.entries(GLTFResources).map(([k, v]) => [k, k]));
            paneRef.current.addBinding(paneDataRef.current, "gltf" as never, {
                label: "glTF模型",
                options: gltfOptions
            }).on("change", (e) => {
                const resource = GLTFResources[e.value];
                const gltf = new GLTF({ uri: resource.uri, name: resource.name });
                gltf.onReady(() => {
                    setGLTF(gltf);
                    demoRef.current.clearAndDestroyGLTFModels();
                    demoRef.current.addGLTFModel({
                        gltf,
                        ...resource
                    });
                })
            });

            const iblOptions = Object.fromEntries(Object.entries(IBLSources).map(([k, v]) => [k, k]));
            paneRef.current.addBinding(paneDataRef.current, "ibl" as never, {
                label: "IBL环境图",
                options: iblOptions
            }).on("change", (e) => {
                const source = IBLSources[e.value];
                IBL.loadFromURI(source.uri).then(ibl => {
                    const oldIBL = demoRef.current.scene.ibl;
                    demoRef.current.scene.setIBL(ibl);
                    oldIBL.destroy();
                });
            })
        }
        demoRef.current.setPane(paneRef.current);
        demoRef.current.onReady(() => {
            const gltfSource = GLTFResources.DamagedHelmet;
            const gltf = new GLTF({ uri: gltfSource.uri, name: gltfSource.name })
            gltf.onReady(() => {
                demoRef.current.addGLTFModel({ gltf, ...gltfSource });
                setGLTF(gltf);
            });
            demoRef.current.draw();
        });

        return () => {
        }

    }, [])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row', // 显式声明
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000'
        }}>
            <aside
                style={{
                    height: '100%',
                    width: showSidebar ? '300px' : '0px',
                    flexShrink: 0,
                    transition: 'width 0.2s ease',
                    overflow: 'hidden',
                    backgroundColor: '#1e1e1e',
                    borderRight: showSidebar ? '1px solid #333' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                className={showSidebar ? 'siderbar-open' : 'siderbar-close'}
            >
                <div style={{ height: '100%', width: '300px', flexShrink: 0 }}>
                    <div style={{
                        height: "5%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>glTF可视化</div>
                    <GLTFTreeView gltf={gltf} />
                </div>
            </aside >
            <Box id="demo-div" style={{
                flex: 1,           /* 强制占据剩余空间 */
                position: 'relative', /* 为内部绝对定位提供参考 */
                minWidth: 0,       /* 允许 flex 项缩小，防止挤出屏幕 */
                height: '100%',
                overflow: 'hidden' /* 裁剪任何溢出内容 */
            }}>
                <canvas id="webgpu-canvas" className="demo-webgpu-canvas" style={{
                    position: 'absolute', /* 使用绝对定位强制铺满容器 */
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    touchAction: 'none' /* WebGPU/WebGL 交互建议设置 */
                }}></canvas>
            </Box>
        </div >
    );
}

export default DemoView;