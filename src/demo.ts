export interface DemoInfo {
    name: string
    category: string
    url: string
    description: string
}

export function getAllDemos(): DemoInfo[] {
    const modules = import.meta.glob("./demos/*/*.html", { eager: true }) as object;
    const demos = Object.keys(modules).map(demo => {
        const pathlst = demo.split("/");
        const name = pathlst[2];
        const category = "";
        const url = pathlst.slice(1, pathlst.length).join("/");
        return {
            name,
            category,
            url: `src/${url}`,
            description: "xxx"
        };
    })
    return demos;
}

export const GRAPHLAB_DEMOS = getAllDemos();