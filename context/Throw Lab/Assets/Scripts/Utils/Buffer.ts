export class Buffer {

    private elements:any[] = []
    private bufferSize = 0

    constructor(size:number) {
        this.bufferSize = size
    }

    add(newElement) {
        this.elements.push(newElement)
        if ( this.elements.length > this.bufferSize) {
            this.elements.shift()
        }
    }

    size () {
        return this.elements.length
    }

    getOldestValue () {
        return this.elements[0]
    }

    getNewestValue () {
        return this.elements[this.elements.length-1]
    }

    getMostRecentFromInd (ind) {
        return this.elements[this.elements.length-1-ind]
    }

}
