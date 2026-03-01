override workGroupSizeX : u32 = 128u;

@group(0) @binding(0) var<storage, read_write> splatIndex: array<u32>;

@compute
@workgroup_size(workGroupSizeX)
fn splatIndexInit(
    @builtin(global_invocation_id) gid : vec3<u32>
) {
    splatIndex[gid.x] = gid.x;
}