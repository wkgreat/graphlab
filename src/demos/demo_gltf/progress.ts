export const IBLPorgressHook = (p: number, msg: string) => {
    const progressDiv = document.getElementById("progress-wraper");
    const span = document.getElementById("progress-text");
    if (progressDiv == null) {
        return;
    }
    if (span != null) {
        span.innerText = msg;
    }

    if (p < 100) {
        progressDiv.style.display = "flex";
    }

    if (p === 100) {
        progressDiv.style.display = "none";
    }
}