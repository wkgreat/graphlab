export function showWGSL(code: string) {

    const lines = code.split("\n").map((line, i) => `${i + 1}\t ${line}`).join("\n");
    console.log(lines);

}