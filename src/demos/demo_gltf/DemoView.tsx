import { Box } from "@radix-ui/themes";
import type { FC } from "react";
import GLTFTreeView from "./GLTFTreeView";
import React, { useEffect } from "react";
import { GLTFDemo } from "./demo";
import GLTF, { type GLTFRef } from "../../commons/format/gltf/gltf";

import DamagedHelmetGLTFURL from '/data/mesh/gltf/DamagedHelmet/DamagedHelmet.gltf?url';
import ChronographWatchGLTFURL from '/data/mesh/gltf/ChronographWatch/ChronographWatch.gltf?url';
import CarConceptGLTFURL from '/data/mesh/gltf/CarConcept/CarConcept.gltf?url';
import DiffuseTransmissionTeacupGLTFURL from '/data/mesh/gltf/DiffuseTransmissionTeacup/DiffuseTransmissionTeacup.gltf?url';
import { mat4 } from "gl-matrix";

interface GLTFSource {
    name: string
    gltf: GLTF
    scene: GLTFRef
    matrix: mat4
}

const GLTFResources: { [key: string]: GLTFSource } = {
    DamagedHelmet: {
        name: "DamagedHelmet",
        gltf: new GLTF({ uri: DamagedHelmetGLTFURL }),
        scene: 0,
        matrix: (() => {
            const m = mat4.create();
            mat4.rotateX(m, m, Math.PI / 2);
            mat4.rotateY(m, m, Math.PI);
            return m;
        })()
    },
    ChronographWatch: {
        name: "ChronographWatch",
        gltf: new GLTF({ uri: ChronographWatchGLTFURL }),
        scene: 0,
        matrix: mat4.create()
    },
    CarConcept: {
        name: "CarConcept",
        gltf: new GLTF({ uri: CarConceptGLTFURL }),
        scene: 0,
        matrix: mat4.create()
    },
    DiffuseTransmissionTeacup: {
        name: "DiffuseTransmissionTeacup",
        gltf: new GLTF({ uri: DiffuseTransmissionTeacupGLTFURL }),
        scene: 0,
        matrix: (() => {
            const m = mat4.create();
            // mat4.rotateX(m, m, Math.PI / 2);
            return m;
        })()
    }
}

interface DemoViewProps {}

const DemoView: FC<DemoViewProps> = (props) => {

    const [showSidebar, setShowSidebar] = React.useState(true);
    const [ready, setReady] = React.useState(false);
    const [gltf, setGLTF] = React.useState(null);
    const demoRef = React.useRef<GLTFDemo>(null);

    if (demoRef.current === null) {
        demoRef.current = new GLTFDemo();
    }

    useEffect(() => {
        demoRef.current.onReady(() => {
            const gltfSource = GLTFResources.CarConcept;
            gltfSource.gltf.onReady(() => {
                demoRef.current.addGLTF(gltfSource);
                setGLTF(gltfSource.gltf);
            });
            demoRef.current.draw();
        });
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