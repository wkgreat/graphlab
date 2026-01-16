export interface DemoInfo {
    name: string
    category: string
    url: string
    description: string
}

export function getAllDemos(): DemoInfo[] {
    const modules = import.meta.glob("./demos/**/meta.json", { eager: true, import: 'default' });
    console.log(modules);
    const demos = Object.keys(modules).map(path => {

        const meta = modules[path] as object;
        const name = meta["name"];
        const category = "";
        let url = "";
        if (meta["external"]) {
            url = meta["url"];
        } else {
            let pathlst = path.split("/");
            pathlst = pathlst.slice(1, pathlst.length);
            pathlst[pathlst.length - 1] = meta["html"];
            url = `src/${pathlst.join("/")}`;
        }
        const description = meta["description"];

        return {
            name,
            category,
            url: url,
            description
        };
    })
    return demos;
}

export const GRAPHLAB_DEMOS = getAllDemos();