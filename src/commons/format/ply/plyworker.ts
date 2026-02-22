import { PLYLoader } from "./plyformat";

self.addEventListener("message", async (e) => {

    const { taskId, uri } = e.data;

    const ply = await PLYLoader.load(uri);

    self.postMessage({
        taskId,
        ply
    });

})