const INF_F32:f32 = 1e30;
const INF_U32:u32 = 0xffffffffu;

struct SortStage {
    k: u32,
    j: u32
}

@group(0) @binding(0) var<uniform> stage: SortStage;
@group(0) @binding(1) var<storage, read_write> numbers: array<u32>;

override workGroupSizeX : u32 = 128u;

@compute 
@workgroup_size(workGroupSizeX)
fn bitonicSort(
    @builtin(global_invocation_id) gid : vec3<u32>
) {

    let k = stage.k;
    let j = stage.j;

    let a = gid.x;
    let b = a ^ j;
    let va = numbers[a];
    let vb = numbers[b];
    let asc: bool = (a & k) == 0u;
    if(a<b) {
        if(asc) {
            if(va > vb) {
                let t = numbers[a];
                numbers[a] = numbers[b];
                numbers[b] = t;
            }
        } else {
            if(va < vb) {
                let t = numbers[a];
                numbers[a] = numbers[b];
                numbers[b] = t;
            }
        }
    }

}
