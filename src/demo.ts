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

        const category = "";
        let pathlst = path.split("/");
        pathlst = pathlst.slice(1, pathlst.length);
        pathlst[pathlst.length - 1] = meta["html"];
        const url = pathlst.join("/");
        const description = meta["description"];

        const name = meta["name"];

        return {
            name,
            category,
            url: `src/${url}`,
            description
        };
    })
    return demos;
}

export const GRAPHLAB_DEMOS = getAllDemos();