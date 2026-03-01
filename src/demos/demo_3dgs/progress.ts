import loadingSVG from './blocks-wave.svg?raw'

export function plyPorgressHook(p: number, s: string) {

    const wrapper = document.getElementById("progress-wrapper");
    const iconDiv = document.getElementById("progress-icon-div");
    const textDiv = document.getElementById("progress-text-div");

    if (p === 0) {
        wrapper.style.display = 'flex';
        iconDiv.innerHTML = loadingSVG;
    }

    textDiv.innerText = s;

    if (p === 100) {
        wrapper.style.display = 'none';
    }

}