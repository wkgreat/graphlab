const INF:f32 = 1e30;

struct Stage {
    k: u32,
    j: u32,
    n: u32
}

struct SplatData {
    @align(16) ndspos: vec4f,
    @align(16) sigma2d: mat2x2f,
    @align(16) color: vec4f,
    @align(16) vertndspos: array<vec4f, 6>,
    @align(16) vertndcpos: array<vec4f, 6>
}

@group(0) @binding(0) var<uniform> stage: Stage;
@group(0) @binding(1) var<storage, read> splatData: array<SplatData>;
@group(0) @binding(2) var<storage, read_write> splatIndex: array<u32>;

override workGroupSizeX : u32 = 128u;

fn swapIndex(a:u32, b:u32) {
    let t = splatIndex[a];
    splatIndex[a] = splatIndex[b];
    splatIndex[b] = t;
}

@compute 
@workgroup_size(workGroupSizeX)
fn splatBitonicSort(
    @builtin(global_invocation_id) gid : vec3<u32>
) {
    let k = stage.k;
    let j = stage.j;
    let a = gid.x;
    let b = a ^ j;
    if(a<b) {
        //TODO 这里使用的ndspos的z值，正规一点应该使用视图控件的z值
        let za = select(-splatData[splatIndex[a]].ndspos.z, INF, a>=stage.n);
        let zb = select(-splatData[splatIndex[b]].ndspos.z, INF, b>=stage.n);
        let asc: bool = (a & k) == 0u;
        if(asc) {
            if(za > zb) {
                swapIndex(a,b);
            }
        } else {
            if(za < zb) {
                swapIndex(a,b);
            }
        }
    }
}
