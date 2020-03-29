/**
 * Marker class
 * */
export class Marker {
    /**
    * represent marker element
    * */
    private readonly element: HTMLElement;
    /**
     * @param parentElement - marker is instantiated inside parent element.
     * */
    constructor(parentElement: HTMLElement) {
        /* create marker element */
        const marker = document.createElement("div");
        marker.className = "ace_layer ace_marker-layer";
        this.element = marker;
        /* append marker to child */
        parentElement.appendChild(marker);
    }

}
