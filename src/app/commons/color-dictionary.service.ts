import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ColorDictionaryService {

    colorDictionary: Map<String, any>;

    constructor() {
        this.colorDictionary = new Map<string, any>();

        this.colorDictionary.set('yellow', {"fill": "#F7F587", "fill-opacity": "0.3", "mix-blend-mode": "multiply"} );
        this.colorDictionary.set('blue', {"fill": "#00FFFF", "fill-opacity": "0.3", "mix-blend-mode": "multiply"} );
        this.colorDictionary.set('red', {"fill": "#FF00FF", "fill-opacity": "0.3", "mix-blend-mode": "multiply"} );
    }

    getColor(color) {
        return this.colorDictionary.get(color);
    }
}
