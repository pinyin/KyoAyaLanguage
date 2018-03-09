import 'core-js/fn/string'
const ClipboardJS = require('./clipboard.min.js') || window['ClipboardJS']
console.log(ClipboardJS)

const input = document.getElementById("input") as HTMLDivElement
const output = document.getElementById("output") as HTMLDivElement

const tapGuide = document.getElementById("tap-guide") as HTMLDivElement
const inputGuide = document.getElementById("input-guide") as HTMLDivElement

const copy = document.getElementById("copy") as HTMLDivElement
const clipboard = new ClipboardJS('#copy');

clipboard.on('success', function(e: any) {
    alert("📝 👌")
    e.clearSelection();
});

input.innerText = ""
output.innerText = encodeOrDecode(input.innerText)
copy.style.opacity = `0.1`

document.addEventListener('click', ()=> {
    const isFocusingOnInput = document.activeElement === input
    const inputHasText = input.innerText.length > 1
    tapGuide.style.opacity =
        `${isFocusingOnInput || inputHasText ? 0.1 : 1}`
}, {capture: true})

document.addEventListener('input', () => {
    inputGuide.style.opacity =
        `${input.innerText.length > 1 ? 0.1: 1}`
    output.innerText = encodeOrDecode(input.innerText)
    copy.style.opacity =
        `${output.innerText.length > 1 ? 1: 0.1}`
})

const numToEmoji = ["🕊️", "🎀", "🐑", "🍅", "🍨", "🍮"]
const emojiToNum = {
    "🕊️": 0, "🕊": 0,
    "🎀": 1,
    "🐑": 2,
    "🍅": 3,
    "🍨": 4,
    "🍮": 5, "🍮️": 5
}
const separator = "❤️"

function encodeOrDecode(text: string): string {
    return isKyoAyaLanguage(text)
        ? output.innerText = decode(text)
        : output.innerText = encode(text)
}

function isKyoAyaLanguage(text: string): boolean {
    if(text.length === 0)
        return false

    const charArray = Array.from(text)
    const kyoAyaLangCount = charArray
        .filter(char=> emojiToNum[char] >= 0)
        .length
    const totalCount = charArray.length
    return kyoAyaLangCount / totalCount > 0.1
}

function encode(text: string): string {
    if(!text || text === "")
        return ""

    return Array.from(text)
        .map(char=> char.codePointAt(0)!)
        .map(charCode=> charCode.toString(6))
        .map(charCodeDigits=> {
            const emojiIndices: Array<number> = []
            for(let digit of charCodeDigits)
                emojiIndices.push(parseInt(digit, 6))
            const charEmojis = emojiIndices
                .map(emojiIndex=> numToEmoji[emojiIndex])
                .join('')
            return charEmojis
        })
        .join(separator)
}

function decode(emoji: string): string {
    if(!emoji || emoji === "")
        return ""

    return emoji
        .split(separator)
        .map(emojisStr=> {
            const emojisArray: Array<string> = Array.from(emojisStr)
            const codePointStr = emojisArray
                .map(emojiChar=> emojiToNum[emojiChar])
                .filter(index=> index >= 0)
                .map(index=> index + '')
                .join('')
            return codePointStr
        })
        .filter(str=> str !== "")
        .map(str=> parseInt(str, 6))
        .map(codePoint=> String.fromCodePoint(codePoint))
        .join('')
}
